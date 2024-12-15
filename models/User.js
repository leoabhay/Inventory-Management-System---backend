const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// const User = mongoose.model("User", userSchema);

//validation using joi
// const validate = (data) => {
//     const schema = Joi.object({
//         name: Joi.string().required.label("Full Name"),
//         email: Joi.string().email().label("Email"),
//         password: passwordComplexity().required().label("Password")
//     });
//     return schema.validate(data);
// };

module.exports = mongoose.model('User', userSchema);