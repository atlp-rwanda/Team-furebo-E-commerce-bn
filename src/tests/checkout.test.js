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
let customer2Token

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
}

const loginAdmin = {
    email: 'admindoe@gmail.com',
    password: 'Password1234',
};

describe('POST /api/checkout', async () => {

    before(async () => {
        // Register user
        await chai
        .request(app)
        .post('/api/register')
        .send(merchantData);

        await chai
        .request(app)
        .post('/api/register')
        .send(customerData);

        await chai
        .request(app)
        .post('/api/register')
        .send(customer2Data);

        // Register admin
        await chai
        .request(app)
        .post('/api/registerAdmin')
        .send(adminData);

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
                name: 'HCT/RP 360ST',
                image:
                ['https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1', 'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
                    'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1', 'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1'],
                price: 2500,
                quantity: 12,
                category: 'GAMMING PC',
                exDate: '2023-05-30'
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

    });

    // after(async () => {
    //     await sequelize.sync({ force: true });
    // });    

    context('It should create a new order', () => {
        it('should retrive user information with status code 200', (done) => {
            const requestBody = {
                deliveryAddress: {
                    street: "KN 55 st",
                    city: "Kigali",
                    country: "Rwanda",
                    zipCode: "3853"
                },
                paymentInformation: {
                    method: "credit card",
                    details: {
                        cardNumber: "5555 5555 5555 4444",
                        expirationDate: "10/23",
                        cvv: "346"
                    }
                }
            }
            chai.request(app)
              .post('/api/checkout')
              .set({ Authorization: `Bearer ${customerToken}` })
              .send(requestBody)
              .end((err, res) => {
                chai.expect(res).to.have.status(200);
                chai.expect(res.body.status).to.equal('success');
                done();
            });
        });
    })

    context('when trying to checkout with invalid input', () => {
        it('should return status 400 and an error message', (done) => {
            const requestBody = {
                deliveryAddress: {
                    city: "Kigali",
                    country: "Rwanda",
                    zipCode: "3853"
                },
                paymentInformation: {
                    method: "credit card"
                }
            }
            chai
                .request(app)
                .post('/api/checkout')
                .set({ Authorization: `Bearer ${customerToken}` })
                .send(requestBody)
                .end((err, res) => {
                    chai.expect(res).to.have.status(400);
                    chai.expect(res.body.status).to.equal('error');
                    chai.expect(res.body.message).to.equal('Invalid Input');
                    done();
                });
            });
    });

    context('When the cart is empty, User is notified ', () => {
        it(' should return 404 status when cart is empty', (done) => {
            const requestBody = {
                deliveryAddress: {
                    street: "KN 55 st",
                    city: "Kigali",
                    country: "Rwanda",
                    zipCode: "3853"
                },
                paymentInformation: {
                    method: "credit card",
                    details: {
                        cardNumber: "5555 5555 5555 4444",
                        expirationDate: "10/23",
                        cvv: "346"
                    }
                }
            }
            chai.request(app)
                .post('/api/checkout')
                .set({ Authorization: `Bearer ${customer2Token}` })
                .send(requestBody)
                .end((err, res) => {
                    chai.expect(res).to.have.status(404);
                    chai.expect(res.body.status).to.equal('error');
                done();
            });
        });
    });

    context('Return error message requesting the user to login to proceed with checkout', () => {
        it('should return 400 when user/token is not provided', (done) => {
            const requestBody = {
                deliveryAddress: {
                    street: "KN 55 st",
                    city: "Kigali",
                    country: "Rwanda",
                    zipCode: "3853"
                },
                paymentInformation: {
                    method: "credit card",
                    details: {
                        cardNumber: "5555 5555 5555 4444",
                        expirationDate: "10/23",
                        cvv: "346"
                    }
                }
            }
            chai.request(app)
                .post('/api/checkout')
                .set({ Authorization:  `Bearer `})
                .send(requestBody)
                .end((err, res) => {
                    chai.expect(res).to.have.status(400);
                    // chai.expect(res.body.status).to.include('error');
                done();
            });
        });
    });

})
