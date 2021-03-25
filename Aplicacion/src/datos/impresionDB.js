/*
-- File:             impresionDB.js
-- Project Name:     MediSeda
-- Version:          0.0.1
-- Description:      Consumir API de Servidor NODE JS EXPRESS y Exportar funciones de Bloque de Impresion.
-- Author:           Jorge Muñiz
-- Create Date:      2020-01-01
-- @Copyright        Jorge.Muñiz.Velasquez - World Connect Perú - 2020
*/

import { urlServidor } from './funcionesSistema.js';
const servidor = urlServidor + '/api/impresion';

// Lista los Bloques de Impresion por Pagina y tipo Actividad
export function promesaCantidadPagina(objJSon) {
    return new Promise((resolver, rechazar) =>{
        fetch(servidor + '/paginas', {
            method : 'POST',
            body: JSON.stringify(objJSon),
            headers: new Headers({'Accept': 'application/json','Content-type':'application/json' })
        }) 
        .then(respuesta  => resolver(respuesta.json()) )
        .catch(error => rechazar(error))
    });

/*     return new Promise((resolver, rechazar) =>{
        fetch(servidor + '/paginas') 
        .then(respuesta  => resolver(respuesta.json()) )
        .catch(error => rechazar(error))
    }); */
}

// Lista los Bloques de Impresion por Pagina y tipo Actividad
export function promesaListarBloqueImpresionPaginaActividad( objJSon ) { 
    return new Promise((resolver, rechazar) =>{
        fetch(servidor + '/lista', {
            method : 'POST',
            body: JSON.stringify(objJSon),
            headers: new Headers({'Accept': 'application/json','Content-type':'application/json' })
        }) 
        .then(respuesta  => resolver(respuesta.json()) )/* Enviar Fuentes de Agua */
        .catch(error => rechazar(error)) // Enviar Error
    });
}

// Elimina un Bloque de Impresion
export function promesaEliminarBloqueImpresion( objJson ) {
    return new Promise( (resolver, rechazar) => {
        fetch(servidor + '/eliminar', {
            method : 'DELETE',
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