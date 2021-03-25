/*
-- File:             conexionDB.js
-- Project Name:     MediSeda
-- Version:          0.0.1
-- Description:      Consumir API de Servidor NODE JS EXPRESS y Exportar funciones de Conexiones Activas.
-- Author:           Jorge Muñiz
-- Create Date:      2020-01-01
-- @Copyright        Jorge.Muñiz.Velasquez - World Connect Perú - 2020
*/

//import servidor from '../ServerDatos.js'; // Obtener IP de SERVIDOR NODE JS
import { urlServidor } from './funcionesSistema.js';
const servidor = urlServidor;

// Lista el Total de conexiones por Zona y Agno
export function promesaListarTotalConexionesPorZona( objJSon ) { 
    return new Promise((resolver, rechazar) =>{
        fetch(servidor + '/api/conexion/total/zonaperiodo/', {
            method : 'POST',
            body: JSON.stringify(objJSon),
            headers: new Headers({'Accept': 'application/json','Content-type':'application/json' })
        }) 
        .then( respuesta  => resolver(respuesta.json()) )/* Enviar Fuentes de Agua */
        .catch(error => rechazar(error)) // Enviar Error
    });
}

// Lista todas las conexiones de un periodo
export function promesaListarTotalConexiones( objJSon ) { 
    return new Promise((resolver, rechazar) =>{
        fetch(servidor + '/api/conexion/listar/', {
            method : 'POST',
            body: JSON.stringify(objJSon),
            headers: new Headers({'Accept': 'application/json','Content-type':'application/json' })
        }) 
        .then( respuesta  => resolver(respuesta.json()) )/* Enviar Fuentes de Agua */
        .catch(error => rechazar(error)) // Enviar Error
    });
}

// Lista todas las conexiones de un periodo
export function promesaImportarTotalConexiones( Importar ) { 
    return new Promise((resolver, rechazar) =>{
        fetch(servidor + '/api/conexion/importar/', {
            method : 'POST',
            body: JSON.stringify(Importar),
            headers: new Headers({'Accept': 'application/json','Content-type':'application/json' })
        }) 
        .then( respuesta  => resolver(respuesta.json()) )/* Enviar Fuentes de Agua */
        .catch(error => rechazar(error)) // Enviar Error
    });
}

// Busca un registro de total de Conexiones para verificar su existencia
export function promesaVerificarExistenciaTotalConexiones(Busqueda){
    return new Promise( (resolverr, rechazar) => {
        fetch(servidor + '/api/conexion/buscar', {
            method : 'POST',
            body: JSON.stringify(Busqueda),
            headers: new Headers({
                'Accept': 'application/json',
                'Content-type':'application/json'
            })
        })
        .then(respuesta => { resolverr(respuesta.json()) }) // Enviar Respuesta
        .catch(error => { rechazar(error) }); // Enviar Error
    });
};

// Calcula el numero de conexiones Activas por Zona Altitud Mes y Agno
export function promesaTotalConexionesActivasZonaAltitud(Busqueda){
    return new Promise( (resolverr, rechazar) => {
        fetch(servidor + '/api/conexion/activas', {
            method : 'POST',
            body: JSON.stringify(Busqueda),
            headers: new Headers({
                'Accept': 'application/json',
                'Content-type':'application/json'
            })
        })
        .then(respuesta => { resolverr(respuesta.json()) }) // Enviar Respuesta
        .catch(error => { rechazar(error) }); // Enviar Error
    });
};

// Registra un total de conexiones 
export function promesaRegistrarTotalConexiones( objJSon ) {
    return new Promise( (resolver, rechazar) => {
        fetch(servidor + '/api/conexion/', {
            method : 'POST',
            body: JSON.stringify(objJSon),
            headers: new Headers({
                'Accept': 'application/json',
                'Content-type':'application/json'
            })
        })
        .then( respuesta => resolver(respuesta.json()) )
        .catch((error)=>{ rechazar(error); });
    });
}

// Modificar Datos de Total de Conexiones
export function promesaModificarTotalConexiones( objJson ) {
    return new Promise( (resolver, rechazar) => {
        fetch(servidor + '/api/conexion/', {
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