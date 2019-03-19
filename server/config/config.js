// ============================
//  Puerto
// ============================

process.env.PORT = process.env.PORT || 3000;

// ============================
//  Entorno
// ============================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ============================
//  Base de datos
// ============================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = process.env.MONGO_URL;
}
process.env.URLDB = urlDB;

// ============================
//  Vencimiento del token
// ============================

process.env.CADUCIDAD_TOKEN = 864000;

// ============================
//  SEED de autenticacion
// ============================

process.env.SEED = process.env.SEED || 'secreto';

// ============================
//  Google Client ID
// ============================

process.env.CLIENT_ID = process.env.CLIENT_ID || '746725093564-stmt994cmg8lvg0g06mr7pmt98l8k2sc.apps.googleusercontent.com';