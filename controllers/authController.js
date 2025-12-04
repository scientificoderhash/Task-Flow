const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.signUp = async (req, res) => {
    try{
    const {name, username, password} = req.body;
    // const existingUser = await {check if user exists in db}
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

// create newUser, User is a mongoose model
    // const newUser = new User({
    //   name,
    //   email,
    //   passwordHash: hashedPassword,
    // });
    // await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
    } catch(error){
        console.error(error);
        res.status(500).json({ message: 'Server error during signup' });
    }
}