/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
import db from '../Database/models';

const { Product } = db;

export const getAllBuyerItems = async (req, res) => {
  try {
    const pageAsNumber = Number.parseInt(req.query.page, 10);
    const sizeAsNumber = Number.parseInt(req.query.size, 10);

    let page = 1;
    if (!Number.isNaN(pageAsNumber) && pageAsNumber > 1) {
      page = pageAsNumber;
    }

    let size = 5;
    if (!Number.isNaN(sizeAsNumber) && sizeAsNumber > 0 && sizeAsNumber < 10) {
      size = sizeAsNumber;
    }
    const offset = (page - 1) * size;

    const items = await Product.findAndCountAll({
      where: {
        status: 'available'
      },
      limit: size,
      offset
    });

    // Returning paginated results
    return res.status(200).json({
      status: 200,
      data: {
        totalItems: items.count,
        totalPages: Math.ceil(items.count / size),
        itemsPerPage: size,
        currentPage: page,
        items: items.rows,
      },
      message: 'product retrived',
    });
  } catch (error) {
    return res.status(500).json({ message: 'server error' });
  }
};

export const getAllSellerItems = async (req, res) => {
  try {
    const pageAsNumber = Number.parseInt(req.query.page, 10);
    const sizeAsNumber = Number.parseInt(req.query.size, 10);

    let page = 1;
    if (!Number.isNaN(pageAsNumber) && pageAsNumber > 1) {
      page = pageAsNumber;
    }

    let size = 5;
    if (!Number.isNaN(sizeAsNumber) && sizeAsNumber > 0 && sizeAsNumber < 10) {
      size = sizeAsNumber;
    }
    const offset = (page - 1) * size;

    const { user } = req;

    const items = await Product.findAndCountAll({
      where: {
        userId: `${user.id}`
      },
      limit: size,
      offset
    });

    // Returning paginated results
    return res.status(200).json({
      status: 200,
      data: {
        totalItems: items.count,
        totalPages: Math.ceil(items.count / size),
        itemsPerPage: size,
        currentPage: page,
        items: items.rows,
      },
      message: 'product retrived',
    });
  } catch (error) {
    return res.status(500).json({ message: 'server error' });
  }
};
