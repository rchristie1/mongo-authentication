const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_I = 10;
const jwt = require('jsonwebtoken');

//create the new database for mongoDB
const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    required: true,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  token: {
    type: String,
  },
});

userSchema.pre('save', function(next) {
  const user = this;

  if (user.isModified('password')) {
    bcrypt.genSalt(SALT_I, (err, salt) => {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  }
});

// mongoose function/method to compare pw's
userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) throw cb(err);
    cb(null, isMatch);
  });
};

userSchema.methods.generateToken = function(cb) {
  const user = this;
  
  const token = jwt.sign(user._id.toHexString(), 'secretword');
  
  user.token = token;
  // user.save((err, user) => {
  //   console.log(user);
  //   if (err) return cb(err);
    cb(null, user);
  // });
};

userSchema.statics.findByToken = function (token, cb) {
  const user = this;

  jwt.verify(token, 'secretword', (err, decode) => {
    user.findOne({"_id":decode, "token":token}, () => {
      if(err) return cb(err);

      cb(null, user);
    })
  });
}

const User = mongoose.model('User', userSchema);

module.exports = { User };
