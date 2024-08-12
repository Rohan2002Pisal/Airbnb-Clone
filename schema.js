 const Joi = require('joi');

 module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title : Joi.string().required(),
        Description : Joi.string().required(),
        image : Joi.object({
            url: Joi.string().optional(),
            filename: Joi.string().optional()
        }).optional(),
        Price : Joi.number().required().min(0),
        Location : Joi.string().required(),
        Country : Joi.string().required(),
    }).required()
 });
 

 module.exports.reviewSchema = Joi.object({
     review : Joi.object({
        rating : Joi.number().required().min(1).max(5),
        comment :Joi.string().required(),
     }).required()
 })