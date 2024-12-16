const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {User, validate} = require('../models/User');

//signup controller
exports.signup = async (req,res) => {
    const{name, email, password, confirmPassword} = req.body;

    const {error} = validate(req.body);
    if (error) return res.status(400).json({message: error.details[0].message}); 

    try{
        console.log('Signup request received:', req.body);

        //compare password and confirm password
        if (password !== confirmPassword){
            return res.status(400).json({message: 'Passwords do not match'});
        };

        //check if user already exists
        const userExists = await User.findOne({email});
        if(userExists) return res.status(400).json({message: 'User already exists'});

        //hash the password and save new user
        const hashedPassword = await bcrypt.hash(password, 10);
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

    if(!email || !password) return res.status(400).json({message: 'Email and password are required'});

    try{
        console.log('Login request received:', req.body);

        //Find user by email
        const user = await User.findOne({email});
        if(!user) return res.status(404).json({message: 'User not found'});

        //compare password with stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({message: 'Your password is incorrect'});

        //generate jwt token
        const token = jwt.sign({userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h'});
        res.json({token});

    }catch(err){
        console.error('Error in login:', err);
        res.status(500).json({message: 'Internal server error'})
    }
};