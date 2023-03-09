/**
 * @param {data} queryInterface .
 * @param {data} Sequelize .
 * @returns {data} .
 */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('Dummy', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    fullname: {
      allowNull: false,
      type: Sequelize.STRING
    },
    email: {
      allowNull: false,
      type: Sequelize.STRING
    },
    password: {
      allowNull: false,
      type: Sequelize.STRING
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  });
}
/**
 * @param {data} queryInterface .
 * @returns {data} .
 */
export async function down(queryInterface) {
  await queryInterface.dropTable('Dummy');
}
