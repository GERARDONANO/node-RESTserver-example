
// =================
// Puerto
// ==================

process.env.PORT = process.env.PORT || 3000;

// =================
// Entorno
// ==================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev' 

// =================
// Base de datos
// ==================

let urlDB;

if(process.env.NODE_ENV === 'dev' ){
    urlDB = 'mongodb://localhost:27017/coffe';
}else{
    urlDB = 'mongodb+srv://gerardonano:JIFeFjDMq11QSaV9@cluster0.wf2gu.mongodb.net/coffe';
}


// usarla en nuestro server.js
// inventamos un environment

process.env.URLDB = urlDB;
