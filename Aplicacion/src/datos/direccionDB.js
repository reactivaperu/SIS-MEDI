/*
-- File:             direccionDB.js
-- Project Name:     MediSeda
-- Version:          0.0.1
-- Description:      Consumir API de Servidor NODE JS EXPRESS y Exportar funciones de Direcciones.
-- Author:           Jorge Muñiz
-- Create Date:      2020-01-01
-- @Copyright        Jorge.Muñiz.Velasquez - World Connect Perú - 2020        
*/

//import servidor from '../ServerDatos.js'; // Obtener IP de SERVIDOR NODE JS
import { urlServidor, obtenerFecha } from './funcionesSistema.js';
const servidor = urlServidor;

// trae todas las zonas registradas en la Aplicacion (SIN USO)
export function direccionesPorZona( indiceZonal ) { 
    return new Promise((resolver, rechazar) => {
        fetch(servidor + '/api/direccion/zona/' + indiceZonal) 
        .then( respuesta  => respuesta.json() )
        .then( datos => { resolver(datos); })
        .catch((error) => {
            rechazar(error);
        });
    });
}

// CAMBIAR POSICION ARRIBA O BAJO DE UNA DIRECCIÓN
export function cambiarPosicionDireccionDB( nuevaOrden ) { 
    return new Promise((resolver, rechazar) => {
        fetch(servidor + '/api/direccion/orden', {
           method : 'POST',
           body: JSON.stringify( nuevaOrden ),
           headers: new Headers({
               'Accept': 'application/json',
               'Content-type':'application/json'
           })
        })
        .then( respuesta  => respuesta.json() )
        .then( datos => { resolver(datos) })
        .catch((error) => { rechazar(error) });
    });
}

// trae todas las zonas registradas en la Aplicacion
export function promesaListarDirecciones( indiceZonal ) { 
    return new Promise((resolver, rechazar) => {
        fetch(servidor + '/api/direccion/zona/' + indiceZonal) 
        .then( respuesta  => respuesta.json() )
        .then( datos => { resolver(datos); })
        .catch((error) => {
            rechazar(error);
        });
    });
}

// trae todas las zonas registradas en la Aplicacion
export function promesaListarDireccionesPaginado( jsonConsulta ) { 
    return new Promise((resolver, rechazar) => {
        fetch(servidor + '/api/direccion/paginado/', {
           method : 'POST',
           body: JSON.stringify( jsonConsulta ),
           headers: new Headers({
               'Accept': 'application/json',
               'Content-type':'application/json'
           })
        })
        .then( respuesta  => respuesta.json() )
        .then( datos => { resolver(datos); })
        .catch((error) => { rechazar(error) }); 
    });
}

// LISTA TODAS LAS DIRECCIONES
export function promesaListarTodoDirecciones( ) {
    return new Promise((resolver, rechazar) => {
        fetch(servidor + '/api/direccion/') 
        .then( respuesta  => respuesta.json() )
        .then( datos => { resolver(datos); })
        .catch((error) => { rechazar(error) });
    });
}

// Registra un total de conexiones 
export function promesaAgregarDireccion( objJSon ) {
   return new Promise( (resolver, rechazar) => {
       fetch(servidor + '/api/direccion/', {
           method : 'POST',
           body: JSON.stringify(objJSon),
           headers: new Headers({
               'Accept': 'application/json',
               'Content-type':'application/json'
           })
       })
       .then( respuesta => respuesta )
       .then( datos => { resolver(datos); })
       .catch((error)=>{ rechazar(error); });
   });
}

// deshabilita el registro de una Fuente de Agua
export function promesaDeshabilitarDireccion( objJson ) {
    return new Promise( (resolver, rechazar) => {
        fetch(servidor + '/api/direccion/', {
            method : 'DELETE',
            body: JSON.stringify(objJson),
            headers: new Headers({ 
                'Accept': 'application/json',
                'Content-type':'application/json'
            })
        })
        .then( respuesta => respuesta )
        .then( datos => { resolver(datos); })
        .catch((error)=>{ rechazar(error); });
    });
}

// deshabilita el registro de una Fuente de Agua
export function promesaHabilitarDireccion( objJson ) {
    return new Promise( (resolver, rechazar) => {
        fetch(servidor + '/api/direccion/habilitar', {
            method : 'PUT',
            body: JSON.stringify(objJson),
            headers: new Headers({ 
                'Accept': 'application/json',
                'Content-type':'application/json'
            })
        })
        .then( respuesta => respuesta )
        .then( datos => { resolver(datos); })
        .catch((error)=>{ rechazar(error); });
    });
}

// Modificar el nombre de una Direccion/lote
export function promesaModificarNombreDireccion( objJson ) {
    return new Promise( (resolver, rechazar) => {
        fetch(servidor + '/api/direccion/', {
            method : 'PUT',
            body: JSON.stringify(objJson),
            headers: new Headers({ 
                'Accept': 'application/json',
                'Content-type':'application/json'
            })
        })
        .then( respuesta => respuesta )
        .then( datos => { resolver(datos); })
        .catch((error)=>{ rechazar(error); });
    });
}

// Modificar la ZONA de una Direccion/lote
export function promesaModificarZonaDireccion( objJson ) {
    return new Promise( (resolver, rechazar) => {
        fetch(servidor + '/api/direccion/actualizarZona', {
            method : 'PUT',
            body: JSON.stringify(objJson),
            headers: new Headers({ 
                'Accept': 'application/json',
                'Content-type':'application/json'
            })
        })
        .then( respuesta => respuesta )
        .then( datos => { resolver(datos); })
        .catch((error)=>{ rechazar(error); });
    });
}

export function promesaModificarBloqueUrbanoDireccion( objJson ) {
    return new Promise( (resolver, rechazar) => {
        fetch(servidor + '/api/direccion/actualizarBloqueUrbano', {
            method : 'PUT',
            body: JSON.stringify(objJson),
            headers: new Headers({ 
                'Accept': 'application/json',
                'Content-type':'application/json'
            })
        })
        .then( respuesta => respuesta )
        .then( datos => { resolver(datos); })
        .catch((error)=>{ rechazar(error); });
    });
}

export function promesaModificarAltitudDireccion( objJson ) {
    return new Promise( (resolver, rechazar) => {
        fetch(servidor + '/api/direccion/actualizarAltitud', {
            method : 'PUT',
            body: JSON.stringify(objJson),
            headers: new Headers({ 
                'Accept': 'application/json',
                'Content-type':'application/json'
            })
        })
        .then( respuesta => respuesta )
        .then( datos => { resolver(datos); })
        .catch((error)=>{ rechazar(error); });
    });
}

// Busca las direcciones por zona bloque urbano y area de servicio
export function promesaBuscarDireccionesActividad(Busqueda){
    return new Promise((resolver,rechazar)=>{
        fetch(servidor + "/api/direccion/buscar/",{ // Fetch para consumir API de servidor NODE JS
            method:'POST',
            body: JSON.stringify(Busqueda),
            headers: new Headers({ 'Content-type':'application/json' })
        })
        .then(respuesta => resolver(respuesta.json()))
        .catch(error => resolver({ error : error.message }));
    });
}

// SUBIR ARCHIVO MS EXCEL .CSV
export function promesaImportarArchivo(archivo){
    const fd = new FormData();
    const nombre = archivo.name.split('.')[0] + "-" + obtenerFecha() + ".csv";
    fd.append('archivo', archivo, nombre);
    return new Promise((resolver, rechazar)=>{
        fetch(servidor + '/api/direccion/importar',{
            method:'POST',
            body: fd
        })
        .then(response => resolver(response.json()))
        .catch(error => rechazar(error));
    });
}