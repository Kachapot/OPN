const Joi = require('joi')

module.exports.regisValidate = (data)=>{
    const schema = Joi.object({
        email: Joi.string().required(),
        password : Joi.string().required(),
        name:Joi.string().required(),
        birthDate:Joi.date().allow('').required(),
        gender:Joi.string().valid('male','female').required(),
        address:Joi.string().allow('').required(),
        subscribe:Joi.bool().required()
    })
    return schema.validate(data);
}