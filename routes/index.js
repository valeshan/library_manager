const express = require('express');
const router = express.Router();
const date = new Date();

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const Books = require('../models').books;
const Loans = require('../models').loans;
const Patrons = require('../models').patrons;




/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Library Manager' });
});





      //************ BOOKS *************//



//GET All Books
router.get('/all_books', function(req,res,err){
  Books.findAll().then(function(books){
      res.render("all_books", {books:books})
  })
});

//GET OVERDUE BOOKS
router.get('/overdue_books', function(req, res, next) {
    Loans.findAll({where: {
                    return_by:{
                            [Op.lt]: date
    }}}).then(function(loans){
      res.render('overdue_books', {loans:loans});
    })
  });

router.get('/checked_books', function(req, res, next) {
  res.render('checked_books');
});

router.get('/new_book', function(req, res, next) {
  res.render('new_book');
});




      //************ LOANS *************//




//GET ALL LOANS
router.get('/all_loans', function(req,res,err){
  Loans.findAll().then(function(loans){
      res.render("all_loans", {loans:loans})
  })
});

//GET OVERDUE LOANS
router.get('/overdue_loans', function(req, res, next) {
    Loans.findAll({where: {
                    return_by:{
                            [Op.lt]: date
                          },
                    returned_on: null
  }}).then(function(loans){
      res.render('all_loans', {loans:loans});
    })
  });





module.exports = router;
