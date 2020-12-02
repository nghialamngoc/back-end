const router = require('express').Router();
const brcrypt = require('bcryptjs');
const User = require('../model/User');
const { registerUserErrorList, loginErrorList } = require('../utils/constant.js')
const { registerUserValidation, loginValidation } = require('../validate/auth');

router.post('/register', async (req, res) => {

  // validator before create a user
  const { error } = registerUserValidation(req.body);

  if(error) {
    const detail = error.details[0] || {};
    const errorType = detail.path || []

    return res.status(400).send({
      error: registerUserErrorList[errorType[0]],
      message: detail.message
    })
  }

  // checking if the user iis already in database
  const isExist = await User.findOne({ email: req.body.email });

  // hash passwords
  const salt = await brcrypt.genSalt(10);
  const hashPassword = await brcrypt.hash(req.body.password, salt);

  if ( isExist ) {
    return res.status(400).send({
      error: 'INVALID.EMAIL.EXIST',
      message: 'Email already exists'
    })
  }

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashPassword
  });
  
  try {
    const saveUser = await user.save();
    res.send({
      user: saveUser._id
    });

  } catch(err) {
    res.status(400).send(err)
  }
});

router.post('/login', async (req, res) => {

  // validator before create a user
  const { error } = loginValidation(req.body);

  if(error) {
    const detail = error.details[0] || {};
    const errorType = detail.path || []

    return res.status(400).send({
      error: loginErrorList[errorType[0]],
      message: detail.message
    })
  }

  const user = await User.findOne({ email: req.body.email });

  if ( !user ) {
    return res.status(400).send({
      message: 'Email or password is wrong'
    })
  }

  const validPass = await brcrypt.compare(req.body.password, user.password);

  if ( !validPass ) {
    return res.status(400).send({
      message: 'Email or password is wrong'
    })
  }

  res.send({
    user: user.email
  });

});

module.exports = router;