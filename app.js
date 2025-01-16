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
/*app.use((req, res, next)=> {
    if(req.session) {
        if(!req.session.createdAt){
        req.session.createdAt = new Date(); //Asignamos la fecha de creación de la sesión
        }
        req.session.lastAcces = new Date(); //Asignamos la ültima vez que se accedio a la sesion
    }
        next();
});*/
//Ruta para inicializar la sesión
app.get('/login/:name', (req,res)=>{
    const nm=req.params.name
    if(!req.session.createdAt){
        req.session.name=nm;
        req.session.createdAt =new Date();
        req.session.lastAcces =new Date();
        
        res.send(`La sesión ha sido iniciada. Bienvenido ${nm}`);
        }else{
        res.send('Ya existe una sesión');   
        }
});

//Ruta para actualizar la fecha de la última consulta
app.get('/update', (req,res)=>{
if(req.session.createdAt){
    req.session.lastAcces=new Date();
    res.send('La fecha del último acceso ha sido actualizada');
}else{
    res.send('No hay sesión activa');
}
});

//Ruta para obtener estado de la sesión 
app.get('/status',(req,res)=>{
    if(req.session.createdAt){
        const now = new Date();
        const started=new Date(req.session.createdAt);
        const lastUpdate=new Date(req.session.lastAcces);
        const name=req.session.name;
        // calcular antiguedad de la sesion
        const sessionAgeMs=now -started;
        const hours= Math.floor(sessionAgeMs/(1000*60*60));
        const minutes=Math.floor(sessionAgeMs%(1000*60*60)/(1000*60));
        const seconds=Math.floor(sessionAgeMs%(1000*60)/1000);

        //convertir las fechas al uso horario de CDMX
        const createdAT_MX=moment(started).tz('America/Mexico_City').format('YYYY-MM-DD HH:mm:ss');
        const lastAcces_MX=moment(lastUpdate).tz('America/Mexico_City').format('YYYY-MM-DD HH:mm:ss');
        res.json({
            mensaje: 'Estado de la sesión',
            SessionId:req.sessionID,
            Usuario:name,
            inicio:createdAT_MX,
            ultimoAcceso:lastAcces_MX,
            antiguedad: `${hours} horas, ${minutes} minutos y ${seconds} segundos`,
            
        });
    }else{
        res.send('No hay una sesión activa');
    }
});


// Ruta parta mostrar la información de la sesion
app.get('/session', (req, res)=>{
    if(req.session) {
        const SessionId = req.session.id;
        //const createdAt =req.session.createdAt;
        /*const lastAcces = req.session.lastAcces;
        const sessionDuration = (new Date() - createdAt) / 1000;*/ // Duración de la sesión en segundos
        const createdAt= new Date(req.session.createdAt);
        const lastAcces= new Date(req.session.lastAcces);
        const sessionDuration= ((new Date()-createdAt)/1000).toFixed(2);
        const name1=req.session.name;
        
        res.send(`
        <h1>Detalles de la sesión</h1>
        <p><strong>Id de la sesión:</strong> ${SessionId}</p>
        <p><strong>Fecha de creación de la sesión:</strong> ${createdAt}</p>
        <p><strong>Ultimo acceso:</strong> ${lastAcces}</p>
        <p><strong>Duración de la sesión (en segundos):</strong> ${sessionDuration}</p>
        <p><strong>Nombre de quien inicio sesion:</strong> ${name1}</p>
        `);
    }
});
//Ruta para cerrar la sesion
app.get('/logout', (req,res)=>{
    if (req.session.createdAt){
        req.session.destroy((err)=>{
        if(err){
            return res.status(500).send('Error al cerrar sesion.');
        }
        res.send('<h1>Sesión cerrada exitosamente.</h1>');
        })
    }else{
        res.send('No hay una sesión activa parta cerrar');
    }
});

//Iniciar el servidor en el puerto 3000
app.listen(3000,()=>{
    console.log('Servidor corriendo en el puerto 3000');
});