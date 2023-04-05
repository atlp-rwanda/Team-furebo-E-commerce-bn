import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';

chai.use(chaiHttp);

const { expect } = chai;

describe('disableAccount function', () => {
  it('should return an error if user account is not found', (done) => {
    const userId = 999;
    const userData = { status: 'disabled' };
    chai
      .request(app)
      .patch(`/api/disableAccount/${userId}`)
      .send(userData)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message').to.equal(`Cannot update User with id=${userId}. User was not found !`);
        done();
      });
  });
});
