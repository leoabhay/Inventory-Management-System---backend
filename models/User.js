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
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

//validation using joi
const validate = (data) => {
    const schema = Joi.object({
        name: Joi.string().required().label("Full Name"),
        email: Joi.string().email().required().label("Email"),
        password: passwordComplexity().required().label("Password"),
        confirmPassword: Joi.string()
                .valid(Joi.ref('password'))
                .required()
                .label("Confirm Password")
                .messages({'any.only': 'Passwords do not match'}),
    });
    return schema.validate(data);
};

module.exports = {
    User: mongoose.model('User', userSchema),
    validate,
};