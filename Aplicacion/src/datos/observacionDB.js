/*
-- File:             observacionDB.js
-- Project Name:     MediSeda
-- Version:          0.0.1
-- Description:      Consumir API de Servidor NODE JS EXPRESS y Exportar funciones de Observacion de Actividades.
-- Author:           Jorge Muñiz
-- Create Date:      2020-01-02
-- @Copyright        Jorge.Muñiz.Velasquez - World Connect Perú - 2020          
*/

//import servidor from '../ServerDatos.js'; // Obtener IP de SERVIDOR NODE JS
import { urlServidor } from './funcionesSistema.js';
const Url = urlServidor + '/api/observacion/';

// LISTAR ACTIVIDADES DISPONIBLES POR ZONA
export function buscarObservacion(codigoActividad){ 
    return new Promise((resolver,rechazar) => {
        fetch(Url + "actividad/" +codigoActividad) // Fetch para consumir API de SERVER NODE JS
        .then(actividades => resolver( actividades.json()) )// Enviar Actividades
        .catch(error => rechazar(error) ); // Enviar Error
    });
}

// REGISTAR OBERVACION DE UNA ACTIVIDAD
export function registrarObservacion(observacion){
    return new Promise((resolver,rechazar) => {
        fetch(Url,{ // Fetch para consumir API de SERVER NODE JS
            method:'POST',
            body: JSON.stringify(observacion),
            headers: new Headers({ 'Content-type':'application/json' })
        })
        .then(respuesta => resolver(respuesta.json()) ) // Enviar Respuesta
        .catch(error => rechazar(error) ); // Enviar Error
    });
}

// MODIFICAR TEXTO DE OBSERVACION
export function modificarObservacion(observacion){
    return new Promise((resolver,rechazar) => {
        fetch(Url,{ // Fetch para consumir API de SERVER NODE JS
            method:'PUT',
            body: JSON.stringify(observacion),
            headers: new Headers({ 'Content-type':'application/json' })
        })
        .then(respuesta => resolver(respuesta.json()) ) // Enviar Respuesta
        .catch(error => rechazar(error) ); // Enviar Error
    });
}