const searchProductValidator = async (req, res, next) => {
  const {
    name, category, minPrice, maxPrice
  } = req.query;
  try {
    if (name || category || minPrice || maxPrice) {
      req.searchQuery = req.query;
      next();
    } else {
      return res.status(406).json({ message: 'you should provide at least one query' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Internal server error', error });
  }
};

export default searchProductValidator;
