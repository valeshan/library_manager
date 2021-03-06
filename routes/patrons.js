const express = require('express');
const { Books, Loans, Patrons } = require('../models');

const router = express.Router();
const date = new Date();

const Sequelize = require('sequelize');
const Op = Sequelize.Op;



//************ PATRONS ************//


//GET ALL PATRONS

router.get('/all_patrons', function(req,res,next){
  Patrons.findAll().then(function(patrons){
      res.render("all_patrons", {patrons:patrons})
  })
});

// GET PATRON DETAIL

router.get('/all_patrons/:id', function(req, res, next){
  Patrons.find({
    include: [
      {
        model: Loans,
          include: [Books, Patrons]
      }],
      where:{
        id: req.params.id
      }
    }).then(function(patron){
      res.render('patron_detail', {patron:patron})
    })
});

//UPDATE PATRON DETAIL
router.post('/all_patrons/:id', function(req, res, next) {
  Patrons.findAll({
    where: {
      id: req.params.id
    }
  })
    .then(function(patron) {
      return Patrons.update(req.body, {
        where: {
          id: req.params.id
        }
      }).then(() => {
        res.redirect('/all_patrons');
      });
    })
    .catch(function(error) {
      if (error.name === 'SequelizeValidationError') {
        Patrons.findAll({
          where: {
            id: req.params.id
          },
          include: [
            {
              model: Loans,
              include: [
                {
                  model: Books
                }
              ]
            }
          ]
        }).then(function(patronDetails) {
          console.log(patronDetails[0].dataValues.id); // This gives you the ID
          res.render('new_patron', {patron: Patrons.build(req.body), errors: error.errors}); // Change this to render the correct template and change errors
        });
      }
    });
});

//POST NEW PATRON

router.post('/new_patron', function(req, res, next){
  Patrons.create(req.body).then(function(patron){
    res.redirect('all_patrons')
  }).catch(function(err){
      if(err.name === "SequelizeValidationError"){
          res.render("new_patron",
                     {patron: Patrons.build(req.body),
                      errors: err.errors
          });
      } else{
        throw err;
      }
    }).catch(function(err){
      res.send(500);
    });
});


//ADD NEW PATRON

router.get('/new_patron', function(req, res, next) {
  res.render('new_patron', {patron: Patrons.build()})
});



module.exports = router;
