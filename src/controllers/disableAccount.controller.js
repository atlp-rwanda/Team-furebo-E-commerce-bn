/* eslint-disable arrow-parens */

import { User } from '../Database/models';

const update = (req, res) => {
  const { id } = req.params;
  User.update(req.body, {
    where: { id },
  })
    .then((num) => {
      // eslint-disable-next-line eqeqeq
      if (num == 1) {
        res.send({
          message: 'User is disabled successfully.',
        });
      } else {
        res.send({
          message: `Cannot update User with id=${id}. User was not found !`,
        });
      }
    })
    .catch(() => {
      res.status(500).send({
        message: `Error disable User with id=${id}`,
      });
    });
};

export default update;
