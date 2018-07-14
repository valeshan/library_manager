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



//GET ALL BOOKS
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
                              }
                  }
    }).then(function(loans){
      res.render('overdue_books', {loans:loans})
    })
  });


//GET CHECKED BOOKS
router.get('/checked_books', function(req, res, next) {
  res.render('checked_books');
});


//ADD NEW BOOK
router.get('/new_book', function(req, res, next) {
  res.render('new_book');
});

//GET BOOK DETAIL
router.get('/all_books/:id', function(req,res,err){
  Books.findById(req.params.id).then(function(bookDetail){
      Loans.findAll({
        where: {
          book_id : req.params.id
        },
        include:[
          { model: Books},
          { model: Patrons}
        ]
      }).then(function(loanedBook){
        res.render("book_detail", {bookDetail, loanedBook})
      })
  })
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

//GET CHECKED OUT LOANS
router.get('/checked_loans', function(req, res, next) {
    Loans.findAll({where: {
                    loaned_on:{
                            [Op.ne]: null
                          },
                    returned_on:{
                            [Op.eq]: null
                    }
  }}).then(function(loans){
      res.render('all_loans', {loans:loans});
    })
  });



  //************ PATRONS *************//


//GET ALL PATRONS
router.get('/all_patrons', function(req,res,next){
  Patrons.findAll().then(function(patrons){
      res.render("all_patrons", {patrons:patrons})
  })
});

//POST NEW PATRON
router.post('/new_patron', function(req, res, next){
  Patrons.create(req.body).then(function(patron){
    res.redirect('/all_patrons')
  })
})


//ADD NEW PATRON
router.get('/new_patron', function(req, res, next) {
  res.render('new_patron', {patron: Patrons.build()})
});



module.exports = router;
