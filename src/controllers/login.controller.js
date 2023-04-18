/* eslint-disable no-underscore-dangle */
/* eslint-disable require-jsdoc */
import db from '../Database/models';
import { comparePassword, generateToken } from '../utils/user.util';
import sendMail from '../utils/sendEmail.util';
import { generateSecretKey, generateOTPCode } from './two-factor-auth.controller';

const { User } = db;

export class PublicController {
  static async PublicLogin(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .json({ msg: 'Please Fill in blank fields', error: '' });
      }

      const doesExist = await User.findOne({ where: { email } });

      if (!doesExist) {
        return res.status(404).json({ msg: "User doesn't exist", error: '' });
      }

      const isValid = await comparePassword(password, doesExist.password);
      if (!isValid) {
        return res.status(401).json({ msg: 'Invalid password' });
      }
      const token = await generateToken(doesExist);
      if (doesExist.enable2FA) {
        const { base32 } = generateSecretKey();
        await User.update({
          twoFactorAuthKey: base32
        }, {
          where: {
            id: doesExist.id
          }
        });
        const secret = base32;
        const code = generateOTPCode(secret);
        const recipient = {
          recipientEmail: doesExist.email,
          emailSubject: 'ECOMMERCE AUTHENTICATON CODE',
          emailBody: `Your authentication code is: ${code}`
        };
        const checker = 0;
        sendMail(recipient, code, checker);
        if (checker === 0) {
          return res
            .status(200)
            .header('authenticate', token)
            .json({ msg: 'Please check your email for the authentication code', token });
        }
        return res
          .status(500)
          .json({ msg: 'Email is not sent' });
      }
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
