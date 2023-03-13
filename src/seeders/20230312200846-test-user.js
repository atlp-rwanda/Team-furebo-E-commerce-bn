'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [
      {
        names: 'User Four',
        email: 'userfour@gmail.com',
        password: 'userfour',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        names: 'User One',
        email: 'userone@gmail.com',
        password: 'userone',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        names: 'User Two',
        email: 'usertwo@gmail.com',
        password: 'usertwo',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        names: 'User Three',
        email: 'userthree@gmail.com',
        password: 'userthree',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
