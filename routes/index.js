var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Library Manager' });
});

router.get('/all_books', function(req, res, next) {
  res.render('all_books');
});

router.get('/overdue_books', function(req, res, next) {
  res.render('overdue_books');
});


router.get('/checked_books', function(req, res, next) {
  res.render('checked_books');
});

router.get('/new_book', function(req, res, next) {
  res.render('new_book');
});

module.exports = router;
