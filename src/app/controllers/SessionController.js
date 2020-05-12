import "dotenv/config";
import jwt from "jsonwebtoken";

import User from "../models/User";
import File from "../models/File";

class SessionControler {
  async store(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: File,
          as: "avatar",
          attributes: ["id", "path", "url"]
        }
      ]
    });

    if (!user) {
      return res.status(401).json({
        error: "User not found"
      });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({
        error: "Password does not match"
      });
    }

    const { id, name, avatar, provider, is_signup_done, signup_step } = user;

    return res.json({
      user: {
        id,
        name,
        email,
        avatar,
        provider,
        is_signup_done,
        signup_step
      },
      token: jwt.sign({ id }, process.env.APP_SECRET, {
        expiresIn: "7d"
      })
    });
  }
}

export default new SessionControler();
