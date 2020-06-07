import Sequelize, { Model } from "sequelize";
import bcrypt from "bcryptjs";

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        phone: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
        short_id: Sequelize.STRING,
        reset_password_token: Sequelize.STRING,
        reset_password_expires: Sequelize.DATE,
        is_signup_done: Sequelize.BOOLEAN,
        signup_step: Sequelize.STRING,
        accepted_terms: Sequelize.BOOLEAN,
        user_level: Sequelize.STRING,
        job_title: Sequelize.STRING,
        bio: Sequelize.STRING,
        birthdate: Sequelize.STRING,
        profile_photo_path: Sequelize.STRING,
        role: Sequelize.STRING
      },
      {
        sequelize
      }
    );
    // exec antes de qqr save
    User.addHook("beforeSave", async user => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });
    return this;
  }

  static associate(models) {
    this.belongsTo(models.File, { foreignKey: "avatar_id", as: "avatar" });
    // this.hasMany(models.User, { as: "projects" });
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
