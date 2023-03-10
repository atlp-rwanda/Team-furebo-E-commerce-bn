const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../index');
const db = require("../models");
const User = db.users;

chai.use(chaiHttp);
chai.should();

describe('Users API', () => {
  // Empty the database before each test
  beforeEach(async () => {
    await User.destroy({
      where: {},
      truncate: true
    });
  });

  describe('POST /users', () => {
    it('should create a new user', (done) => {
      const user = {
        names: "John Doe",
        email: "johndoe@example.com",
        password: "mypassword"
      };

      chai.request(app)
        .post('/create')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('id');
          res.body.should.have.property('names').eq('John Doe');
          res.body.should.have.property('email').eq('johndoe@example.com');
          done();
        });
    });

    it('should return an error if names are not provided', (done) => {
      const user = {
        email: "johndoe@example.com",
        password: "mypassword"
      };

      chai.request(app)
        .post('/create')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eq('Content can not be empty!');
          done();
        });
    });
  });

  // Test case
  // Test case
  describe('DELETE /deleteall', () => {
    it('should delete all users', async () => {
      // Insert some users first
      const users = [
        { names: 'John Doe', email: 'johndoe@example.com', password: 'mypassword' },
        { names: 'Jane Doe', email: 'janedoe@example.com', password: 'mypassword' }
      ];
      await User.bulkCreate(users);
      
      const response = await chai.request(app).delete('/deleteall');
      response.should.have.status(200);
      response.body.should.be.an('object').that.has.property('message').equal('All users were deleted successfully!');
    });
  });
});
