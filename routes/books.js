const express = require('express');
const { Books, Loans, Patrons } = require('../models');

const router = express.Router();
const date = new Date();
const moment = require('moment');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;



//************* BOOKS *************//


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
  res.render('new_book', {book: Books.build()});
});

//POST NEW BOOK

router.post('/new_book', function(req, res, next){
  Books.create(req.body).then(function(book){
    res.redirect('all_books');
  }).catch(function(err){
    if(err.name === "SequelizeValidationError"){
        res.render("new_book",
                   {book: Books.build(req.body),
                    errors: err.errors
        });
    } else{
      throw err;
    }
  }).catch(function(err){
    res.send(500);
  });
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


//UPDATE BOOK DETAIL
router.post('/all_books/:id', function(req, res, next){
  Books.findById(req.params.id).then(function(book){
    return  book.update(req.body);
  }).then(function(book){
    res.redirect('/all_books')
  }).catch(function(err){
    if(err.name === "SequelizeValidationError"){
        Books.find({
                    include: [
                    {
                      model: Loans,
                      include: [Patrons, Books]}
                    ],
                    where:
                      {id: req.params.id}
        }).then(function(book){
          book.id = req.params.id;
          res.render('book_detail/'+book.id, {book: book, errors: err.errors})
        });
    }else{
      throw err;
    }
  }).catch(function(err){
    res.sendStatus(500);
  });
})







module.exports = router;
