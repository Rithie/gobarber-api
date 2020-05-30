import "dotenv/config";
import jwt from "jsonwebtoken";
import shortid from "shortid";
import User from "../../models/User";

import ForgotPasswordMail from "../../jobs/ForgotPaswordMail";
import Queue from "../../../lib/Queue";

class ForgotPasswordController {
  async index(req, res) {
    const { email } = req.body;

    const user = await User.findOne({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({
        error: "User not found"
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        resetPasswordToken: user.resetPasswordToken
      },
      process.env.APP_SECRET,
      { expiresIn: "1h" }
    );

    const code = `e-${shortid.generate()}`;
    user.reset_password_token = token;
    user.short_id = code;
    user.reset_password_expires = Date.now() + 3600000; // 1 hour

    await user.save();

    const { hostname } = req;

    await Queue.add(ForgotPasswordMail.key, { user, hostname, token, code });

    return res.status(200).json({
      success_message: "Your email has been sent. check your inbox"
    });
  }
}

export default new ForgotPasswordController();
