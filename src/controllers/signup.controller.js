/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../Database/models';
import validateSignup from '../validation/signup.validator';
import ROLES_LIST from '../utils/userRoles.util';
import { generateToken, hashPassword } from '../utils/user.util';

const { User } = db;

// create and save new user
const createUser = async (req, res) => {
  const { email } = req.body;
  const { error } = validateSignup(req.body);

  if (error) {
    return res.status(406).send(error.details[0].message);
  }

  const existingUser = await User.findOne({ where: { email } });

  if (existingUser) return res.status(401).json({ message: 'Email allready used, please use different email.' });

  const hashedPassword = await hashPassword(req.body.password);
  const userRole = 'customer';

  const newRole = ROLES_LIST[userRole];

  const user = {
    fullname: `${req.body.firstname} ${req.body.lastname}`,
    email: req.body.email,
    password: hashedPassword,
    role: JSON.stringify(newRole),
  };

  User.create(user)
    .then(async (data) => {
      const token = await generateToken(data);
      res
        .status(200)
        .header('authenticate', token)
        .json({ message: 'successful signedup', token });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while creating User.',
      });
    });
};

export default createUser;
