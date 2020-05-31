import Mail from "../../lib/mail";

class AccountCreatedMail {
  get key() {
    return "AccountCreatedMail";
  }

  async handle({ data }) {
    const { email } = data;

    await Mail.sendMail({
      to: `<${email}>`,
      subject: "Welcome to Eleve App",
      template: "greetings",
      context: {
        email
      }
    });
  }
}

export default new AccountCreatedMail();
