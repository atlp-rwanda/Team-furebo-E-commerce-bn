/* jshint esversion: 6 */

const db = require("../models");
const User = db.users;
const Op = db.Sequelize.Op;
const bcrypt = require('bcrypt');

// Create and Save a new user
exports.create = (req, res) => {
    // Validate request
    if (!req.body.names || !req.body.email || !req.body.password) {
        res.status(400).json({
          msg: "Content can not be empty !"
        });
        return;
      }
    
      // Create a User
      const user = {
        names: req.body.names,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10), // Hashing users password
      };
    
      // Save User in the database
      User.create(user)
        .then(data => {
           res.send({msg: "user created successfully", data})
        })
        .catch(err => {
          return res.status(500).json({
            msg:
              err.message || "Some error occurred while creating the User."
          });
        });
};

// Retrieve all Users from the database.
exports.findAll = (req, res) => {
    const names = req.query.names;
    var condition = names ? { names: { [Op.iLike]: `%${names}%` } } : null;
  
    User.findAll({ where: condition })
      .then(data => {
        res.send({msg: "users retrieved successfully", data})
      })
      .catch(err => {
        res.status(500).json({
          msg:
            err.message || "Some error occurred while retrieving users."
        });
      });
  };
  
  // Find a single User with an id
  exports.findOne = (req, res) => {
    const id = req.params.id;
  
    User.findByPk(id)
      .then(data => {
        res.send({msg: `User with id ${id } retrievd successfully`, data});
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving User with id=" + id
        });
      });
  };
  
  // Update a User by the id 
  exports.update = (req, res) => {
    const id = req.params.id;
  
    User.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "User was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating User with id=" + id
        });
      });
  };

  
  // Delete a User with the specified
  exports.delete = (req, res) => {
    const id = req.params.id;
  
    User.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "User was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete User with id=${id}. Maybe User was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete User with id=" + id
        });
      });
  };
  
  // Delete all Users from the database.
  exports.deleteAll = (req, res) => {
    User.destroy({
      where: {},
      truncate: false
    })
      .then(nums => {
        res.send({ message: `${nums} Users were deleted successfully!` });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all users."
        });
      });
  };

  
  
