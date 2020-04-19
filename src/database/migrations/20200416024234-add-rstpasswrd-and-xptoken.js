module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn(
          "users",
          "reset_password_token",
          {
            type: Sequelize.DataTypes.STRING
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          "users",
          "reset_password_expires",
          {
            type: Sequelize.DATE
          },
          { transaction: t }
        )
      ]);
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn("users", "reset_password_token", {
          transaction: t
        }),
        queryInterface.removeColumn("users", "reset_password_expires", {
          transaction: t
        })
      ]);
    });
  }
};
