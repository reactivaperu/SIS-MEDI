export const datosServidor = () => {
    const datos = {
        protocolo : "http",
        //ip : "192.168.1.170",
        ip : "operaciones.sedacusco.com",
        puertoServidor : "5000",
        puertoAplicacion : "3000"
    }
    return datos;
}

export const obtenerDenominacionGrupoUsuario = (grupoUsuario) => {
    if(grupoUsuario.toString() === "0"){ return "Operador";}
    if(grupoUsuario.toString() === "1"){ return "Administrador";}
    if(grupoUsuario.toString() === "2"){ return "Gerente";}
    return "Sin grupo";
}

export const numeroArabigoEnRomano = (numero) => {
    var dummyArray = [
        "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", 
        "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "IXX", "XX",
        "XXI", "XXII", "XXIII", "XXIV", "XXV", "XXVI", "XXVII", "XXVIII", "XXIX", "XXX"
        ]; 
    return dummyArray[numero];
}

export const obtenerFecha = (fechaTexto, dias) => {
    var fecha = new Date();
    if(fechaTexto){ fecha = new Date(fechaTexto) }  
    if(dias){ fecha.setDate(fecha.getDate() + dias) }
    
    var añoDate = fecha.getFullYear();
    var mesDate = fecha.getMonth() + 1;
    var diaDate = fecha.getDate();

    var fechaRespuesta = añoDate + "-";

    if(mesDate < 10){ fechaRespuesta = fechaRespuesta + "0" + mesDate; }
    else { fechaRespuesta = fechaRespuesta + mesDate }
    fechaRespuesta = fechaRespuesta + "-";
    if(diaDate < 10){ fechaRespuesta = fechaRespuesta + "0" + diaDate; }
    else { fechaRespuesta = fechaRespuesta + diaDate; }

    return fechaRespuesta;
}

export const convertirNumeroAHora = (numeroHora, formato) => {
    var horas=0,minutos=0,segundos=0;
    var horaConvertida = "";
    switch (formato) {
        case "hh:mm:ss":
            horas = Math.floor(numeroHora);
            minutos =  Math.floor((numeroHora - horas) * 60);
            segundos = Math.round((((numeroHora - horas) * 60) - minutos) * 60);
            if(horas < 10) { horas = "0" + horas}
            if(minutos < 10) { minutos = "0" + minutos}
            if(segundos < 10) { segundos = "0" + segundos}
            horaConvertida = horas + ":" + minutos + ":" + segundos;
        break;
        case "hh:mm":
            horas = Math.floor(numeroHora);
            minutos =  Math.round((numeroHora - horas) * 60) ;
            if(horas < 10) { horas = "0" + horas}
            if(minutos < 10) { minutos = "0" + minutos}
            horaConvertida = horas + ":" + minutos;
        break;
        default: break;
    }
    return horaConvertida;
}

export const obtenerDenominacionTipoAltitud = (codigoTipoAltitud) => {
    //if(codigoTipoAltitud === 0){ return "Sin Especificar" }
    if(codigoTipoAltitud === 1){ return "Baja" }
    if(codigoTipoAltitud === 2){ return "Media" }
    if(codigoTipoAltitud === 3){ return "Alta" }
    return "SNES"; // SIN ESPECIFICAR
}

export const obtenerCodigoTipoAltitud = (altitudDenominacion) => {
    //if(altitudDenominacion === "Sin Especificar"){ return 0; }
    if(altitudDenominacion === "Baja"){ return 1 }
    if(altitudDenominacion === "Media"){ return 2 }
    if(altitudDenominacion === "Alta"){ return 3 }
    return 0;
}

export const exportarArchivoTexto = (contenido, nombreArchivo) => {
    const texto = new Blob([contenido], {type: 'text/plain'});
    const archivo = document.createElement("a");
    archivo.href = URL.createObjectURL(texto);
    archivo.download = nombreArchivo;
    document.body.appendChild(archivo);
    archivo.click();
}

export const verificarEstadoActividad = (estadoActividadContinuidad, estadoActividadPresion,fechaFinalActividad) => {
    
    var retrasoActividad = verificarFechaEntrega(fechaFinalActividad);
    var estadoActividad={mensaje:"Sin programar",cuadro:"",colorAvance:"black",colorFecha:"black"};

    if(estadoActividadContinuidad === 2 && estadoActividadPresion === 2){
        estadoActividad = {mensaje:"Finalizado",cuadro:"exito",colorAvance:"green",colorFecha:"green"};
    }
    if(estadoActividadContinuidad === 2 && estadoActividadPresion === 1){
        estadoActividad = {mensaje:"Incompleto",cuadro:"advertencia",colorAvance:"orange",colorFecha:"orange"};
    }
    if(estadoActividadContinuidad === 1 && estadoActividadPresion === 2){
        estadoActividad = {mensaje:"Incompleto",cuadro:"advertencia",colorAvance:"orange",colorFecha:"orange"};
    }
    if(estadoActividadContinuidad === 1 && estadoActividadPresion === 1){
        estadoActividad = {mensaje:"Inscrito",cuadro:"informacion",colorAvance:"#004085",colorFecha:"#004085"};
    }
    if(retrasoActividad && estadoActividadContinuidad === 1 && estadoActividadPresion === 1){
        estadoActividad = {mensaje:"Retraso",cuadro:"peligro",colorAvance:"red",colorFecha:"red"};
    }
    if(retrasoActividad && estadoActividadContinuidad === 2 && estadoActividadPresion === 1){
        estadoActividad = {mensaje:"Incompleto",cuadro:"peligro",colorAvance:"orange",colorFecha:"red"};
    }
    if(retrasoActividad && estadoActividadContinuidad === 1 && estadoActividadPresion === 2){
        estadoActividad = {mensaje:"Incompleto",cuadro:"peligro",colorAvance:"orange",colorFecha:"red"};
    }
    return estadoActividad;
}

export const listaMesesAgno = [
    { numero:1,letra:"01",nombre:"Enero"},
    { numero:2,letra:"02",nombre:"Febrero"},
    { numero:3,letra:"03",nombre:"Marzo"},
    { numero:4,letra:"04",nombre:"Abril"},
    { numero:5,letra:"05",nombre:"Mayo"},
    { numero:6,letra:"06",nombre:"Junio"},
    { numero:7,letra:"07",nombre:"Julio"},
    { numero:8,letra:"08",nombre:"Agosto"},
    { numero:9,letra:"09",nombre:"Setiembre"},
    { numero:10,letra:"10",nombre:"Octubre"},
    { numero:11,letra:"11",nombre:"Noviembre"},
    { numero:12,letra:"12",nombre:"Diciembre"}
];

export const listaAgnos = ["2019","2020","2021","2022","2023","2024","2025"];

export const modulos = [
    { codigo: 1, url:'/app', titulo: 'MEDI - SEDA', grupo: 0 },
    { codigo: 2, url:'/app/ingresar', titulo: 'Iniciar Sesión', grupo: 0 }, 
    { codigo: 3, url:'/app/salir', titulo: 'Cerrar Sesión', grupo: 0 }, 
    { codigo: 4, url:'/app/usuario', titulo: 'Usuarios del Sistema', grupo: 1 },
    { codigo: 5, url:'/app/perfil', titulo: 'Perfil de Usuario', grupo: 1 },                
    { codigo: 6, url:'/app/cambiocontra', titulo: 'Cambio de Contraseña', grupo: 0 },
    { codigo: 7, url:'/app/zona', titulo: 'Zonas Comerciales', grupo: 1 },
    { codigo: 8, url:'/app/bloque', titulo: 'Bloques Urbanos', grupo: 1 },
    { codigo: 9, url:'/app/direccion', titulo: 'Direcciones Activas Registradas', grupo: 1 },
    { codigo: 11, url:'/app/conexion', titulo: 'Conexiones Activas', grupo: 1 },
    { codigo: 12, url:'/app/conexion/prodagua', titulo: 'Conexiones Por Zona (Pro. Agua)', grupo: 1 },
    { codigo: 13, url:'/app/fuente/conexion', titulo: 'Menu de Fuentes/Conexiones', grupo: 1 },
    { codigo: 14, url:'/app/actividad/administrador', titulo: 'Actividades de Presión y Continuidad', grupo: 1 },
    { codigo: 15, url:'/app/actividad/operario', titulo: 'Actividad de Operario', grupo: 0 },
    { codigo: 16, url:'/app/aguafuente', titulo: 'Fuentes de Agua', grupo: 1 },
    { codigo: 17, url:'/app/zonafuente', titulo: 'Fuentes de Agua y Zonas Comerciales', grupo: 1 },
    { codigo: 18, url:'/app/reporte', titulo: 'Reporte de Actividad de Presión y Continuidad', grupo: 1 },
];

export const resoluciones = [
    { nombre: "8K", ancho: 7680, altura: 4320 },
    { nombre: "UHD", ancho: 3840, altura: 2160 },
    { nombre: "QHD", ancho: 2560, altura: 1440 },
    { nombre: "Full HD", ancho: 1920, altura: 1080 },
    { nombre: "HD+", ancho: 1366, altura: 768 },
    { nombre: "HD", ancho: 1280, altura: 720 },
];

export const resolucionActual = () => {
    //window.screen.width - document.documentElement.offsetWidth
    //window.screen.height - document.documentElement.offsetHeight
    //return document.documentElement.offsetWidth +"x"+document.documentElement.offsetHeight;
    return window.screen.width +"x"+window.screen.height;
}

export const dispositivoMovil = () => {
    if(window.screen.width < 640){ return true }
    return false;
}

export const verificarFechaEntrega = (fecha) => {
    var fechaHoy = new Date(obtenerFecha());
    var fechaEntrega = new Date();
    var vencido = false
    if(fecha){ fechaEntrega = new Date(fecha) }  

    if(fechaEntrega < fechaHoy){vencido = true}

    return vencido;
}

export const exportarArchivoPdf = (html, orientacion, nombreArchivo) => {
    exportarHtmlAPdf(html, orientacion, nombreArchivo).then(respuesta => {            
        const pdf = new Blob([respuesta], { type: 'application/pdf'});
        const archivo = document.createElement("a");
        archivo.href = URL.createObjectURL(pdf);
        archivo.download = nombreArchivo;
        document.body.appendChild(archivo);
        archivo.click();
    });
}

function exportarHtmlAPdf( html, orientacion, nombreArchivo ){
    const documento = { html , orientacion , nombreArchivo }
    return new Promise((resolver,rechazar)=>{
        fetch(urlServidor+'/reporte/pdf/' ,{ // Fetch para consumir API de SERVER NODE JS
            method:'POST',
            body: JSON.stringify(documento),
            headers: new Headers({ 'Content-type':'application/json' })
        })
        .then(respuesta => { resolver(respuesta.blob()) }) // Enviar Respuesta
        .catch(error => { rechazar(error) }); // Enviar Error
    });
}

export const urlServidor = datosServidor().protocolo+'://'+datosServidor().ip+':'+datosServidor().puertoServidor;
export const urlAplicacion = datosServidor().protocolo+'://'+datosServidor().ip+':'+datosServidor().puertoAplicacion;


//export const urlServidor = urlServidorConfiguracion;
//export const urlAplicacion = urlAplicacionConfiguracion;

/*
-----      MONITORES     -------
ancho: 320 , altura: 240  pixeles (4:3): monitores de 1 y 2″.
ancho: 360 , altura: 640  pixeles (4:3): monitores de 2 y 3″.
ancho: 375 , altura: 812  pixeles (4:3): monitores de 3 y 4″.
ancho: 384 , altura: 640  pixeles (4:3): monitores de 4 y 5″.
ancho: 414 , altura: 736  pixeles (4:3): monitores de 5 y 6″.
ancho: 512 , altura: 384  pixeles (4:3): monitores de 6 y 7″.
ancho: 600 , altura: 1024  pixeles (4:3): monitores de 7 y 8″.
ancho: 640 , altura: 360  pixeles (4:3): monitores de 8 y 9″.
ancho: 768 , altura: 1024  pixeles (4:3): monitores de 9 y 10″.
ancho: 800 , altura: 1280  pixeles (4:3): monitores de 10 y 11″.
ancho: 1024 , altura: 768  pixeles (4:3): monitores de 14 y 15″.
ancho: 1024 , altura: 1366  pixeles (4:3): monitores de 14 y 16″.
ancho: 1280 , altura: 1024 pixeles (4:3): monitores de 17 y 19″.
ancho: 1440 , altura: 900  pixeles (4:3): monitores de 16 y 20″.
ancho: 1600 , altura: 1200 pixeles (4:3): monitores de  19 y 21″.
ancho: 1280 , altura: 800  pixeles (16:10): monitores de 17 y 19″.
ancho: 1680 , altura: 1050 pixeles (16:10): monitores de 19 y 21″.
ancho: 1920 , altura: 1200 pixeles (16:10): monitores de 22, 24, 26″
ancho: 2560 , altura: 1600 pixeles (16:10): monitores por encima de 26″.
ancho: 1280 , altura: 720  pixeles (16:9): monitores de 17 y 19″. Conocido como resolución HD.
ancho: 1368 , altura: 768  pixeles (16:9): monitores de 17 y 19″.
ancho: 1600 , altura: 900  pixeles (16:9): monitores de 19 y 22″.
ancho: 1920 , altura: 1080 pixeles (16:9): monitores de 24, 25, 27, 32″. Conocido como resolución Full HD.
ancho: 2560 , altura: 1440 pixeles (16:9): monitores de 24, 27, 32″.
ancho: 3840 , altura: 2160 pixeles (16:9): monitores de 27, 32″ y en adelante.  Conocido como resolución 4K.
ancho: 5120 , altura: 2880 pixeles (16:9): monitores por encima de 40″. Conocida como resolución 5K.
ancho: 7680 , altura: 4320 pixeles (16:9): monitores por encima de 50″. Conocida como resolución 8K.
ancho: 2560 , altura: 1080 pixeles (21:9): monitores de 25, 27 y 29″.
ancho: 3440 , altura: 1440 pixeles (21:9): monitores de 34″ en adelante.
ancho: 5120 , altura: 2160 pixeles (21:9): monitores de 32″ en adelante.
*/