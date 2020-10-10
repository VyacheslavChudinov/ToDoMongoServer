const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    createdDate: { type: Date, default: Date.now },
    deadlineDate: { type: Date },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});

module.exports = mongoose.model('Post', schema);