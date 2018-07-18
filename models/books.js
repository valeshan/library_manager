'use strict';
module.exports = (sequelize, DataTypes) => {
  var Books = sequelize.define('Books', {
    id:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Title is required'
        }
      }},
    author: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Author is required'
        }
      }},
    genre: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Genre is required'
        }
      }},
    first_published: {
      type: DataTypes.INTEGER},
  }, {
    timestamps: false
  });
  Books.associate = function(models) {
    // associations can be defined here
    Books.hasMany(models.Loans, {foreignKey: 'book_id'})
  }
  return Books;
};
