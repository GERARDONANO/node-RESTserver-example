
require('./config/config');
const express = require('express');
const mongoose = require('mongoose');


const app = express();
 
app.use( express.urlencoded ({ extended : false }) );
app.use( express.json() );

// Configuración global de rutas
app.use( require('./routes/index') );

// base de datos
mongoose.connect( process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
    
})
.then( () => console.log('BASE DE DATOS ONLINE'))
.catch( ( e ) => console.log('no se pudo establecer una conexión con la dbo ', e ));


// servidor
app.listen( process.env.PORT , () => {
    console.log('escuchando el puerto ', process.env.PORT);
});
