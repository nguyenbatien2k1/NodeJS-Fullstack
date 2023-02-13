'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      email: 'admin@example.com',
      password: '123456',
      firstName: 'Tien',
      lastName: 'Basic',
      address: 'VN',
      phonenumber: '0384445041',
      gender: 1,
      image: 'tin tin',
      roleId: 'R1',
      positionId: 'Master',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
