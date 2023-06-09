// app.js - Service Provider (SP)

const express = require('express');
const session = require('express-session');
const Keycloak = require('keycloak-connect');
const dotenv = require('dotenv');

// Cargar variables de entorno desde el archivo .env
dotenv.config();

const app = express();

// Configurar Keycloak
const keycloak = new Keycloak({
  store: new session.MemoryStore(),
}, {
  clientId: process.env.KEYCLOAK_CLIENT_ID,
  bearerOnly: true,
  serverUrl: process.env.KEYCLOAK_SERVER_URL,
  realm: process.env.KEYCLOAK_REALM,
});

// Configurar middleware para proteger las rutas con Keycloak
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));
app.use(keycloak.middleware());

// Ruta protegida que requiere autenticación
app.get('/protected', keycloak.protect(), (req, res) => {
  res.send('Acceso autorizado');
});

// Iniciar el servidor
app.listen(3000, () => {
  console.log('El SP está escuchando en el puerto 3000');
});
