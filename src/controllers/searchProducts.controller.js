import { Op } from 'sequelize';
import db from '../Database/models';

const { Product } = db;

const searchProduct = async (req, res) => {
  const {
    name, type, minPrice, maxPrice
  } = req.query;

  // Define the where object with the search conditions
  const where = {};

  if (name) {
    where.name = { [Op.iLike]: `%${name}%` };
  }

  if (type) {
    where.type = { [Op.iLike]: `%${type}%` };
  }

  if (minPrice && maxPrice) {
    where.price = { [Op.between]: [minPrice, maxPrice] };
  } else if (minPrice) {
    where.price = { [Op.gte]: minPrice };
  } else if (maxPrice) {
    where.price = { [Op.lte]: maxPrice };
  }

  const items = await Product.findAll({ where });

  return res.status(200).json({ status: 200, message: 'successfully Products found.', data: items });
};

export default searchProduct;
