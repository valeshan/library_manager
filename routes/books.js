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
                    }
                  ]
                }
).then(function(books){
    res.render('all_books', {books:books})
  })
});


//ADD NEW BOOK
router.get('/new_book', function(req, res, next) {
  res.render('new_book');
});



//GET BOOK DETAIL

router.get('/:id', function(req,res,err){
  Books.findById(req.params.id).then(function(bookDetail){
      Loans.findAll({
        where: {
          book_id : req.params.id
            }
        },{
        include:[
          { model: Books},
          { model: Patrons}
        ]
      }).then(function(book){
        res.render("book_detail", {book: book, loans: loans})
      })
  })
});



module.exports = router;
