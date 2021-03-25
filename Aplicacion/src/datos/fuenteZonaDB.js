/*
-- File:             fuenteZonaDB.js
-- Project Name:     MediSeda
-- Version:          0.0.1
-- Description:      Consumir API de Servidor NODE JS EXPRESS y Exportar funciones de Fuentes Zona.
-- Author:           Jorge Muñiz
-- Create Date:      2020-01-02
-- @Copyright        Jorge.Muñiz.Velasquez - World Connect Perú - 2020          
*/

//import servidor from '../ServerDatos.js'; // Obtener IP de SERVIDOR NODE JS
import { urlServidor } from './funcionesSistema.js';
const servidor = urlServidor;

// Lista las Relaciones de Zona Fuentes de Agua para Paginado
export function promesaListarFuenteZonaPaginado(objJson) {
    return new Promise( (resolver, rechazar) => {
        fetch(servidor + '/api/fuentezona/paginado/', {
            method : 'POST',
            body: JSON.stringify(objJson),
            headers: new Headers({ 
                'Accept': 'application/json',
                'Content-type':'application/json'
            })
        })
        .then( respuesta  => resolver(respuesta.json()))
        .catch( error => rechazar(error));
    });
} 

// Registra una RELACIÓN entre una fuente de Agua y una ZONA COMERCIAL 
export function promesaRelacionarFuenteAguaConZona( objJSon ) {
   return new Promise( (resolver, rechazar) => {
       fetch(servidor + '/api/fuentezona/', {
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

// Cambiar Fuente de Agua a Relacionde Fuente Zona
export function promesaCambiarFuenteAguaDeRelacion( objJson ) {
    return new Promise( (resolver, rechazar) => {
        fetch(servidor + '/api/fuentezona/', {
            method : 'PUT',
            body: JSON.stringify(objJson),
            headers: new Headers({ 
                'Accept': 'application/json',
                'Content-type':'application/json'
            })
        })
        .then( respuesta => resolver(respuesta.json()) )
        .catch( error => rechazar(error) );
    });
}

// Habilita una RELACIÓN entre una fuente de Agua y una ZONA COMERCIAL previamente deshabilitada
export function promesaEliminarRelacionFuenteAguaZona( objJSon ) {
   return new Promise( (resolver, rechazar) => {
       fetch(servidor + '/api/fuentezona/', {
           method : 'DELETE',
           body: JSON.stringify(objJSon),
           headers: new Headers({
               'Accept': 'application/json',
               'Content-type':'application/json'
           })
       })
       .then( respuesta => respuesta )
       .then( datos => { resolver(datos); })
       .catch((error)=>{ rechazar(error); });
   });
}