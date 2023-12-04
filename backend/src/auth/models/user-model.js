const mongoose = require("mongoose");

// Interface that describes the properties that are needed to create a new User.
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
        },
        versionKey: false
    }
});

// Represents a single record from the database
userSchema.statics.build = (attrs) => {
    return new User(attrs);
}

// Represents the entire collection of data
const User = mongoose.model('User', userSchema);

module.exports = { User };
