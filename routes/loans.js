const express = require('express');
const { Books, Loans, Patrons } = require('../models');

const router = express.Router();
const date = new Date();

const Sequelize = require('sequelize');
const Op = Sequelize.Op;



//************ LOANS *************//


//GET ALL LOANS

router.get('/all_loans', function(req,res,err){
  Loans.findAll({
            include:[
              {model: Books},
              {model: Patrons}
            ]
}).then(function(loans){
  res.render('all_loans', {loans:loans})
  })
});


//GET OVERDUE LOANS

router.get('/overdue_loans', function(req, res, next) {
  Loans.findAll({where: {
                return_by:{
                        [Op.lt]: date
                      },
                returned_on: null
                      }
                , include:[
                  { model: Books},
                  { model: Patrons}
                ]
}).then(function(loans){
  res.render('all_loans', {loans:loans});
  })
});


//GET CHECKED OUT LOANS

router.get('/checked_loans', function(req, res, next) {
  Loans.findAll({where: {
                loaned_on:{
                        [Op.ne]: null
                      },
                returned_on:{
                        [Op.eq]: null
                      }
                }
              , include:[
                { model: Books},
                { model: Patrons}
              ]
  }).then(function(loans){
  res.render('all_loans', {loans:loans});
  })
});

//ADD NEW LOAN
router.get('/new_loan', function(req, res, next){
  Books.findAll().then(function(books){
    Patrons.findAll().then(function(patrons){
      res.render('new_loan', {patrons:patrons, books:books});
    });
  });
})


module.exports = router;
