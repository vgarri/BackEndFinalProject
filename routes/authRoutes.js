//Gestionamos las rutas de autenticación y protegemos las rutas con autenticación y autorización.
const express = require('express');
const router = express.Router();
const passport = require('passport');
const authMiddleware = require('../middlewares/authMiddleware');  //extraer el token y verificar si es correcto
const authorizeRole = require('../middlewares/roleMiddleware'); //permitir acceso según los roles
// const { userDataValidateChainMethod } = require('../validation/user.validation');


// Controladores
const { login,logout, googleLogin } = require('../controllers/authController'); //funciones para registrar
const { getProfile, getFavorites } = require('../controllers/views.controller'); //funciones para usuariio solo
const { getUsersView, getDashboard } = require('../controllers/views.controller');  //funciones  para admin
const { createJobOffer } = require('../controllers/jobOffers.controller'); //funciones para admin
const userController = require('../controllers/user.controller') //funcion para crear usuario

// Rutas de autenticación

router.get('/register', (req, res) => res.render('home'));  
router.post('/register',userController.createUser);                      
router.get('/login', (req, res) => res.render('home'));         
router.post('/login', login);
router.get('/register', (req, res) => res.render('home'));                         
router.get('/logout', logout);                                  
router.get('/', (req, res) => {
    res.render('home');
});

// Rutas de autenticación con Google
router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'], prompt: 'select_account' }));
router.get('/google/callback',
passport.authenticate('google', { failureRedirect: '/auth/failure' }),
    googleLogin
);

// Rutas de usuario (requiere autenticación)
router.get('/profile', authMiddleware, getProfile);
router.get('/favorites', authMiddleware, getFavorites);

// Rutas de administrador (requiere autenticación y rol de 'admin')
router.get('/dashboard', authMiddleware, authorizeRole('admin'), getDashboard);
router.get('/users', authMiddleware, authorizeRole('admin'), getUsersView);
router.post('/job', authMiddleware, authorizeRole('admin'), createJobOffer);

// Ruta de fallo en la autenticación con Google
router.get('/auth/failure', (req, res) => {    //poner las rutas de fallos
    res.send('Something went wrong...');
});

module.exports = router;
