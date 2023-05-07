/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
import chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import app from '../../index';
import { users } from '../Database/models';

chai.use(chaiHttp);
const { expect } = chai;

let merchantToken;
let customerToken;
let adminToken;
let customer2Token;
let orderId
let emptyOrderId

const merchantData = {
  firstname: 'Jane',
  lastname: 'Doe',
  email: 'janedoe@gmail.com',
  password: 'Password1234',
};

const loginMerchant = {
  email: 'janedoe@gmail.com',
  password: 'Password1234',
};

const customerData = {
  firstname: 'John',
  lastname: 'Doe',
  email: 'johndoe@gmail.com',
  password: 'Password1234',
};

const loginCustomer = {
  email: 'johndoe@gmail.com',
  password: 'Password1234',
};

const customer2Data = {
  firstname: 'customer',
  lastname: 'two',
  email: 'customer2@gmail.com',
  password: 'Password1234',
};

const loginCustomer2 = {
  email: 'customer2@gmail.com',
  password: 'Password1234',
};

const adminData = {
  firstname: 'Admin',
  lastname: 'Doe',
  email: 'admindoe@gmail.com',
  password: 'Password1234',
};

const loginAdmin = {
  email: 'admindoe@gmail.com',
  password: 'Password1234',
};

describe('GET /api/orderStatus/:id', () => {
    before(async () => {
        // Register user
        await chai.request(app).post('/api/register').send(merchantData);
    
        await chai.request(app).post('/api/register').send(customerData);
    
        await chai.request(app).post('/api/register').send(customer2Data);
    
        // Register admin
        await chai.request(app).post('/api/registerAdmin').send(adminData);
    
        const merchantLogin = await chai
          .request(app)
          .post('/api/login')
          .send(loginMerchant);
        expect(merchantLogin).to.have.status(200);
        merchantToken = merchantLogin.body.token;
    
        const customerLogin = await chai
          .request(app)
          .post('/api/login')
          .send(loginCustomer);
        expect(customerLogin).to.have.status(200);
        customerToken = customerLogin.body.token;
    
        const customer2Login = await chai
          .request(app)
          .post('/api/login')
          .send(loginCustomer2);
        expect(customer2Login).to.have.status(200);
        customer2Token = customer2Login.body.token;
    
        const adminLogin = await chai
          .request(app)
          .post('/api/login')
          .send(loginAdmin);
        expect(adminLogin).to.have.status(200);
        adminToken = adminLogin.body.token;
    
        const verifyMerchant = await jwt.verify(
          merchantToken,
          process.env.USER_SECRET_KEY
        );
        const merchantId = verifyMerchant.id;
    
        // Update seller's role
        await chai
          .request(app)
          .patch(`/api/updateRole/${merchantId}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ role: 'merchant' });
    
        // create a new product to be added to the shopping cart
        const product = await chai
          .request(app)
          .post('/api/addProduct')
          .set('Authorization', `Bearer ${merchantToken}`)
          .send({
            name: 'DELL Laptop',
            image: [
              'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
              'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
              'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
              'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
            ],
            price: 2500,
            quantity: 12,
            category: 'Electronics',
            exDate: '2023-05-30',
          });
        expect(product).to.have.status(201);
        const productId = product.body.data.id;
    
        await chai
          .request(app)
          .post('/api/addItemToCart')
          .set({ Authorization: `Bearer ${customerToken}` })
          .send({
            productId,
            quantity: 5,
        });

        const checkout = await chai
            .request(app)
            .post('/api/checkout')
            .set({Authorization: `Bearer ${customerToken}`})
            .send({
                deliveryAddress: {
                    street: "KG 123 st",
                    city: "Kigali",
                    country: "Rwanda",
                    zipCode: "12345"
                },
                paymentInformation: {
                    method: "credit card",
                    details: {
                        cardNumber: "5555 5555 5555 4444",
                        expirationDate: "12/24",
                        cvv: "123"
                    }
                }
        })
        orderId = checkout.body.data.id;
    });

    // after(async () => {
    //     await users.destroy({
    //         where: { email: customer2Data.email, email: customerData.email, email: merchantData.email, email: adminData.email},
    //         truncate: { cascade: true },
    //     });
    // });

    context('Buyer should be able to track the order status', () => {
        it('should retrieve the order status with status code 200', done => {
            chai
            .request(app)
            .get(`/api/orderStatus/${orderId}`)
            .set({ Authorization: `Bearer ${customerToken}` })
            .end((err, res) => {
                chai.expect(res).to.have.status(200);
                chai.expect(res.body.status).to.equal('success');
                chai.expect(res.body.message).to.equal('Order status');
                done();
            });
        });
    });

    context('It should fail to retrieve order status because user does not own the order', () => {
      it('should return a status code of 403 when user does not own order', (done) => {
        chai
        .request(app)
        .get(`/api/orderStatus/${orderId}`)
        .set({ Authorization: `Bearer ${customer2Token}` })
        .end((err, res) => {
            chai.expect(res).to.have.status(403);
            chai.expect(res.body.status).to.equal('error');
            chai.expect(res.body.message).to.equal('UNAUTHORIZED! This order does not belong to you.');
            done();
        });
      });
    }
);
});

describe('PATCH /api/orderStatus/:id', async () => {
    before(async () => {
        // Register user
        await chai.request(app).post('/api/register').send(merchantData);

        await chai.request(app).post('/api/register').send(customerData);

        // Register admin
        await chai.request(app).post('/api/registerAdmin').send(adminData);

        const merchantLogin = await chai
        .request(app)
        .post('/api/login')
        .send(loginMerchant);
        expect(merchantLogin).to.have.status(200);
        merchantToken = merchantLogin.body.token;

        const customerLogin = await chai
        .request(app)
        .post('/api/login')
        .send(loginCustomer);
        expect(customerLogin).to.have.status(200);
        customerToken = customerLogin.body.token;

        const adminLogin = await chai
        .request(app)
        .post('/api/login')
        .send(loginAdmin);
        expect(adminLogin).to.have.status(200);
        adminToken = adminLogin.body.token;

        const verifyMerchant = await jwt.verify(
            merchantToken,
            process.env.USER_SECRET_KEY
        );
        const merchantId = verifyMerchant.id;

        // Update seller's role
        await chai
        .request(app)
        .patch(`/api/updateRole/${merchantId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ role: 'merchant' });

        // create a new product to be added to the shopping cart
        const product = await chai
        .request(app)
        .post('/api/addProduct')
        .set('Authorization', `Bearer ${merchantToken}`)
        .send({
            name: 'Lenovo Laptop',
            image: [
            'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
            'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
            'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
            'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
            ],
            price: 2500,
            quantity: 12,
            category: 'Electronics',
            exDate: '2023-05-30',
        });
        expect(product).to.have.status(201);
        const productId = product.body.data.id;

        await chai
        .request(app)
        .post('/api/addItemToCart')
        .set({ Authorization: `Bearer ${customerToken}` })
        .send({
            productId,
            quantity: 5,
        });

        const checkout = await chai
            .request(app)
            .post('/api/checkout')
            .set({Authorization: `Bearer ${customerToken}`})
            .send({
                deliveryAddress: {
                    street: "KG 123 st",
                    city: "Kigali",
                    country: "Rwanda",
                    zipCode: "12345"
                },
                paymentInformation: {
                    method: "credit card",
                    details: {
                        cardNumber: "5555 5555 5555 4444",
                        expirationDate: "12/24",
                        cvv: "123"
                    }
                }
        })
        orderId = checkout.body.data.id;
    });

    // after(async () => {
    //     await users.destroy({
    //         where: { email: customerData.email, email: merchantData.email, email: adminData.email},
    //         truncate: { cascade: true },
    //     });
    // });

    context('It should update the order status', () => {
        it('should update order status with status code 200', (done) => {
            const requestBody = {
                deliveryDate: '2023-10-25',
                orderStatus: 'dispatched'
            };
            chai
                .request(app)
                .patch(`/api/orderStatus/${orderId}`)
                .set({ Authorization: `Bearer ${adminToken}` })
                .send(requestBody)
                .end((err, res) => {
                    chai.expect(res).to.have.status(200);
                    chai.expect(res.body.status).to.equal('success');
                    chai.expect(res.body.message).to.equal("Order status updated successfully");
                    done();
                });
            });
    });

    context('when trying to update order status with invalid input', () => {
        it('should return status 400 and an error message', (done) => {
            const requestBody = {
                deliveryDate: '2021-05-10'
            };
            chai
                .request(app)
                .patch(`/api/orderStatus/${orderId}`)
                .set({ Authorization: `Bearer ${adminToken}` })
                .send(requestBody)
                .end((err, res) => {
                    chai.expect(res).to.have.status(400);
                    chai.expect(res.body.status).to.equal('error');
                    chai.expect(res.body.message).to.equal('Invalid Input');
                    done();
                });
            });
    });

    context('When the order is not found', () => {
        it(' should return 404 status when order is not found', (done) => {
            const requestBody = {
                deliveryDate: '2023-10-25',
                orderStatus: 'dispatched'
            };
            chai
                .request(app)
                .patch(`/api/orderStatus/${orderId + 1000}`)
                .set({ Authorization: `Bearer ${adminToken}` })
                .send(requestBody)
                .end((err, res) => {
                    chai.expect(res).to.have.status(404);
                    chai.expect(res.body.status).to.equal('error');
                    done();
                });
            });
    });

    context('When the order status is not found', () => {
        it(' should return 404 status when order status is not found', (done) => {
            const requestBody = {
                deliveryDate: '2023-10-25',
                orderStatus: 'dispatched'
            };
            chai
                .request(app)
                .patch(`/api/orderStatus/${orderId + 1000}`)
                .set({ Authorization: `Bearer ${adminToken}` })
                .send(requestBody)
                .end((err, res) => {
                    chai.expect(res).to.have.status(404);
                    chai.expect(res.body.status).to.equal('error');
                    done();
                });
            });
    });
});
