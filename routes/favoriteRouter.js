const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Favorites = require('../models/fovorites');

const favoriteRouter = express.Router();
const cors = require('./cors');

favoriteRouter.use(bodyParser.json());
var authenticate = require('../authenticate');

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get((req, res, next) => {
    Favorites.find({user: req.user._id })
    .populate('user')
    .populate('dishes')
    .then((favorites) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions,authenticate.verifyAdmin, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({user:req.user._id})
    .then((favorite) => {
        if(favorite){
            req.body.map((dish)=>{
                if(favorite.dishes.filter(obj=>obj_id===dish._id).length===0){
                    favorite.dishes.push(dish)

                }
                });
                favorite.save()
                .then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                }, (err) => next(err))
                .catch((err) => next(err));
        }else{
            Favorites.create({user:req.user._id,dishes:req.body})
            .then((favorites)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);
            },
            (err) => next(err)
            )
        }

    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions,authenticate.verifyAdmin, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /fovorites');
})
.delete(cors.corsWithOptions,authenticate.verifyAdmin,  authenticate.verifyUser, (req, res, next) => {
    Favorites.deleteMany({user: req.user._id })
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});
favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get((req,res,next) => {
    Favorites.findById(req.params.dishId)
    .populate('comments.author')
    .then((favorite) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorite);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions,authenticate.verifyAdmin, authenticate.verifyUser, (req, res, next) => {
    Favorites.findAll({user:req.user._id})
    .then((favorites)=>{
        if(favorites.length!==0){
            favorites.map((favorite)=>{
                if(favorite.dishes.filter(obj=>obj._id===req.params.dishId).length===0){
                favorite.dishes.push({_id:req.params.dishId});
                favorite.save()
                .then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                }, (err) => next(err))
                .catch((err) => next(err));    
                }
            })
        }else{
            Favorites.create({ user:req.user._id, dishes:[{_id:req.params.dishId}]});
            Favorites.save()
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions,authenticate.verifyAdmin,  authenticate.verifyUser, (req, res, next) => {
    Favorites.findByIdAndUpdate(req.params.dishId, {
        $set: req.body
    }, { new: true })
    .then((favorite) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorite);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions,authenticate.verifyAdmin, authenticate.verifyUser, (req, res, next) => {
    Favorites.findAll({user:req.user._id})
    .then((favorites) => {
      favorites.map((favorite)=>{
          favorite.dishes=favorite.dishes.filter(obj=>obj._id!==req.params.dishId)
          favorite.save()
      })
        // res.statusCode = 200;
        // res.setHeader('Content-Type', 'application/json');
        // res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});
