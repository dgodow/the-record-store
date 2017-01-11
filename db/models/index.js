'use strict'

// Require our models. Running each module registers the model into sequelize
// so any other part of the application could call sequelize.model('User')
// to get access to the User model.

const User = require('./user')
const Album = require('./album')
const Shipping = require('./shipping')
const CreditCard = require('./credit_card')
const Order = require('./order')
const AlbumReview = require('./album_review')
const ShoppingCart = require('./shopping_cart')

Shipping.belongsTo(User)
User.hasMany(Shipping)
User.hasMany(CreditCard)
CreditCard.belongsTo(User)

Album.belongsToMany(User, {through: ShoppingCart})
User.belongsToMany(Album, {through: ShoppingCart})

Order.belongsTo(User)
User.hasMany(Order)

Album.hasMany(AlbumReview)
AlbumReview.belongsTo(Album)

module.exports = {User, Album, Shipping, ShoppingCart, CreditCard, AlbumReview, Order}