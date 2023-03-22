/* eslint-disable no-underscore-dangle */
/* eslint-disable require-jsdoc */
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import db from '../Database/models';

const { User } = db;

export class PublicController {
  static async PublicLogin(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .json({ msg: 'Please Fiil in blank fields', error: '' });
      }

      const doesExist = await User.findOne({ where: { email } });

      if (!doesExist) {
        return res.status(404).json({ msg: "User doesn't exist", error: '' });
      }

      const isValid = await compare(password, doesExist.password);
      if (!isValid) {
        return res.status(401).json({ msg: 'Invalid password' });
      }

      const token = sign(
        { id: doesExist._id, email: doesExist.email },
        process.env.USER_SECRET_KEY,

        { expiresIn: 14400, }
      );
      return res.status(200).json({ msg: 'Logged in succesfully', token });
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default PublicController;
