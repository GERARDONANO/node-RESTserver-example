const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');

const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');


// middleware para que todo lo que se suba caiga en req.files
app.use( fileUpload({ useTempFiles : true }) );


app.put('/upload/:tipo/:id', ( req, res ) => {

    const tipo = req.params.tipo;
    const id = req.params.id;

    if ( !req.files || Object.keys( req.files ).length === 0 ) {
      return res.status( 400 ).json({
          ok : false,
          err : {
              message : 'No se ha seleccionado ningún archivo'
          }
      });
    }


    // validar tipo
    // se hace referencia a las carpetas usuarios y productos para aprovecharse mejor.
    const tiposValidos = ['productos','usuarios'];

    if( tiposValidos.indexOf( tipo ) < 0 ){

        return res.status( 400 ).json({
            ok : false,
            err: {
                message : 'Los tipos permitidas son: '+ tiposValidos.join(', '),
                tipo 
            }
        });
    }

    const archivo = req.files.archivo;
    const nombreCortado = archivo.name.split('.');
    const extension = nombreCortado[nombreCortado.length -1];
  
    // Extensiones permitidas
    const extensionesValidas = ['png','jpg','gif','jpeg'];

    // extensión no encontrada en el arreglo
    if( extensionesValidas.indexOf( extension ) < 0 ){
        return res.status( 400 ).json({
            ok : false,
            err: {
                message : 'Las extensiones permitidas son: '+ extensionesValidas.join(', '),
                ext : extension
            }
        });
    }

    // cambiar nombre al archivo
    const nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`;

    const pathGuardar = `uploads/${ tipo }/${ nombreArchivo }`;
    
    // mover el archivo
    archivo.mv( pathGuardar, async ( err ) => {

        if ( err ){
            return res.status( 500 ).json({
                ok : false,
                err
            });
        }

        // imagen cargada

        switch( tipo ){
            case 'productos' :
                imagenProducto( id, res, nombreArchivo );
            break;

            case 'usuarios' : 
                imagenUsuario( id, res, nombreArchivo );
            break;
        }


      });



      function imagenUsuario( id, res, nombreArchivo ){


        Usuario.findById( id, ( err , usuarioDB ) => {

            if( err ){
                borraArchivo( nombreArchivo, tipo );
                return res.status( 500 ).json({
                    ok : false,
                    err
                });
            }

            if( !usuarioDB ){
                if( err ){
                    borraArchivo( nombreArchivo, tipo );

                    return res.status( 400 ).json({
                        ok : false,
                        err : {
                            message : 'Usuario no existe'
                        }
                    });
                }
            }

            borraArchivo( usuarioDB.img, tipo );

            usuarioDB.img = nombreArchivo;

            usuarioDB.save( ( err, usuarioGuardado ) => {

                res.json({ 
                    ok : true,
                    usuarioActualizado : usuarioGuardado,
                    img: nombreArchivo
                });
            })

        });
 
      }

      function imagenProducto( id, res, nombreArchivo ){

        Producto.findById( id, ( err , productoDB ) => {

            if( err ){
                borraArchivo( nombreArchivo, tipo );
                return res.status( 500 ).json({
                    ok : false,
                    err
                });
            }

            if( !productoDB ){
                if( err ){
                    borraArchivo( nombreArchivo, tipo );

                    return res.status( 400 ).json({
                        ok : false,
                        err : {
                            message : 'Producto no existe'
                        }
                    });
                }
            }

            borraArchivo( productoDB.img, tipo );

            productoDB.img = nombreArchivo;

            productoDB.save( ( err, productoGuardado ) => {

                res.json({ 
                    ok : true,
                    usuarioActualizado : productoGuardado,
                    img: nombreArchivo
                });
            })

        });
        

      }

      function borraArchivo( nombreImagen , tipo ){

        pathImagen = path.resolve( __dirname, `../../uploads/${ tipo }/${ nombreImagen }`);
        // comprobar si ya existe o no una imagen con el usuario en este directorio
        if( fs.existsSync( pathImagen ) ){
            fs.unlinkSync( pathImagen );
        }
        
      }

});


module.exports = app;