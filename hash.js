const bcrypt = require('bcrypt');
const {MD5} = require('crypto-js');
const jwt = require('jsonwebtoken');

// bcrypt.genSalt(10,(err, salt)=> {
//     if(err) return next(err);

//     bcrypt.hash('password123', salt, (err,hash)=> {
//         if(err) return next(err);
//         console.log(hash);
        
//     })

    
// })

// const sercret = 'sercretpassword';
// const sercretSalt = 'sdgadggdsgsdaggdgsdggdsgdsadssdg'

// const user = {
//     id:1,
//     token: MD5('FDAGSFAGSDG').toString() +sercretSalt
// }

// const recievedToken = '6ac27649fb958be5f989ba24a6ec58a6sdgadggdsgsdaggdgsdggdsgdsadssdg';

// if(recievedToken === user.token) {
//     console.log('proceed');
// }

// console.log(user);

const id = '1000';
const secret = 'secretword';

const recievedToken = 'eyJhbGciOiJIUzI1NiJ9.MTAwMA.WzaAdCICnYD_xDCJGoUOnncmqP2Y9m84LrY5bCW1EV4';

const token = jwt.sign(id, secret);
const decodeToken = jwt.veryify(recievedToken, secret);

console.log(token);


