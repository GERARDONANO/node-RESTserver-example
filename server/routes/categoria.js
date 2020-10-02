
const express = require('express');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
const app = express();
const Categoria = require('../models/categoria');
const _ = require('underscore');
const categoria = require('../models/categoria');



// crear 5 servicios

// get/categoria = obtener todas las categorias

app.get('/categoria', verificaToken, ( req, res ) => {

   
    Categoria.find()
             .populate('usuario','nombre email')
             .sort({'descripcion' : 'asc' })
             .exec( ( err, categorias ) => {

                if( err ){
                    return res.status( 500 ).json({
                        ok : false,
                        err
                    });
                }
        
                res.json({
                    ok : true,
                    categorias
                });
        
            });
    

});

// mostrar una categoria por ID 
// get/categoria/:id

app.get('/categoria/:id', verificaToken, ( req, res ) => {

    const id = req.params.id;

    const condition = {
        _id : id
    }

    Categoria.findOne( condition, ( err, categoriaDB ) => {

        if( err ){
            return res.status( 400 ).json({
                ok : false,
                err
            });
        }

        res.json({
            ok : true,
            categoriaDB
        });

    });



});



// post/categoria = crear una nueva categoria
// regresar la nueva categoria


app.post('/categoria', verificaToken, ( req, res ) => {

    const usuarioId = req.usuario._id;
    const descripcion = req.body.descripcion;

    const categoria = new Categoria({
        descripcion,
        usuario : usuarioId
    });

    categoria.save( ( err, categoriaDB ) => {

        if( err ){
            return res.status( 500 ).json({
                ok : false,
                err
            });
        }
        

        if( !categoriaDB ){
            return res.json({
                ok : false,
                err
            });
        }

        res.json({
            ok : true,
            categoriaDB
        });

    });

});

// put/categoria/:id = actualizar una categoria

app.put('/categoria/:id', verificaToken, ( req, res ) => {

   
    const id = req.params.id;

    const body = _.pick( req.body, ['descripcion'] ) ;
    

    const options = {
        new : true
    }

    Categoria.findByIdAndUpdate( id , body, options , ( err , categoriaUpdated ) => {

        if( err ){
            categoria

            return res.status( 400 ).json({
                ok : false,
                err
            });
        }

        if( !categoriaUpdated ){
            return res.json({
                ok : false,
                message : 'categoria no encontrada'
            });
        }

        res.json({ 
            ok : true,
            actualizado : categoriaUpdated
        });


    })

});



// deconste/categoria/:id
// solo un administrador puede borrar categorias
// borrar fisicamente el registro
app.delete('/categoria/:id', [ verificaToken, verificaAdmin_Role ], ( req, res ) => {

    const id = req.params.id;

    Categoria.findByIdAndDeconste( id , ( err, categoriaDeconsted ) => {

        if( err ){
            return res.status( 400 ).json({
                ok : false,
                err
            });
        }

        if( !categoriaDeconsted ){

            return res.json({
                ok : false,
                message : 'Categoría no encontrada'
            });
            
        }

        
        res.json({
            ok : true,
            eliminado : categoriaDeconsted
        });


    });

});








module.exports = app;