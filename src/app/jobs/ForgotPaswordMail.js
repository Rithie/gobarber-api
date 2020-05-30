import Mail from "../../lib/mail";

class ForgotPasswordMail {
  get key() {
    return "ForgotPasswordMail";
  }

  async handle({ data }) {
    const { user, hostname, token, code } = data;

    await Mail.sendMail({
      to: `${user.name} <${user.email}>`,
      subject: "Forgot Password",
      template: "forgotpassword",
      context: {
        user: user.name,
        mail: user.mail,
        hostname,
        token,
        code
      }
    });
  }
}

export default new ForgotPasswordMail();
