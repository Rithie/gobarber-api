import Sequelize, { Model } from "sequelize";

class Project extends Model {
  static init(sequelize) {
    super.init(
      {
        name: { allowNull: false, type: Sequelize.STRING },
        description: { allowNull: false, type: Sequelize.STRING },
        status: Sequelize.BOOLEAN,
        cancelled_at: Sequelize.DATE,
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      },
      {
        sequelize
      }
    );
    return this;
  }

  // static associate(models) {
  //   this.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
  //   this.hasMany(models.Videos, { as: "pitch_videos" });
  //   this.hasMany(models.Files, { as: "imagens" });
  // }
}

export default Project;
