import Mail from "../../lib/mail";

class ResetPasswordMail {
  get key() {
    return "ResetPasswordMail";
  }

  async handle({ data }) {
    const { user, hostname } = data;

    await Mail.sendMail({
      to: `${user.name} <${user.email}>`,
      subject: "Your Account Password Has Been Reset",
      template: "resetpassword",
      context: {
        user: user.name,
        mail: user.mail,
        hostname,
        token: "testetoken"
      }
    });
  }
}

export default new ResetPasswordMail();
