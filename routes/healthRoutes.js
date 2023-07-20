const express = require('express');
const userController = require('./../controllers/userController')
const authController = require('./../controllers/authController');
const healthController = require('./../controllers/healthController');


const router = express.Router();

router.post('/bookAppointment',  healthController.bookAppointment)
//router.post('/updateAppointment/:id',  healthController.updateAppointment);


 router.get('/allAppointments',authController.isDoctor, healthController.getallAppointments)
// router.get('/deleteAppointment/:id',  healthController.deleteAppointment);

// Geospatial Queries: Finding Hospitals Within Radius

// router.route('/health-within/:distance/center/:latlng/unit/:unit')
// .get(healthController.gethospitalWithin)

// router.route('/distances/:latlng/unit/:unit')
// .get(healthController.getDistances)




module.exports= router;