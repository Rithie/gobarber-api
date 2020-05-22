module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("users", "short_id", {
      type: Sequelize.STRING
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("users", "short_id");
  }
};
