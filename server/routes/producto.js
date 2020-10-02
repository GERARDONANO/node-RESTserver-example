const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');
const _ = require('underscore');

const app = express();
let Producto = require('../models/producto');
const { isBoolean } = require('underscore');



// get productos
app.get('/producto', verificaToken, ( req, res ) => {

    const from = Number( req.query.from ) || 0;
    const limit = Number( req.query.limit ) || 0;

    const populado = [
        { path : 'usuario',
          select : 'nombre, email'
        },
        {
         path : 'categoria',
         select: 'descripcion'
        }
    ]

    Producto.find({ disponible : true })
            .populate( populado )
            .skip( from )
            .limit( limit )
            .exec( ( err, productos ) => {

                if ( err ){
                    return res.status( 500 ).json({
                        ok : false,
                        err
                    });
                }

                res.json({
                    ok : true,
                    productos
                });

            });
});

// get producto
app.get('/producto/:id', verificaToken, ( req, res ) => {

    const id = req.params.id;

    const condition = { _id : id }

    const populado = [
        { path : 'usuario',
          select : 'nombre, email'
        },
        {
         path : 'categoria',
         select: 'descripcion'
        }
    ]

    Producto.findOne( condition )
    .populate( populado )
    .exec( ( err, producto ) => {

        if( err ){
            return res.status( 500 ).json({
                ok : false,
                err
            });
        }

        if( !producto ){
            return res.status( 500 ).json({
                ok : false,
                err
            });
        }


        res.json({
            ok : true,
            producto
        });

    }); 


});


// buscar un producto en base de datos
app.get('/producto/buscar/:termino', verificaToken, ( req, res ) => {


    const termino = req.params.termino;

    const regex = new RegExp( termino, 'i' );

    const populado = [
        { path : 'usuario',
          select : 'nombre, email'
        },
        {
         path : 'categoria',
         select: 'descripcion'
        }
    ]

    Producto.find({ descripcion : regex, nombre : regex })
            .populate( populado )
            .exec( ( err, productos ) => {

                if( err ){
                    return res.status( 500 ).json({
                        ok : false,
                        err
                    });
                }
        
                res.json({
                    ok : true,
                    productos
                });
        

            });


})


// crear producto
app.post('/producto', verificaToken, ( req, res ) => {

    const body = req.body;

    const producto = new Producto({
        nombre : body.nombre,
        precioUni : body.precioUni,
        descripcion : body.descripcion,
        usuario : req.usuario._id,
        categoria : body.categoria,
        estado : body.estado
    });

    producto.save( ( err, productDB ) => {

        if( err ){
            return res.status( 500 ).json({
                ok : false,
                err
            });
        }

        res.json({
            ok : true,
            producto : productDB
        });

    });
});


// actualizar producto
app.put('/producto/:id', verificaToken, ( req, res ) => {

    const id = req.params.id;

    const options = {
        new : true,
        runValidators : true
    }

    const body = _.pick( req.body, ['nombre','precioUni','descripcion','categoria','disponible'] );
    
    
    // disponible solo debe ser un booleano
   if( ! _.isUndefined( body.disponible ) ){
       if( ! _.isBoolean( body.categoria ) ){
    
           return res.status( 400 ).json({
               ok : false,
               message : 'incompatibilidad de datos'
           });
       }
   }



    const populado = [
        { path : 'usuario',
          select : 'nombre, email'
        },
        {
         path : 'categoria',
         select: 'descripcion'
        }
    ]


    Producto.findByIdAndUpdate( id, body, options, async ( err, productoUpdated ) => {

        if( err ){
            return res.status( 500 ).json({
                ok : false,
                err
            });
        }

        if( !productoUpdated ){
            return res.status( 400 ).json({
                ok : false,
                err : {
                    message : 'id no encontrado'
                }
            });
        }

        await productoUpdated.populate( populado )
        .execPopulate();

        res.json({
            ok : true,
            producto : productoUpdated
        });

    });


});


// borrar producto ( NO FISICAMENTE )
app.delete('/producto/:id', verificaToken, ( req, res ) => {

    const id = req.params.id;

    const nuevoEstado = {
        disponible : false
    }

    const options = {
        new : true,
        runValidators : true
    }

    Producto.findByIdAndUpdate( id, nuevoEstado, options, ( err, productoUpdated ) => {

        if( err ){
            return res.status( 500 ).json({
                ok : false,
                err
            });
        }

        if( ! productoUpdated ){
            return res.status( 400 ).json({
                ok : false,
                message : 'id no encontrado'
            });
        }

        res.json({
            ok : true,
            productoUpdated
        });

    });


});











module.exports = app;

