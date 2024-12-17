const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {User, validate} = require('../models/User');

// Authorization Middleware
exports.authorize = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "No token, authorization denied" });
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = decoded; // Attach decoded user data to the request
      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid token" });
    }
  };

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

        //create and save new user
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
        const token = jwt.sign({userId: user._id, name: user.name, email: user.email }, process.env.JWT_SECRET_KEY, { expiresIn: '8h'});

         // Send the response with the token
        res.status(200).json({
        message: 'Login successful',
        token: token, // Send the token in response
        });

    }catch(err){
        console.error('Error in login:', err);
        res.status(500).json({message: 'Internal server error'})
    }
};


//get profile controller
exports.profile = async(req,res) => {
    const { userId } = req.user;

    try{
        console.log("Profile request received:", req.user);

        const user = await User.findById(userId).select("-password");  //excluding password
        if(!user) return res.status(404).json({message: 'User not found'});

        res.status(201).json({
            name: user.name,
            email: user.email,
            avatar: "https://via.placeholder.com/150"
        });

    }catch(err){
        console.error('Error in get profile:', err);
        res.status(500).json({message: 'Internal server error'})
    };
};