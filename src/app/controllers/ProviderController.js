import User from "../models/User";
import File from "../models/File";

class ProviderController {
  async index(req, res) {
    const providers = await User.findAll({
      where: { provider: true },
      attributes: ["id", "name", "email", "avatar_id"], // trazer apenas esses campos
      include: [
        { model: File, as: "avatar", attributes: ["name", "path", "url"] }
      ] // trazer relacionamento
    });

    return res.json(providers);
  }
}
export default new ProviderController();
