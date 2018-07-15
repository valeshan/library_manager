'use strict';
module.exports = (sequelize, DataTypes) => {
  var Books = sequelize.define('Books', {
    id:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: DataTypes.STRING,
    author: DataTypes.STRING,
    genre: DataTypes.STRING,
    first_published: DataTypes.INTEGER,
  }, {
    timestamps: false
  },{
    instanceMethods: {
    }
  });
  Books.associate = function(models) {
    // associations can be defined here
    Books.hasMany(models.Loans, {foreignKey: 'book_id'})
  };
  return Books;
};
