<<<<<<< HEAD
=======
<<<<<<< HEAD
/* eslint-disable linebreak-style */

=======
>>>>>>> e54b741 (Password Modification)
import hashPassword from '../../utils/user.util';
/**
 * @param {data} hashedPassword .
 * @returns {data} .
 */
const hashedPassword = hashPassword('dummypassword');
<<<<<<< HEAD
=======
>>>>>>> 0d1b81b (Password Modification)
>>>>>>> e54b741 (Password Modification)
/**
 * @param {data} queryInterface .
 * @returns {data} .
 */
export async function up(queryInterface) {
  return queryInterface.bulkInsert('Dummy', [
    {
      names: 'Dummy User',
      email: 'dummy@email.com',
<<<<<<< HEAD
      password: hashedPassword,
=======
<<<<<<< HEAD
      password: 'dummypassword',
=======
      password: hashedPassword,
>>>>>>> 0d1b81b (Password Modification)
>>>>>>> e54b741 (Password Modification)
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
}
/**
 * @param {data} .
 * @returns {data} .
 */
export async function down() {
  /**
   * Add commands to revert seed here.
   *
   * Example:
   * await queryInterface.bulkDelete('People', null, {});
   */
}
