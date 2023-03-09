/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('Users', 'role', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
    ]);
  },

  down(queryInterface) {
    // logic for reverting the changes
    return Promise.all([queryInterface.removeColumn('Users', 'role')]);
  },
};
