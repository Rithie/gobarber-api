import { Op } from "sequelize";
import User from "../../models/User";

class CheckEmailCodeController {
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
        error: "Password reset token is invalid or has expired."
      });
    }

    return res.status(200).json({
      ok: true
    });
  }
}

export default new CheckEmailCodeController();
