const Joi = require("joi");

const addschemasubscription = Joi.object({
    price: Joi.number().required(),
    duration: Joi.string().valid('30', '90', '120').required(),
    name: Joi.string().required(),
    minutes : Joi.number().required()
  });
  
  
 const addsubscription = (req, res, next) => {
    const { error } = addschemasubscription.validate(req.body);
  
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
  
    next();
  };

  
module.exports = {
 
    addsubscription
};
