const express = require('express');
const { Books, Loans, Patrons } = require('../models');

const router = express.Router();
const date = new Date();

const Sequelize = require('sequelize');
const Op = Sequelize.Op;



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