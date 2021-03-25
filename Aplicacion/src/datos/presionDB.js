/*
-- File:             presionDB.js
-- Project Name:     MediSeda
-- Version:          0.0.1
-- Description:      Consumir API de Server NODE JS EXPRESS y Exportar funciones de Actividades de Presion.
-- Author:           Jorge Muñiz
-- Create Date:      2020-01-01
-- @Copyright        Jorge.Muñiz.Velasquez - World Connect Perú - 2020
*/

//import server from '../ServerDatos.js'; // Obtener IP de SERVIDOR NODE JS
import { urlServidor } from './funcionesSistema.js';
const Url = urlServidor + '/api/presion/';

// BUSCAR ACTIVIDADES POR ZONA USUARIO Y FECHA
export function buscarActividadPresion(codigoPresion){ 
    return new Promise((resolver,rechazar) => {
        fetch(Url + codigoPresion)
        .then(actividad => resolver(actividad.json()) ) // Enviar Respuesta
        .catch(error => rechazar(error) ); // Enviar Error
    });
}

// REGISTAR DATOS DE LECTURA DE PRESION
export function registrarMedicionPresion(presion){
    return new Promise((resolver,rechazar)=>{
        fetch(Url,{ // Fetch para consumir API de SERVER NODE JS
            method:'POST',
            body: JSON.stringify(presion),
            headers: new Headers({ 'Content-type':'application/json' })
        })
        .then(respuesta => resolver(respuesta.json()) ) // Enviar Respuesta
        .catch(error => rechazar(error) ); // Enviar Error
    });
}

// MODIFICAR DATOS DE LECTURA DE PRESION
export function modificarLecturasPresion(presion){
    return new Promise((resolver,rechazar)=>{
        fetch(Url,{ // Fetch para consumir API de SERVER NODE JS
            method:'PUT',
            body: JSON.stringify(presion),
            headers: new Headers({ 'Content-type':'application/json' })
        })
        .then(respuesta => resolver(respuesta.json()) ) // Enviar Respuesta
        .catch(error => rechazar(error) ); // Enviar Error
    });
}