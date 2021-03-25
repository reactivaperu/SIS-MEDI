/*
-- File:             appWebDB.js
-- Project Name:     MediSeda
-- Version:          0.0.1
-- Description:      Consumir API de Servidor NODE JS EXPRESS y Verificar Datos de Aplicación
-- Author:           Jorge Muñiz
-- Create Date:      2020-01-01
-- @Copyright        Jorge.Muñiz.Velasquez - World Connect Perú - 2020
*/

//import servidor from '../ServerDatos.js'; // Obtener IP de SERVIDOR NODE JS
import { urlServidor } from './funcionesSistema.js';
const Url = urlServidor + '/version/';


// VERIFICAR CONECCION A SERVIDOR EXPRESS DE NODE JS
export function conectarServidor(){ 
    return new Promise((resolver,rechazar) =>{
        fetch(Url) // Fetch para consumir API de SERVER NODE JS
        .then(estado => resolver(estado.json())) // Enviar estado
        .catch(error => resolver({ error : error.message })); // Enviar Error
    });
}

// VERIFICAR CONECCION A BASE DE DATOS
export function conectarBaseDatos(){ 
    return new Promise((resolver,rechazar) =>{
        fetch(Url + "repositorio/") // Fetch para consumir API de SERVER NODE JS
        .then(estado => resolver(estado.json())) // Enviar estado
        .catch(error => resolver({ error : error.message })); // Enviar Error
    });
}

//  VERIFICAR CONECCION A SERVIDOR EXPRESS DE NODE JS Y BASE DE DATOS
export function conectar(){ 
    return new Promise((resolver,rechazar) =>{
        fetch(Url + "datos/") // Fetch para consumir API de SERVER NODE JS
        .then(estado => resolver(estado.json())) // Enviar estado
        .catch(error => resolver({ error : error.message })); // Enviar Error
    });
}


