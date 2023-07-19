const express = require('express');
const userController = require('./../controllers/userController')
const authController = require('./../controllers/authController');
const healthController = require('./../controllers/healthController');


const router = express.Router();

router.post('/bookAppointment',  healthController.bookAppointment)
router.post('/updateAppointment/:id',  healthController.updateAppointment);


// router.get('/allAppointments',healthController.getAppointments)
// router.get('/deleteAppointment/:id',  healthController.deleteAppointment);


module.exports= router;