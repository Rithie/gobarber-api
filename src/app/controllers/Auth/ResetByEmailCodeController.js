import * as Yup from "yup";
import { Op } from "sequelize";
import User from "../../models/User";

import ResetPasswordMail from "../../jobs/ResetPasswordMail";
import Queue from "../../../lib/Queue";

class ResetByEmailCodeController {
  async index(req, res) {
    const { token } = req.params;

    const user = await User.findOne({
      where: {
        short_id: token,
        reset_password_expires: {
          [Op.gt]: Date.now()
        }
      }
    });

    if (!user) {
      return res.status(422).json({
        error: "Password reset token is invalid or has expired"
      });
    }

    const schema = Yup.object().shape({
      password: Yup.string() // new password
        .required()
        .min(6),
      confirmPassword: Yup.string().when("password", (password, field) =>
        password ? field.required().oneOf([Yup.ref("password")]) : field
      )
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "validation fails" });
    }

    user.reset_password_token = null;
    user.reset_password_expires = null;
    user.short_id = null;
    user.password = req.body.password;

    await user.update();

    await Queue.add(ResetPasswordMail.key, { user });

    return res.status(200).json({
      ok: true
    });
  }
}

export default new ResetByEmailCodeController();
