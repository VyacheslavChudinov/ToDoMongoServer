const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    username: { type: String, unique: true, required: true },
    hash: { type: String, required: true },
    firstName: { type: String,  default: '' },
    lastName: { type: String, default: '' },
    createdDate: { type: Date, default: Date.now },
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }]
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret.hash;
        delete ret._id;
    }
});

module.exports = mongoose.model('User', schema);