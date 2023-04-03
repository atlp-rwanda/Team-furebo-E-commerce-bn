/* eslint-disable no-underscore-dangle */
/* eslint-disable require-jsdoc */
import db from '../Database/models';
import { comparePassword, generateToken } from '../utils/user.util';

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
      if (doesExist.dataValues.isEnabled === false) {
        return res.status(403).json({ msg: 'Account is disabled please contact admin' });
      }

      const isValid = await comparePassword(password, doesExist.password);
      if (!isValid) {
        return res.status(401).json({ msg: 'Invalid password' });
      }

      const token = await generateToken(doesExist);
      return res
        .status(200)
        .header('authenticate', token)
        .json({ msg: 'Logged in succesfully', token });
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default PublicController;
