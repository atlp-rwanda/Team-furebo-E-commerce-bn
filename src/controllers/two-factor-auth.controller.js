import speakeasy from 'speakeasy';
import sendMail from '../utils/sendEmail.util';
import db from '../Database/models';
import { generateToken } from '../utils/user.util';
import asyncWrapper from '../utils/handlingTryCatchBlocks';

const { User } = db;

export const enable2FAForMerchants = asyncWrapper(async (req, res) => {
  const existingUser = await User.findByPk(req.user.id);
  if (existingUser.enable2FA) {
    return res.status(409).json({ message: 'Two Factor Authentication is already enabled' });
  }
  await User.update({
    enable2FA: true
  }, {
    where: {
      id: existingUser.id
    }
  });
  return res.status(200).json({ message: 'Two Factor Authentication enabled' });
});

export const generateOTPCode = (secretKey) => {
  const code = speakeasy.time({
    secret: secretKey,
    encoding: 'base32',
    step: 300
  });
  return code;
};
export const generateSecretKey = () => {
  const secretKey = speakeasy.generateSecret({
    name: process.env.TWO_FACTOR_AUTH_NAME
  });
  return {
    base32: secretKey.base32

  };
};

export const disable2FAForMerchants = asyncWrapper(async (req, res) => {
  const existingUser = await User.findByPk(req.user.id);
  if (!existingUser.enable2FA) {
    return res.status(409).json({ message: 'Two Factor Authentication is not ON' });
  }
  await User.update({
    enable2FA: false,
    twoFactorAuthKey: null
  }, {
    where: {
      id: existingUser.id
    }
  });
  return res.status(200).json({ message: 'Two Factor Authentication has been disabled' });
});

export const resendOTP = asyncWrapper(async (req, res) => {
  const existingUser = await User.findByPk(req.user.id);
  if (existingUser.enable2FA) {
    const { base32 } = generateSecretKey();
    await User.update({
      twoFactorAuthKey: base32
    }, {
      where: {
        id: existingUser.id
      }
    });
    const secret = base32;
    const code = generateOTPCode(secret);
    const recipient = {
      recipientEmail: existingUser.email,
      emailSubject: 'ECOMMERCE AUTHENTICATON CODE',
      emailBody: `Your authentication code is: ${code}`
    };

    const checker = 0;
    sendMail(recipient, code, checker);
    const token = await generateToken(existingUser);
    if (checker === 0) {
      return res
        .status(200)
        .header('authenticate', token)
        .json({ msg: 'Please check your email for the new authentication code' });
    }
  }
});

export const verify2FAkey = asyncWrapper(async (req, res) => {
  const key = req.body.code.trim();
  if (!key) {
    return res.status(400).json({ message: 'Please provide the code sent to you on email' });
  }
  const existingUser = await User.findByPk(req.user.id);
  const { twoFactorAuthKey } = existingUser;
  const isVerified = speakeasy.time.verify({
    secret: twoFactorAuthKey,
    encoding: 'base32',
    token: key,
    step: 300
  });
  if (isVerified) {
    return res.status(200).json({ message: 'Two Factor Authentication successful' });
  }
  return res.status(403).json({ message: 'Code is wrong or expired! Please try again' });
});
