/*
-- File:             conexionProdAguaDB.js
-- Project Name:     MediSeda
-- Version:          0.0.1
-- Description:      Consumir API de Servidor NODE JS EXPRESS y Exportar funciones de Conexiones De Produccion de agua.
-- Author:           Jorge Muñiz
-- Create Date:      2020-01-01
-- @Copyright        Jorge.Muñiz.Velasquez - World Connect Perú - 2020
*/

//import servidor from '../ServerDatos.js'; // Obtener IP de SERVIDOR NODE JS
import { urlServidor } from './funcionesSistema.js';
const servidor = urlServidor;

// Lista el Total de Conexiones de Producción de Agua por Zona y Altitud
export function promesaListarTotalConexionesPorZonaAltitud( objJSon ) { 
    return new Promise((resolver, rechazar) =>{
        fetch(servidor + '/api/conexionprod/total/zonaaltitud/', {
            method : 'POST',
            body: JSON.stringify(objJSon),
            headers: new Headers({'Accept': 'application/json','Content-type':'application/json' })
        }) 
        .then( respuesta  => resolver(respuesta.json()) )/* Enviar Fuentes de Agua */
        .catch(error => rechazar(error)) // Enviar Error
    });
}

// Registra un Total de Conexiones de Producción de Agua 
export function promesaRegistrarTotalConexionesProdAgua( objJSon ) {
    return new Promise( (resolver, rechazar) => {
        fetch(servidor + '/api/conexionprod/', {
            method : 'POST',
            body: JSON.stringify(objJSon),
            headers: new Headers({
                'Accept': 'application/json',
                'Content-type':'application/json'
            })
        })
        .then( respuesta => resolver(respuesta.json()) )
        .catch( error => rechazar(error) );
    });
}

// Modificar Datos de Total de Conexiones De Producción de Agua
export function promesaModificarTotalConexionesProdAgua( objJson ) {
    return new Promise( (resolver, rechazar) => {
        fetch(servidor + '/api/conexionprod/', {
            method : 'PUT',
            body: JSON.stringify(objJson),
            headers: new Headers({ 
                'Accept': 'application/json',
                'Content-type':'application/json'
            })
        })
        .then( respuesta => resolver(respuesta.json()) )
        .catch((error)=>{ rechazar(error); });
    });
}