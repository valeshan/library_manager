'use strict';
module.exports = (sequelize, DataTypes) => {
  var Loans = sequelize.define('Loans', {
    id:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    book_id: DataTypes.INTEGER,
    patron_id: DataTypes.INTEGER,
    loaned_on: DataTypes.DATE,
    return_by: DataTypes.DATE,
    returned_on: DataTypes.DATE,
  }, {
    timestamps: false
  },{
    instanceMethods:{
      overdue: function(){
        if(this.return_by < date('now')){
          return this.book_id;
        }
      }
    }
  });
  Loans.associate = function(models) {
    // associations can be defined here
    Loans.belongsTo(models.Books, {foreignKey: 'book_id'});
    Loans.belongsTo(models.Patrons, {foreignKey: 'patron_id'})
  };
  return Loans;
};
