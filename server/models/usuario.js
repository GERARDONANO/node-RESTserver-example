
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let rolesValidos = {
    values : ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
}

let usuarioSchema = new Schema({
    nombre: {
        type : String,
        required : [true, 'El nombre es necesario']
    },
    email : {
        type : String,
        unique : true,
        required : [true, 'El correo es necesario']
    },
    password : {
        type : String,
        required : [true, 'La contraseña es obligatoria']
    },
    img : {
        type : String,
        required : false,
        default : 'profileDefault'
    },
    role : {
        type : String,
        default : 'USER_ROLE',
        enum: rolesValidos
    },
    estado : {
        type : Boolean,
        default : true
    },
    google: {
        type : Boolean,
        default : false
    }
});

// no mostrar la contraseña al momento de 
// enviar como json el objeto usuario
usuarioSchema.methods.toJSON = function() {

    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

usuarioSchema.plugin( uniqueValidator, {

    message : '{PATH} debe ser único'

});





module.exports = mongoose.model( 'Usuario', usuarioSchema );

