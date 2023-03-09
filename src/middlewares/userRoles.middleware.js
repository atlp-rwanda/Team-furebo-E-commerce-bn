import jwt from 'jsonwebtoken';
import db from '../Database/models';
import { verifyToken } from '../utils/user.util';

const { User } = db;

export const authorizeAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).send({ message: 'Authorization header missing' });
    }
    const token = req.headers.authorization.split(' ')[1]; // get token from Authorization header
    const decoded = await verifyToken(token);
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(404).send({ message: 'account not found' });
    }
    // req.user = user;
    const userRole = JSON.parse(user.role);

    if (userRole.name === 'admin') {
      req.user = user;
      next();
    } else {
      return res.status(403).send({ message: 'Admin access only' });
    }
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(500).send({ message: 'Internal server error', error });
  }
};

export const authorizeCustomer = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).send({ message: 'Authorization header missing' });
    }
    const token = req.headers.authorization.split(' ')[1]; // get token from Authorization header
    const decoded = await verifyToken(token);
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(404).send({ message: 'account not found' });
    }
    const userRole = JSON.parse(user.role);

    if (userRole.name === 'customer') {
      req.user = user;
      next();
    } else {
      return res.status(403).send({ message: 'Customer access only' });
    }
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(500).send({ message: 'Internal server error', error });
  }
};

export const authorizeMerchant = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // get token from Authorization header
    const decoded = await verifyToken(token);
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(404).send({ message: 'account not found' });
    }
    const userRole = JSON.parse(user.role);
    if (userRole.name === 'merchant') {
      req.user = user;
      next();
    } else {
      return res.status(403).send({ message: 'Merchant access only' });
    }
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(500).send({ message: 'Internal server error', error });
  }
};
