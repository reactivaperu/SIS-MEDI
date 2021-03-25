/*
-- File:             continuidadDB.js
-- Project Name:     MediSeda
-- Version:          0.0.1
-- Description:      Consumir API de Servidor NODE JS EXPRESS y Exportar funciones de Actividades de continuidad.
-- Author:           Jorge Muñiz
-- Create Date:      2019-10-02
-- @Copyright        Jorge.Muñiz.Velasquez - World Connect Perú - 2019           
*/

//import servidor from '../ServerDatos.js'; // Obtener IP de SERVIDOR NODE JS
import { urlServidor } from './funcionesSistema.js';
const Url =  urlServidor + '/api/continuidad/';

// BUSCAR ACTIVIDADES POR ZONA USUARIO Y FECHA
export function buscarActividadContinuidad(codigoContinuidad){ 
    return new Promise((resolver,rechazar) => {
        fetch(Url + codigoContinuidad)
        .then(actividad => resolver(actividad.json()) ) // Enviar Respuesta
        .catch(error => rechazar(error) ); // Enviar Error
    });
}

// REGISTAR DATOS DE LECTURA DE CONTINUIDAD
export function registrarMedicionContinuidad(continuidad){
    return new Promise((resolver,rechazar) => {
        fetch(Url,{ // Fetch para consumir API de SERVER NODE JS
            method:'POST',
            body: JSON.stringify(continuidad),
            headers: new Headers({ 'Content-type':'application/json' })
        })
        .then(respuesta => resolver(respuesta.json()) ) // Enviar Respuesta
        .catch(error => rechazar(error) ); // Enviar Error
    });
}

// MODIFICAR DATOS DE LECTURA DE CONTINUIDAD
export function modificarHorasContinuidad(continuidad){
    return new Promise((resolver,rechazar) => {
        fetch(Url,{ // Fetch para consumir API de SERVER NODE JS
            method:'PUT',
            body: JSON.stringify(continuidad),
            headers: new Headers({ 'Content-type':'application/json' })
        })
        .then(respuesta => resolver(respuesta.json()) ) // Enviar Respuesta
        .catch(error => rechazar(error) ); // Enviar Error
    });
}

// CALCULAR EL PROMEDIO DE CONTINUIDAD POR ZONA Y ALTITUD
export function totalHoraZonaAltitudContinuidad(busqueda){
    return new Promise((resolver,rechazar)=>{
        fetch(Url + "/promediohora",{ // Fetch para consumir API de SERVER NODE JS
            method:'POST',
            body: JSON.stringify(busqueda),
            headers: new Headers({ 'Content-type':'application/json' })
        })
        .then(respuesta => { resolver(respuesta.json()) }) // Enviar Respuesta
        .catch(error => { rechazar(error) }); // Enviar Error
    });
}