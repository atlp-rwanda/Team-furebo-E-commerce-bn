import db from '../Database/models';
import querySchema from '../validation/query.validator';
import asyncWrapper from '../utils/handlingTryCatchBlocks';

const { CustomerSupport } = db;

export const sendQuery = asyncWrapper(
  async (req, res) => {
    const { email, fullname, message } = req.body;
    const { error } = querySchema(req.body);
    if (error) {
      return res.status(406).send(error.details[0].message);
    }
    const query = await CustomerSupport.create({
      email,
      fullname,
      message
    });
    res.status(201).json({
      status: 'success',
      data: query,
      message: 'Query sent sucessfully',
    });
  }
);

export const getAllQueries = asyncWrapper(
  async (req, res) => {
    const allQueries = await CustomerSupport.findAll({});
    if (!allQueries) {
      res.status(200).json({
        status: 'success',
        data: allQueries,
        message: 'no message found',
      });
    }
    res.status(200).json({
      status: 'success',
      data: allQueries,
      message: 'messages',
    });
  }
);
