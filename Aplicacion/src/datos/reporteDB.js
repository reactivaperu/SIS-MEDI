
/*
-- File:             reporteDB.js
-- Project Name:     MediSeda
-- Version:          0.0.1
-- Description:      Consumir API de Server NODE JS EXPRESS y Exportar funciones de Reporte.
-- Author:           Jorge Muñiz
-- Create Date:      2019-10-02
-- @Copyright        Jorge.Muñiz.Velasquez - World Connect Perú - 2019           
*/

//import servidor from '../ServerDatos.js'; // Obtener IP de SERVIDOR NODE JS

import { urlServidor } from './funcionesSistema.js';
var Url = urlServidor + '/reporte/';

// DATOS DE ENCUENTA DE CONTINUIDAD PARA REPORTE
export function reporteEncuestaContinuidad(busqueda){
    return new Promise((resolver,rechazar)=>{
        fetch(Url + "continuidad",{ // Fetch para consumir API de SERVER NODE JS
            method:'POST',
            body: JSON.stringify(busqueda),
            headers: new Headers({ 'Content-type':'application/json' })
        })
        .then(respuesta => { resolver(respuesta.json()) }) // Enviar Respuesta
        .catch(error => { rechazar(error) }); // Enviar Error
    });
}

// DATOS DE ENCUENTA DE PRESIONES PARA REPORTE
export function reporteEncuestaPresion(busqueda){
    return new Promise((resolver,rechazar)=>{
        fetch(Url + "presion",{ // Fetch para consumir API de SERVER NODE JS
            method:'POST',
            body: JSON.stringify(busqueda),
            headers: new Headers({ 'Content-type':'application/json' })
        })
        .then(respuesta => { resolver(respuesta.json()) }) // Enviar Respuesta
        .catch(error => { rechazar(error) }); // Enviar Error
    });
}

// DATOS DE ENCUENTA DE PRESIONES PARA REPORTE
export function reporteComercial(busqueda){
    return new Promise((resolver,rechazar)=>{
        fetch(Url + "comercial",{ // Fetch para consumir API de SERVER NODE JS
            method:'POST',
            body: JSON.stringify(busqueda),
            headers: new Headers({ 'Content-type':'application/json' })
        })
        .then(respuesta => { resolver(respuesta.json()) }) // Enviar Respuesta
        .catch(error => { rechazar(error) }); // Enviar Error
    });
}
