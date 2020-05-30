module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("users", "phone", {
      type: Sequelize.STRING
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("users", "phone");
  }
};
