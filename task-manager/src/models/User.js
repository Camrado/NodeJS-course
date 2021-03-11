const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./Task.js');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) throw new Error('Email must be valid!');
      }
    },
    age: {
      type: Number,
      default: 0,
      validate(value) {
        if (value < 0) {
          throw new Error('Age must be a positive number');
        }
      }
    },
    password: {
      type: String,
      required: true,
      minLength: 7,
      trim: true,
      validate(value) {
        if (value.toLowerCase().includes('password')) {
          throw new Error("Password cannot contain 'password'");
        }
      }
    },
    tokens: [
      {
        token: {
          type: String,
          required: true
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

userSchema.virtual('tasks', {
  ref: 'Task',
  foreignField: 'owner',
  localField: '_id'
});

// generate jwt token
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, 'thisissomemegapowerfulpassword');

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

// Hiding private data like password and tokens
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

// return user by its email and password
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) throw new Error('Unable to login!');

  const isMatched = await bcrypt.compare(password, user.password);

  if (!isMatched) throw new Error('Unable to login!');

  return user;
};

// Hash the plain user password before saving
userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

// Delete user tasks when user is removed
userSchema.pre('remove', async function (next) {
  const user = this;
  await Task.deleteMany({ owner: user._id });
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
