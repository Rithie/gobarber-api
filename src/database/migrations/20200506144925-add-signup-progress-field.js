module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn(
          "users",
          "is_signup_done",
          {
            type: Sequelize.DataTypes.BOOLEAN,
            defaultValue: false
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          "users",
          "signup_step",
          {
            type: Sequelize.STRING,
            defaultValue: "1"
          },
          { transaction: t }
        )
      ]);
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn("users", "is_signup_done", {
          transaction: t
        }),
        queryInterface.removeColumn("users", "signup_step", {
          transaction: t
        })
      ]);
    });
  }
};
