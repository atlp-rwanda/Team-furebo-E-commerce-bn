/* eslint-disable import/prefer-default-export */
/* eslint-disable require-jsdoc */
import bcrypt from 'bcryptjs';
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import db from '../Database/models';

const { User } = db;
function authenticateToken(data) {
  const v = jwt.verify(data, process.env.USER_SCREET_KEY, (err, decoded) => {
    let response;
    if (err) {
      response = { success: false, message: null };
    } else {
      response = { success: true, token: decoded };
    }
    return response;
  });
  return v;
}
export const changePassword = async (req, res) => {
  const { oldPassword, newPassword, token } = req.body;
  try {
    const userId = (authenticateToken(token).success) ? authenticateToken(token).token.id : null;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const passwordMatches = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatches) {
      return res.status(400).json({ success: false, message: 'Old password is incorrect' });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });
    return res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
