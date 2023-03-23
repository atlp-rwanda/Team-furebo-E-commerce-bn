/* eslint-disable no-unused-vars */
const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../../index')
const expect = chai.expect
chai.use(chaiHttp)

// eslint-disable-next-line no-undef
describe('Sample Test', function () {
  // eslint-disable-next-line no-undef
  it('should return a response with status code 200', function (done) {
    chai.request(app)
      .get('/sample_test')
      .end(function (_err, res) {
        chai.expect(res).to.have.status(200)
        done()
      })
  })
})
