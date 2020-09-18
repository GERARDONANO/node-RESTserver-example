const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const app = express();
const Usuario = require('../models/usuario');


app.get('/usuario', function ( req, res ) {

    // parametro opcional = /usuario?from=x
    let from = Number( req.query.from ) || 0;

    let limit = Number( req.query.limit ) || 5;
    

    Usuario.find({ estado : true },'nombre email role estado google img')
           .skip( from )
           .limit( limit )
           .exec( ( err, usuarios ) => {

            if( err ){
                return res.status( 400 ).json({
                    ok : false,
                    err
                });             
            }

            Usuario.countDocuments({ estado : true }, ( err, contador ) => {

                res.json({
                    ok : true,
                    totalUsuarios: contador,
                    mostrando : usuarios.length,
                    usuarios
                });

            });



           });

  });
  
  
app.post('/usuario', function ( req, res ) {

     const body = req.body;


    let usuario = new Usuario({
        nombre : body.nombre,
        email : body.email,
        password : bcrypt.hashSync( body.password , 10 ),
        role : body.role
    });
 
    
     usuario.save( ( err, usuarioDB ) => {

        if( err ) 
        {
          return res.status( 400 ).json({
                ok : false,
                err
            });
        }

        res.json({
            ok : true,
            usuario: usuarioDB
        });

    }); 

    


});

  
app.put('/usuario/:id', function ( req, res ) {

    let id = req.params.id;
    // restricción para solo actualizar los campos que se mencionan en el array
    let body = _.pick( req.body, ['nombre','email','img','role','estado'] ) ;

    const options = {
        new : true,
        runValidators : true
    }



     Usuario.findByIdAndUpdate( id, body , options, ( err, usuarioDB ) => {

        if( err ) 
        {
          return res.status( 400 ).json({
                ok : false,
                err
            });
        }



        res.json({
            ok : true,
            usuario : usuarioDB
        });

    }); 

});


// borrar fisicamente un usuario
/* app.delete('/usuario/:id', function ( req, res ) {
   
    const id = req.params.id;


    Usuario.findByIdAndRemove( id, ( err, userDeleted ) => {

        if( err ){
            return res.status( 400 ).json({
                ok : false,
                err
            });
        }

        if( !userDeleted ){

            return res.status( 400 ).json({
                ok : false,
                err : {
                    message : 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok : true,
            borrado : userDeleted
        });


    });

}); */

// desactivar usuario cambiando flag de estado
app.delete('/usuario/:id', function ( req, res ) {

    const id = req.params.id;
    const options = {
        new : true
    }
    const nuevoEstado = {
        estado : false
    }

    Usuario.findByIdAndUpdate( id , nuevoEstado , options , ( err, userDisabled ) => {

        if( err ){
            return res.status( 400 ).json({
                ok : false,
                err
            });
        }


        res.json({
            ok : true,
            deshabilitado : userDisabled 
        });

    });

});


module.exports = app;