'use strict';
module.exports = (sequelize, DataTypes) => {
  var loans = sequelize.define('loans', {
    id:{
      type: DataTypes.INTEGER,
      primaryKey: true
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
  loans.associate = function(models) {
    // associations can be defined here
  };
  return loans;
};
