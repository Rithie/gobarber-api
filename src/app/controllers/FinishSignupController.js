import User from "../models/User";

class FinishSignupController {
  async update(req, res) {
    console.log("body", req.body);

    const user = await User.findByPk(req.userId);

    await user.update(req.body);

    const {
      name,
      profile_photo_path,
      role,
      job_title,
      is_signup_done,
      signup_step
    } = await User.findByPk(req.userId);

    return res.json({
      name,
      profile_photo_path,
      role,
      job_title,
      is_signup_done,
      signup_step
    });
  }
}

export default new FinishSignupController();
