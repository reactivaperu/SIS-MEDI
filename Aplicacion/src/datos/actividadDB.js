/*
-- File:             actividadDB.js
-- Project Name:     MediSeda
-- Version:          0.0.1
-- Description:      Consumir API de Servidor NODE JS EXPRESS y Exportar funciones de Actividades.
-- Author:           Jorge Muñiz
-- Create Date:      2020-01-01
-- @Copyright        Jorge.Muñiz.Velasquez - World Connect Perú - 2020
*/

//import servidor from '../ServerDatos.js'; // Obtener IP de SERVIDOR NODE JS
import { urlServidor } from './funcionesSistema.js';
const Url = urlServidor + '/api/actividad/';

// BUSCAR ACTIVIDADES POR DIRECCION Y PERIODO
export function promesaBuscarActividad(Busqueda){ 
    return new Promise((resolver,rechazar) => {
        fetch(Url + "buscar/",{ // Fetch para consumir API de SERVER NODE JS
            method:'POST',
            body: JSON.stringify(Busqueda),
            headers: new Headers({ 'Content-type':'application/json' })
        })
        .then(respuesta => resolver(respuesta.json()))
        .catch(error => rechazar(error));
    });
}

// BUSCAR ACTIVIDADES POR ZONA USUARIO Y FECHA
export function promesaListarActividadPaginado(Busqueda){ 
    return new Promise((resolver,rechazar) => {
        fetch(Url + "paginado/",{ // Fetch para consumir API de SERVER NODE JS
            method:'POST',
            body: JSON.stringify(Busqueda),
            headers: new Headers({ 'Content-type':'application/json' })
        })
        .then(respuesta => resolver(respuesta.json()))
        .catch(error => rechazar(error));
    });
}

// BUSCAR ACTIVIDADES POR ZONA USUARIO Y FECHA
export function promesaListarActividadImpresion(Busqueda){ 
    return new Promise((resolver,rechazar) => {
        fetch(Url + "impresion/",{ // Fetch para consumir API de SERVER NODE JS
            method:'POST',
            body: JSON.stringify(Busqueda),
            headers: new Headers({ 'Content-type':'application/json' })
        })
        .then(respuesta => resolver(respuesta.json()))
        .catch(error => rechazar(error));
    });
}

// BUSCAR ACTIVIDADES POR ZONA USUARIO Y FECHA
export function promesaListarActividadBloque(Busqueda){ 
    return new Promise((resolver,rechazar) => {
        fetch(Url + "bloque/",{ // Fetch para consumir API de SERVER NODE JS
            method:'POST',
            body: JSON.stringify(Busqueda),
            headers: new Headers({ 'Content-type':'application/json' })
        })
        .then(respuesta => resolver(respuesta.json()))
        .catch(error => rechazar(error));
    });
}

// LISTAR ACTIVIDADES DISPONIBLES POR USUARIO
export function promesaListarActividadPorUsuario(Busqueda){ 
    return new Promise((resolver,rechazar) => {
        fetch(Url + "usuario",{ // Fetch para consumir API de SERVER NODE JS
            method:'POST',
            body: JSON.stringify(Busqueda),
            headers: new Headers({ 'Accept': 'application/json', 'Content-type':'application/json'})
        })
        .then(actividades => resolver(actividades.json()) ) // Enviar Respuesta
        .catch(error => rechazar(error) ); // Enviar Error
    });
}

// GENERAR Y ASIGNAR UN USUARIO A UN BLOQUE DE ACTIVIDADES
export function generarBloqueActividad(Bloque){ 
    return new Promise((resolver,rechazar) => {
        fetch(Url + "generar/bloque",{ // Fetch para consumir API de SERVER NODE JS
            method:'PUT',
            body: JSON.stringify(Bloque),
            headers: new Headers({ 'Content-type':'application/json' })
        })
        .then(respuesta => resolver(respuesta.json()))
        .catch(error => rechazar(error));
    });
}

// AGREGAR NUEVA ACTIVIDAD
export function agregarActividad(ActividadNuevo){
    return new Promise((resolver,rechazar) => {
        fetch(Url,{ // Fetch para consumir API de SERVER NODE JS
            method:'POST',
            body: JSON.stringify(ActividadNuevo),
            headers: new Headers({ 'Content-type':'application/json' })
        })
        .then(response => resolver(response) ) // Enviar Respuesta
        .catch(error => rechazar(error) ); // Enviar Error
    });
}

//MODIFICAR ACTIVIDAD
export function modificarActividad(Actividad){ 
    return new Promise((resolver,rechazar) => {
        fetch(Url,{ // Fetch para consumir API de SERVER NODE JS
            method:'PUT',
            body: JSON.stringify(Actividad),
            headers: new Headers({ 'Content-type':'application/json' })
        })
        .then(response => resolver(response.json()) )// Enviar Respuesta
        .catch(error => rechazar(error) );// Enviar Error
    });
}

//MODIFICAR ESTADO HABILITADO DE ACTIVIDAD 
export function cambiarHabilitadoActividad(Actividad){ 
    return new Promise((resolver,rechazar) => {
        fetch(Url + "habilitado/",{ // Fetch para consumir API de SERVER NODE JS
            method:'PUT',
            body: JSON.stringify(Actividad),
            headers: new Headers({ 'Content-type':'application/json' })
        })
        .then(response => resolver(response.json()) )// Enviar Respuesta
        .catch(error =>  rechazar(error) ); // Enviar Error
    });
}