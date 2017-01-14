'use strict'

const db = require('APP/db')
const User = db.model('users')

const ShoppingCartItem = require('../db/models/shopping_cart_items')

const {mustBeLoggedIn, forbidden, selfOnly, adminOnly} = require('./auth.filters')
const api = require('express').Router();

// ALL USERS

api.get('/', (req, res, next) =>
	User.scope('populate').findAll()
	.then(users => res.json(users))
	.catch(next)
)

api.post('/', (req, res, next) =>
	User.create(req.body)
	.then(user => res.sendStatus(201))
	.catch(next)
)

// SINGLE USER

// add mustBeLoggedIn, selfOnly AFTER AUTH IS WORKING
api.get('/:userId', (req, res, next) =>
	User.scope('populate').findById(req.params.id)
	.then(user => res.json(user))
	.catch(next)
)

// add mustBeLoggedIn, selfOnly AFTER AUTH IS WORKING
api.get('/:userId/orders', (req, res, next) =>
	Order.findAll({
		where: {user_id: req.params.userId}
	})
	.then(orders => res.json(orders))
	.catch(next)
)

// ADMIN ACTIVITIES -- UPDATING AND DELETING USER PROFILES

// add mustBeLoggedIn, adminOnly AFTER AUTH IS WORKING
api.put('/:userId', (req, res, next) =>
	User.update(req.body, {
		where: {id: req.params.userId}
	})
	.catch(next)
)

// add mustBeLoggedIn, adminOnly AFTER AUTH IS WORKING
api.delete('/:userId', (req, res, next) => {
	User.delete({
		where: {id: req.params.userId}
	})
	.catch(next)
})

// SHOPPING CART

// add mustBeLoggedIn, selfOnly AFTER AUTH IS WORKING
api.get('/:userId/cart', (req, res, next) => {
	ShoppingCartItem.findAll({
		where: {user_id: req.params.userId}
	})
	.then(items => res.json(items))
	.catch(next)
})

// add mustBeLoggedIn, selfOnly AFTER AUTH IS WORKING
api.put('/:userId/cart/', (req, res, next) => {
	ShoppingCartItem.findOrCreate({
		where: {
			album_id: req.body.album_id,
			user_id: Number(req.params.userId)
		},
		defaults: {
			quantity: req.body.quantity
		}
	})
	.then(() => res.sendStatus(201))
	.catch(console.error.bind(console))
})

// add mustBeLoggedIn, selfOnly AFTER AUTH IS WORKING
api.delete('/:userId/cart/:albumId', (req, res, next) => {
	ShoppingCartItem.destroy({
		where: {album_id: req.params.albumId}
	})
	.catch(next)
})

module.exports = api;
