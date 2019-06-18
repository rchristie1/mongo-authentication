const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const {auth} = require('./middleware/auth');

const app = express();

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/auth', { useCreateIndex: true, useNewUrlParser: true });

// import the user model
const { User } = require('./models/user');

app.use(bodyParser.json());
app.use(cookieParser());

app.post('/api/user', (req, res) => {
  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
  });

  user.save((err, doc) => {
    err ? res.status(400).send(err) : res.status(200).send(doc);
  });
});

app.post('/api/user/login', (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) res.json({ message: 'User Not Found :(' });

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (err) throw err;
      if (!isMatch)
        return res.status(400).json({
          message: 'Incorrect Password',
        });
        else{
          user.generateToken((err, user) => {
            if (err) return res.status(400).send(err);
            return res.cookie('auth', user.token).status(200).send('ok');
          });
        }
      
    });
  });
});

//pass in auth as a middleware to run before callback
app.get('/user/profile/',auth,(req, res) => {  
  res.status(200).send(req.token);
})

// app.get('/api/data/', (req, res) => 'hello ' + res.send('Hi'));

//setup the port for dev/prod
const port = process.env.PORT || 3000;

// start listening on this port
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
