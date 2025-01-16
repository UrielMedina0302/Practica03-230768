const express =require('express');
const session =require('express-session');
const moment = require('moment-timezone');//Common JS

const app= express();


//Configuracón de la sesión 
app.use(session({
    secret: 'P3-UAMT#Sung_jin-Woo-sesionespersistentes', //Secreto para afirmar la cookie de sesión
    resave: false, // No resguardar la sesión si o ha sido modificada
    saveUninitialized: true, //Guarda la sesión aunque no haya sido inicializada
    cookie: {secure: false, maxAge: 24 * 60 * 60 * 1000} //Usar secure: ture si solo usas HTTPS, con maxAge permite definir la duracion máxima de la sesión
}));

// Middleware para mostrar detalles de la sesión
app.use((req, res, next)=> {
    if(req.session) {
        if(!req.session.createdAt){
        req.session.createdAt = new Date(); //Asignamos la fecha de creación de la sesión
        }
        req.session.lastAcces = new Date(); //Asignamos la ültima vez que se accedio a la sesion
    }
        next();
});

// Ruta parta mostrar la información de la sesion
app.get('/session/:name', (req, res)=>{
    if(req.session) {
        const SessionId = req.session.id;
        const createdAt =req.session.createdAt;
        const lastAcces = req.session.lastAcces;
        const sessionDuration = (new Date() - createdAt) / 1000; // Duración de la sesión en segundos
        const name1=req.params.name;
        
        res.send(`
        <h1>Detalles de la sesión</h1>
        <p><strong>Id de la sesión:</strong> ${SessionId}</p>
        <p><strong>Fecha de creación de la sesión:</strong> ${createdAt}</p>
        <p><strong>Ultimo acceso:</strong> ${lastAcces}</p>
        <p><strong>Duración de la sesión (en segundos):</strong> ${sessionDuration}</p>
        <p><strong>Nombre de quien inicio sesion:</strong> ${name1}</p>
        `);
    }
})

//Ruta para cerrar la sesion
app.get('/logout',(req,res)=>{
    res.session.destroy((err)=>{
        if(err){
            return res.send('Error al cerrar sesion.');
        }
        res.send('<h1>Sesión cerrada exitosamente.</h1>');
    });
});

//Iniciar el servidor en el puerto 3000
app.listen(3000,()=>{
    console.log('Servidor corriendo en el puerto 3000');
});