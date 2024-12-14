import validator from 'validator';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import userModel from '../models/userModels.js';
 
// Token accsess
const createToken = (user) => {
      return jwt.sign(
            {
                  _id: user._id,
                  email: user.email,
                  name: user.name,
            },
            process.env.JWT_SECRET,
            { expiresIn: '20h' }
      );
};



//   User login Start
const userLogin = async (req, res) => {
      try {
            const { email, password } = req.body;

            // Input validation
            if (!email) {
                  return res.json({
                        success: false,
                        message: 'Email is required!'
                  });
            }

            if (!password) {
                  return res.json({
                        success: false,
                        message: 'Password is required!'
                  });
            }

            // Check if user exists
            const user = await userModel.findOne({ email });
            if (!user) {
                  return res.json({
                        success: false,
                        message: 'User does not exist!'
                  });
            }

            // Compare password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                  return res.json({
                        success: false,
                        message: 'Invalid credentials, try again'
                  });
            }

            // Generate token if credentials are valid
            const token = createToken(user);
            return res.json({
                  success: true,
                  token,
                  message: 'User login successfully!'
            });

      } catch (error) {
            console.log('User Login error!', error);
            return res.status(500).json({
                  success: false,
                  message: error.message
            });
      }
};
//   User login End


// User Register Start
const userRegister = async (req, res) => {
      try {
            const { name, email, password } = req.body;
            // Request body varification
            if (!name) {
                  return res.json({
                        success: false,
                        message: 'Name is required!'
                  })
            }
            if (!email) {
                  return res.json({
                        success: false,
                        message: 'Email is required!'
                  })
            }
            if (!password) {
                  return res.json({
                        success: false,
                        message: 'Password is required!'
                  })
            }
            // Email validation
            if (!validator.isEmail(email)) {
                  return res.json({
                        success: false,
                        message: 'Please enter a valid email address'
                  })

            }
            // Check user status
            const existing = await userModel.findOne({ email })
            if (existing) {
                  return res.json({ success: true, message: 'User already exists!' })
            }
            // Password validation
            if (password.length < 8) {
                  return res.json({
                        success: false,
                        message: 'Password length should be equal or trater than 8 '
                  })

            }
            // Hashing user password
            const salt = await bcrypt.genSalt(10)
            const encryptedPassword = await bcrypt.hash(password, salt)
            // Register a new User
            const newUser = new userModel({
                  name,
                  email,
                  password: encryptedPassword,
            })
            // Save user in database
            await newUser.save()

            // Success Register 
            return res.json({
                  success: true,
                  message: 'User Registered Successfully!'
            })
      } catch (error) {
            console.log('User register error!', error)
            res.json({ success: true, message: error?.message })
      }
};
// User Register End

//  Admin user Start
const adminLogin = async (req, res) => {
      try {
            const { email, password } = req.body;

            // Input validation
            if (!email) {
                  return res.json({
                        success: false,
                        message: 'Email is required!'
                  });
            }

            if (!password) {
                  return res.json({
                        success: false,
                        message: 'Password is required!'
                  });
            }

            // Check if user exists
            const user = await userModel.findOne({ email });
            if (!user) {
                  return res.json({
                        success: false,
                        message: 'User does not exist!'
                  });
            }

            // Compare password
            const isMatch = await bcrypt.compare(password, user.password);

            if (isMatch) {
                  const token = createToken(user)
                  return res.json({
                        success: true,
                        token,
                        message: 'Admin login successfully!'
                  });
            } else {
                  return res.json({
                        success: false,
                        message: 'Password not matched, try again!'
                  });
            }

      } catch (error) {
            console.log('Admin login error!', error)
            res.json({ success: true, message: error?.message })
      }
};
//  Admin user End


// Remove user Start
const removeUser = async (req, res) => {
      try {
            await userModel.findOneAndDelete({ _id: req.body._id });
            return res.send({
                  success: true,
                  message: 'User deleted successfully!',
            });

      } catch (error) {
            console.log('Remove user error!', error);
            res.json({ success: false, message: error?.message || "Failed to delete user" });
      }
};
// Remove user End


// Update user start
const updateUser = async (req, res) => {
      try {
            const { _id, name, email, password } = req.body;
            const user = await userModel.findById(_id)
            if (!user) {
                  return res.json({
                        success: false,
                        message: 'User not found!'
                  })
            }
            // Name
            if (name) user.name = name;
            // Email
            if (email) {
                  if (!validator.isEmail(email)) {
                        return res.json({
                              success: false,
                              message: 'Please enter avalid email address'
                        })
                  }
                  user.email = email
            }
            // Password
            if (password.length < 8) {
                  return res.json({
                        success: true,
                        message: 'Password length should be equal or trater than 8 '
                  })

            }
            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(password, salt)
            // Updating the user
            await user.save();

            res.json({
                  success: true,
                  message: 'User updated successfully!'
            })

      } catch (error) {
            console.log('User Update  error!', error)
            res.json({ success: true, message: error?.message })
      }
};
// Update user End

// Get user start
const getUser = async (req, res) => {
      try {
            const total = await userModel.countDocuments({});
            const users = await userModel.find({});

            return res.json({
                  success: true,
                  total,
                  users
            });

      } catch (error) {
            console.log('All users get error!', error);

            return res.status(500).json({
                  success: false,
                  message: error?.message
            });
      }
};
// Get user End


export { userLogin, userRegister, adminLogin, removeUser, updateUser, getUser }



















