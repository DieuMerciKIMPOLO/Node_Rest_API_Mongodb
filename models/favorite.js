const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);

var mongoose = require('mongoose');

const favoriteSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dishes: [{
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Dish'
        }
    }]
},{
    timestamps: true
});
var Favorites = mongoose.model('Favorites', favoriteSchema);
module.exports = Favorites;