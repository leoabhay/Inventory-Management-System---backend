const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

//signup controller
exports.signup = async (req,res) => {
    const{name, email, password} = req.body;

    try{
        console.log('Signup request received', req.body);
        const userExists = await User.findOne({email});
        if(userExists) return res.status(400).json({message: 'User already exists'});

        const hashedPassword = await bcrypt.hash(password,10)
        const newUser = new User ({name, email, password: hashedPassword});
        await newUser.save();

        res.status(201).json({message: 'User created successfully'});

    }catch(err){
        console.error('Error in signup', err);
        res.status(500).json({message: 'Internal server error'});
    }
};

//login controller
exports.login = async (req,res) => {
    const{email, password} = req.body;

    try{
        console.log('Login request received', req.body);
        const user = await User.findOne({email});
        if(!user) return res.status(404).json({message: 'User not found'});

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({message: 'Your password is incorrect'});

        const token = jwt.sign({userId: user.Id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h'});
        res.json({token});

    }catch(err){
        console.error('Error in login', err);
        res.status(500).json({message: 'Internal server error'})
    }
};