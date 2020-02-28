import * as Yup from "yup";
import { startOfHour, parseISO, isBefore, format } from "date-fns";
import pt from "date-fns/locale/pt";

import Appointment from "../models/Appointment";
import User from "../models/User";
import File from "../models/File";

import Notification from "../schemas/notification";

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
    check if provider_id is a pprovider
    */

    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true }
    });

    if (!isProvider) {
      return res
        .status(401)
        .json({ error: "you can only create appointments with providers" });
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
}

export default new AppointmentController();
