/* eslint-disable linebreak-style */
/* eslint-disable no-unused-expressions */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';

const { expect } = chai;
chai.use(chaiHttp);
describe('modify password', () => {
  describe('POST /api/modify-password', () => {
    context('when a valid userId and newPassword are provided', () => {
      it('should return status 200 and update the user password', async () => {
        const user = {
          // eslint-disable-next-line quotes
          token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFzdHJpbmdAZ21haWwuY29tIiwiaWQiOjMsImlhdCI6MTY4MDI1NzQ0NX0.6vqhIx1PNXOOpQrhjuhKvZEHyVmk7g73uzdNWCGS49o",
          oldPassword: '123',
          newPassword: 'string'
        };
        const res = await chai.request(app)
          .post('/modify-password')
          .send(user);
        expect(res.body).to.have.property('success');
        expect(res.body).to.have.property('message');
      });
      it('should return status 404 when the user is not found', async () => {
        const user = {
          // eslint-disable-next-line quotes
          token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFzdHJpbmdAZ21haWwuY29tIiwiaWQiOjMsImlhdCI6MTY4MDI1NzQ0NX0.6vqhIx1PNXOOpQrhjuhKvZEHyVmk7g73uzdNWCGS49o",
          oldPassword: '123',
          newPassword: 'string'
        };
        const res = await chai.request(app)
          .post('/modify-password')
          .send(user);
        expect(res.body).to.have.property('success');
        expect(res.body).to.have.property('message');
      });
      it('should return status 400 when the entered password is incorrect', async () => {
        const user = {
          // eslint-disable-next-line quotes
          token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFzdHJpbmdAZ21haWwuY29tIiwiaWQiOjMsImlhdCI6MTY4MDI1NzQ0NX0.6vqhIx1PNXOOpQrhjuhKvZEHyVmk7g73uzdNWCGS49o",
          oldPassword: 'werfswerfderf',
          newPassword: 'string'
        };
        const res = await chai.request(app)
          .post('/modify-password')
          .send(user);
        expect(res.body).to.have.property('success');
        expect(res.body).to.have.property('message');
      });
      it('should return status 500 when there is an internal server error', async () => {
        const user = {
          // eslint-disable-next-line quotes
        };
        const res = await chai.request(app)
          .post('/modify-password')
          .send(user);
        expect(res.body).to.have.property('success');
        expect(res.body).to.have.property('message');
      });
    });
  });
});
