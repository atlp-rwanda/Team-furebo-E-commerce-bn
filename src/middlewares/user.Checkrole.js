const RoleCheck = (acceptedRoles) => (req, res, next) => {
  try {
    const { userRole } = req;
    if (acceptedRoles.includes(userRole.name)) {
      next();
    } else {
      return res.status(401).json({
        status: 401,
        message: `you are not allowed to access this collection, only merchant is accepted`
      });
    }
  } catch (error) {
    return res.status(500).json({ message: 'There is a server error' });
  }
};

export default RoleCheck;
