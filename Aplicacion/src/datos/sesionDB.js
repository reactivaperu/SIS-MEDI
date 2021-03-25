/*
-- File:             sesionDB.js
-- Project Name:     MediSeda
-- Version:          0.0.1
-- Description:      Consumir API de Server NODE JS EXPRESS y Exportar funciones de Inicio de Sesion.
-- Author:           Jorge Muñiz
-- Create Date:      2020-01-01
-- @Copyright        Jorge.Muñiz.Velasquez - World Connect Perú - 2020     
*/

//import server from '../ServerDatos.js'; // Obtener IP de SERVIDOR NODE JS
import { urlServidor } from './funcionesSistema.js';
const Url = urlServidor + '/api/sesion/';

// VERIFICAR CREDENCIALES DE USUARIO PARA EL INGRESO
export function promesaVerificarIngreso(Credenciales){
    return new Promise((resolver,rechazar)=>{
        fetch(Url + "ingresar",{ // Fetch para consumir API de SERVER NODE JS
            method:'POST',
            body: JSON.stringify(Credenciales),
            headers: new Headers({ 'Content-type':'application/json' })
        })
        .then(respuesta => resolver(respuesta.json()))// Enviar Respuesta
        .catch(error => rechazar(error));// Enviar Error
    });
}

// MODIFICAR HORA DE SALIDA DE INICIO DE SESION POR MEDIO DE FIRMA DE USUARIO Y FIRMA DE SESION
export function promesaModificarFechaSalidaSesion(Firmas){
    return new Promise((resolver,rechazar)=>{
        fetch(Url + "salir",{ // Fetch para consumir API de SERVER NODE JS
            method:'PUT',
            body: JSON.stringify(Firmas),
            headers: new Headers({ 'Content-type':'application/json' })
        })
        .then(respuesta => resolver(respuesta.json()))// Enviar Respuesta
        .catch(error => rechazar(error)); // Enviar Error
    });
}
