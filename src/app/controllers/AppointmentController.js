import * as Yup from "yup";
import { startOfHour, parseISO, isBefore, format, subHours } from "date-fns";
import pt from "date-fns/locale/pt";
import { Op } from "sequelize";

import Appointment from "../models/Appointment";
import User from "../models/User";
import File from "../models/File";

import Notification from "../schemas/notification";

import CancellationMail from "../jobs/CancellationMail";
import Queue from "../../lib/Queue";

class AppointmentController {
  async index(req, res) {
    const { page } = req.query;

    const appointment = await Appointment.findAll({
      where: { user_id: req.userId, cancelled_at: null },
      order: ["date"],
      attributes: ["id", "date"],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        // mostrar os dados do relacionamento
        {
          model: User,
          as: "provider", // preciso falar qual User
          attributes: ["id", "name"], // mostrar apenas esses attributos
          include: [
            {
              model: File,
              as: "avatar",
              attributes: ["id", "path", "url"]
            }
          ]
        }
      ]
    });
    return res.json(appointment);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required()
    });

    if (!schema.isValid(req.body)) {
      return res.status(400).json({ error: "validation fails" });
    }

    const { provider_id, date } = req.body;

    /*
    check if provider_id is a provider and not creating an appointment for itself
    */

    const isProvider = await User.findOne({
      where: {
        id: provider_id,
        [Op.and]: [
          {
            id: {
              [Op.ne]: req.userId
            }
          }
        ],
        provider: true
      }
    });

    if (!isProvider) {
      return res.status(401).json({
        error:
          "You can only create appointments with providers and also, provider can't create appointments for themselves"
      });
    }

    /*
    check for past dates
    */
    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: "past date aren't allowed" });
    }

    /**
     * check dates availability
     */

    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        cancelled_at: null,
        date: hourStart
      }
    });

    if (checkAvailability) {
      return res
        .status(400)
        .json({ error: "Appointment date is not available" });
    }

    if (checkAvailability) {
      return res
        .status(400)
        .json({ error: "Appointment date is not available" });
    }

    // se der certo, fazer o agendamento
    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date: hourStart
    });

    /*
      Notify appointment provider
    */
    const user = await User.findByPk(req.userId);
    const formattedDate = format(
      hourStart,
      "'dia' dd 'de' MMM', às ' H:mm'h'",
      { locale: pt }
    );

    await Notification.create({
      content: `Novo agendamento de ${user.name} para ${formattedDate}`,
      user: provider_id
    });

    return res.json(appointment);
  }

  async delete(req, res) {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        { model: User, as: "provider", attributes: ["name", "email"] },
        { model: User, as: "user", attributes: ["name"] }
      ]
    });

    if (appointment.user_id !== req.userId) {
      return res.status(401).json({
        error: "You don't have permission to cancel this appointment."
      });
    }

    const dateWithSub = subHours(appointment.date, 2); // menos 2h

    if (isBefore(dateWithSub, new Date())) {
      return res.status(401).json({
        error: "You can only cancel appointments 2 hours in advance"
      });
    }
    appointment.cancelled_at = new Date();
    await appointment.save();

    await Queue.add(CancellationMail.key, { appointment });

    return res.json(appointment);
  }
}

export default new AppointmentController();
