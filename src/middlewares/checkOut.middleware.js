import { ShoppingCart, Product, User, DeliveryAddress } from '../Database/models';

import validateOrder from '../validation/checkOut.validator';

import { verifyToken } from '../utils/user.util';

const checkOutMiddleware = async (req,res,next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send({ 
            status: 'error',
            message: 'Authorization header missing' 
        });
    }

    const token = req.headers.authorization.split(' ')[1];

    const decoded = await verifyToken(token);

    const dbUser = await User.findByPk(decoded.id);

    if (!dbUser) {
        return res.status(404).json({
            status: 'error',
            message: 'User not found',
        });
    }

    const currentCart = await ShoppingCart.findAll({
        where: { userId: dbUser.id },
        include: Product
    })

    if (!currentCart || currentCart.length === 0) {
        return res.status(404).json({
            status: 'error',
            message: 'There are no items in the cart!',
        });
    }

    const cartTotalPrice = currentCart.reduce(
        (total, item) => total + parseFloat(item.totalPrice),
        0
    ).toFixed(2);

    const { deliveryAddress, paymentInformation } = req.body;

    const { error } = validateOrder(req.body);

    if (error) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid Input',
        data: error.details[0].message
      })
    }

    req.user = dbUser;
    req.currentCart = currentCart;
    req.cartTotalPrice = cartTotalPrice;
    req.deliveryAddress = deliveryAddress;
    req.paymentInformation = paymentInformation;
    next();

}

export default checkOutMiddleware;