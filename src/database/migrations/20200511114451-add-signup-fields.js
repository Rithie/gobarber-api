module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn(
          "users",
          "accepted_terms",
          {
            type: Sequelize.DataTypes.BOOLEAN,
            defaultValue: false
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          "users",
          "user_level",
          {
            type: Sequelize.DataTypes.STRING,
            defaultValue: "1"
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          "users",
          "job_title",
          {
            type: Sequelize.DataTypes.STRING
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          "users",
          "bio",
          {
            type: Sequelize.DataTypes.STRING
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          "users",
          "birthdate",
          {
            type: Sequelize.DataTypes.STRING
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          "users",
          "profile_photo_path",
          {
            type: Sequelize.DataTypes.STRING,
            defaultValue:
              "https://api.adorable.io/avatars/256/abott@adorable.png"
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          "users",
          "role",
          {
            type: Sequelize.DataTypes.STRING
          },
          { transaction: t }
        )
      ]);
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn("users", "accepted_terms", {
          transaction: t
        }),
        queryInterface.removeColumn("users", "user_level", {
          transaction: t
        }),
        queryInterface.removeColumn("users", "job_title", {
          transaction: t
        }),
        queryInterface.removeColumn("users", "bio", {
          transaction: t
        }),
        queryInterface.removeColumn("users", "birthdate", {
          transaction: t
        }),
        queryInterface.removeColumn("users", "profile_photo_path", {
          transaction: t
        }),
        queryInterface.removeColumn("users", "role", {
          transaction: t
        })
      ]);
    });
  }
};
