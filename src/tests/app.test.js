const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../index');
const db = require("../models");
const User = db.users;

chai.use(chaiHttp);
chai.should();

describe('Users API', () => {
  // Empty the database before each test
  beforeEach((done) => {
    User.destroy({
      where: {},
      truncate: true
    }).then(() => {
      done();
    }).catch(err => done(err));
  });

  describe('POST /users', () => {
    it('should create a new user', (done) => {
      const user = {
        names: "John Doe",
        email: "johndoe@example.com",
        password: "mypassword"
      };

      chai.request(app)
        .post('/users')
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
        .post('/users')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eq('Content can not be empty!');
          done();
        });
    });
  });

  describe('DELETE /users', () => {
    it('should delete all users', (done) => {
      // Insert some users first
      const users = [
        { names: "John Doe", email: "johndoe@example.com", password: "mypassword" },
        { names: "Jane Doe", email: "janedoe@example.com", password: "mypassword" },
      ];
      User.bulkCreate(users).then(() => {
        chai.request(app)
          .delete('/users')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eq('2 Users were deleted successfully!');
            done();
          });
      }).catch(err => done(err));
    });
  });
});
