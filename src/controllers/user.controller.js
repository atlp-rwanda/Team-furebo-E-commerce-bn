import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../models';
import validateSignup from '../validation/validator';

const { User } = db;

// create and save new user
const createUser = async (req, res) => {
  const { error } = validateSignup(req.body);

  if (error) {
    return res.status(500).send(error.details);
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

export default createUser;
