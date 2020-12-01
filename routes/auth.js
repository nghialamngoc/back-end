const router = require('express').Router();
const User = require('../model/User');
const Constant = require('../utils/constant.js')

// Validation
const Joi = require('@hapi/joi');

const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
})

router.post('/register', async (req, res) => {

  // validator before create a user
  const { error } = schema.validate(req.body);

  if(error) {
    const detail = error.details[0] || {};
    const errorType = detail.path || []

    return res.status(400).send({
      error: Constant[errorType[0]],
      message: detail.message
    })
  }

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });
  
  try {
    const saveUser = await user.save();
    res.send(saveUser);

  } catch(err) {
    res.status(400).send(err)
  }
});

router.post('/login');

module.exports = router;