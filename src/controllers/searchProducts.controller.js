import { Op } from 'sequelize';
import db from '../Database/models';

const { Product } = db;

const searchProduct = async (req, res) => {
  const { name, category, minPrice, maxPrice } = req.query;

  // Define the where object with the search conditions
  const where = {};

  if (name) {
    where.name = { [Op.iLike]: `%${name}%` };
  }

  if (category) {
    where.category = { [Op.iLike]: `%${category}%` };
  }

  if (minPrice && maxPrice) {
    where.price = { [Op.between]: [minPrice, maxPrice] };
  } else if (minPrice) {
    where.price = { [Op.gte]: minPrice };
  } else if (maxPrice) {
    where.price = { [Op.lte]: maxPrice };
  }

  const items = await Product.findAll({ where });
  // if (items.length === 0) {
  // return res.status(404)
  //  .send({ message: 'Product not found' });
  // }
  return res.status(200).json({
    status: 200,
    message: 'successfully Products found.',
    data: items,
  });
};

export default searchProduct;
