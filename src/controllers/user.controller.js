/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Sequelize } from 'sequelize';
import sgMail from '@sendgrid/mail';
import db from '../models';
import validateSignup from '../validation/validator';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const { Op } = Sequelize;
const { User } = db;

// create and save new user
export const createUser = async (req, res) => {
  const { error } = validateSignup(req.body);

  if (error) {
    return res.send(error.details);
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 12);

  const user = {
    fullname: `${req.body.firstname} ${req.body.lastname}`,
    email: req.body.email,
    password: hashedPassword
  };

  User.create(user)
    .then((data) => {
      const token = jwt.sign({ email: data.email, id: data.id }, process.env.USER_SCREET_KEY);
      res.status(200).json({ message: 'successful signedup', token });
    })
    .catch((err) => {
      res.status(500).send({
        message:
            err.message || 'Some error occurred while creating User.'
      });
    });
};

// Password Reset
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate password reset token
    const token = crypto.randomBytes(20).toString('hex');
    const expires = new Date();
    expires.setHours(expires.getHours() + 1);
    // eslint-disable-next-line no-unused-vars
    const resetToken = await db.ResetToken.create({ token, expires, userId: user.id });

    // Send password reset email
    const msg = {
      to: email,
      from: process.env.SENDER_EMAIL, // replace with your own email address
      subject: 'Password reset request',
      text: `Your password reset token is: ${token}`,
    };
    await sgMail.send(msg);

    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    // Check if reset token is valid
    if (!resetToken) {
      return res.status(400).json({ message: 'Token parameter is required' });
    }
    const resetTokenRecord = await db.ResetToken.findOne({
      where: {
        token: resetToken,
        expires: {
          [Op.gt]: new Date(),
        },
      },
      include: { model: db.User, as: 'user' },
    });
    if (!resetTokenRecord) {
      return res.status(401).json({ message: 'Invalid or expired password reset token' });
    }

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.User.update({ password: hashedPassword }, { where: { id: resetTokenRecord.user.id } });

    // Delete reset token record
    await resetTokenRecord.destroy();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// export default {createUser,login,requestPasswordReset,resetPassword};
