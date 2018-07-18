const express = require('express');
const { Books, Loans, Patrons } = require('../models');

const router = express.Router();
const date = new Date();
const moment = require('moment');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;



//************* LOANS *************//


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


//POST NEW LOAN

router.post('/new_loan', function(req, res, next){
  Loans.create(req.body).then(function(loan){
    res.redirect('all_loans')
  }).catch(function(err){
      if(err.name === "SequelizeValidationError"){
          res.render("new_loan",
                     {loan: Loans.build(req.body),
                      errors: err.errors
          });
      } else{
        throw err;
      }
    }).catch(function(err){
      console.log(err);
    });
})


//ADD NEW LOAN

router.get('/new_loan', function(req, res, next){
  let loan = Loans.build({
    loaned_on: moment().format('YYYY-MM-DD'),
    return_by: moment().add(7, 'days').format('YYYY-MM-DD')
  });
  Books.findAll().then(function(books){
    Patrons.findAll().then(function(patrons){
      res.render('new_loan', {patrons:patrons, books:books, loan: loan});
    });
  });
});


//RETURN BOOK PAGE

router.get('/return_book/:id', function(req, res, next) {
  Loans.find({
              include:[
                       {model: Patrons},
                       {model: Books}
                     ],
              where:
                {id: req.params.id}
  }).then(function(loan) {
      loan.returned_on = moment().format('YYYY-MM-DD');
      res.render('return_book', { loan: loan });
  });
});

//UPDATE RETURNED BOOK
// router.post('/return_book/:id', function(req, res, next) {
//   Loans.findbyId(req.params.id).then(function(loan) {
//     loan.save();
//   }).then(function(loan){
//     res.redirect('all_loans');
//   }).catch(function(err){
//     res.send(500);
//   });
// });


router.post('/return_book/:id', function(req, res, next) {
  Loans.findbyId(req.params.id).then(function(loan) {
        loan.save().then(function(loan) {
            res.redirect('all_loans');
        }).catch(function(err) {
          if(err.name === "SequelizeValidationError") {
            Loans.findbyId(req.params.id).then(function(loan) {
              res.render('return_book', { loan: loan });
          });
         } else {
            console.log(err);
          }
        });
    });
});

// router.post('/return_book/:id', (req, res) => {
//   // const todaysDate = getDate();
//   Loans.findById(req.params.id)
//   Loans.update(req.body).then(() => { // Call the create ORM method on the Loans model
//     // res.render('new_loan', { newLoanDate, ReturnDate });
//     res.redirect('/all_loans');
//   });
// });



module.exports = router;
