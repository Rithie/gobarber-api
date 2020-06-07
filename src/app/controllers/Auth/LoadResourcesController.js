import User from "../../models/User";

class LoadResourcesController {
  async index(req, res) {
    const user = await User.findOne({
      where: { id: req.userId }
    });

    const {
      id,
      name,
      avatar,
      is_signup_done,
      signup_step,
      role,
      profile_photo_path,
      bio
    } = user;

    return res.json({
      user: {
        id,
        name,
        avatar,
        is_signup_done,
        signup_step,
        role,
        profile_photo_path,
        bio
      },
      projects: [
        { name: "Projecto 1", observers: "10 investors interested to date" }
      ],
      menu: [
        {
          moduleName: "Elevator Pitches",
          route: "pitches",
          permission: true
        },
        {
          moduleName: "Chat",
          route: "chat",
          permission: true,
          counter: 15
        },
        {
          moduleName: "Projects",
          route: "Feed",
          permission: true
        },
        {
          moduleName: "Settings",
          route: "Settings"
        }
      ]
    });
  }
}

export default new LoadResourcesController();
