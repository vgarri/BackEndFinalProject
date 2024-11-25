const User = require('../models/user.model'); // Importar el modelo de la BBDD
const { validationResult } = require("express-validator");


// GET http://localhost:3000/users --> ALL
// GET http://localhost:3000/users?email=hola@gmail.com --> query por email
const getAllUsers = async (req, res) => {
    let users;
    users = await User.getAllUsers();

    res.status(200).json(users); // 
}
const getUsersByEmail = async (req, res) => {
    const { email } = req.query;
    try {
        const userData = await User.getUsersByEmail(email);
        if (userData) {
            res.status(200).json(userData);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error obtaining user by email:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Crear usuario //Post

const createUser = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }
        const newUser = req.body; // {username,email,password, img}
        const response = await User.createUser(newUser); 
        res.status(201).json({
            "items_created": response,
            message: `User created: ${req.body.email}`,
            data: newUser
        })
    } catch (error) {
        console.error('Error updating User:', error)
        res.status(500).json({ error: 'Internal server error' })
        next(error)

    }
}

// const createUser = async (req, res) => {
//     const newUser = req.body; // {username,email,password, img}
//     const response = await User.createUser(newUser);
//     res.status(201).json({
//         "items_created": response,
//         message: `User created: ${req.body.email}`,
//         data: newUser
//     });
// }


// Actualizar Autor por email
const updateUserByEmail = async (req, res) => {
    const { email } = req.query; // {name, surname, image, email, currentEmail}
    const updatedUserData = req.body; // current email como criterio de búsqueda de autor
    try {
        const response = await User.updateUserByEmail(email);
        if (response) {
            res.status(200).json({
                message: `User updated: ${email}`,
                data: updatedUserData
            });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error updating User:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const deleteUserByEmail = async (req, res) => {
    const { email } = req.query; // {email} le pasaremos el email por el body
    try {
        const response = await User.deleteUserByEmail(email);
        if (response) {
            res.status(200).json({
                message: `User: ${email} was deleted successfully`,
                data: response
            });
        } else {
            res.status(404).json({ error: 'User with that email was not found' });
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
const getAllFavoritesFromUser = async (req, res) => {
    const id = req.params.id;
    console.log(id)
    try {
        const userData = await User.getAllFavoritesFromUser(id);
        if (userData) {
            res.status(200).json(userData);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error obtaining favorites by email:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
const markAsFavorite = async (req, res) => {
    //mongo_id y mongo_title van a venir de un fetch, user_id viene del login(?)
    const newFavorite = req.body; // {user_id,mongo_title,mongo_id}
    const response = await User.markAsFavorite(newFavorite);
    res.status(201).json({
        "items_created": response,
        message: `New Favorite created for user: ${req.body.user_id}`,
        data: newFavorite
    });
}
const unmarkAsFavorite = async (req, res) => {
    const favorite_id = req.params.favorite_id; // {email} le pasaremos el email por el body
    try {
        const response = await User.unmarkAsFavorite(favorite_id);
        if (response) {
            res.status(200).json({
                message: `favorite was deleted successfully`,
                data: response
            });
        } else {
            res.status(404).json({ error: 'favorite was not found' });
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getAllUsers,
    getUsersByEmail,
    createUser,
    updateUserByEmail,
    deleteUserByEmail,
    getAllFavoritesFromUser,
    markAsFavorite,
    unmarkAsFavorite

}