const express = require('express');
const { Books, Loans, Patrons } = require('../models');

const router = express.Router();
const date = new Date();

const Sequelize = require('sequelize');
const Op = Sequelize.Op;


      //************ BOOKS *************//



//GET ALL BOOKS
router.get('/all_books', function(req,res,err){
  Books.findAll().then(function(books){
      res.render("all_books", {books:books})
  })
});

//GET OVERDUE BOOKS
router.get('/overdue_books', function(req, res, next) {
    Books.findAll({
                    include:[
                      {model: Loans,
                      where: {
                            return_by:{
                                      [Op.lt]: date
                            },
                            returned_on: null
                      }}
                    ]
                  }
  ).then(function(books){
      res.render('all_books', {books:books})
    })
  });



//GET CHECKED BOOKS
router.get('/checked_books', function(req, res, next) {
  Books.findAll({
                  include:[
                    {model: Loans,
                      where: {
                            loaned_on:{
                            [Op.ne]: null
                            },
                            returned_on:{
                            [Op.eq]: null
                            }
                    }
                  }]
}).then(function(books){
    res.render('all_books', {books:books})
  })
});


//ADD NEW BOOK
router.get('/new_book', function(req, res, next) {
  res.render('new_book');
});



//GET BOOK DETAIL
router.get('/all_books/:id', function(req, res, next) {
  Books.find({
              include: [
              {
                model: Loans,
                include: [Patrons, Books]}
              ],
              where:
                {id: req.params.id}
  }).then(function(book) {
      res.render('book_detail', { book: book });
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
                {book_id: req.params.id}
  }).then(function(loan) {
      res.render('return_book', { loan: loan });
  });
});


module.exports = router;
