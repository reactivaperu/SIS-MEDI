/*
-- File:             bloqueDB.js
-- Project Name:     MediSeda
-- Version:          0.0.1
-- Description:      Consumir API de Servidor NODE JS EXPRESS y Exportar funciones de Bloques Urbanos.
-- Author:           Jorge Muñiz
-- Create Date:      2020-01-01
-- @Copyright        Jorge.Muñiz.Velasquez - World Connect Perú - 2020
*/

//import servidor from '../ServerDatos.js'; // Obtener IP de SERVIDOR NODE JS
import { urlServidor } from './funcionesSistema.js';
const servidor = urlServidor;

// Lista los BLOQUES URBANOS POR PAGINADO
export function promesaListarBloquesPaginado(objJson) {
    return new Promise( (resolver, rechazar) => {
        fetch(servidor + '/api/bloque/paginado/', {
            method : 'POST',
            body: JSON.stringify(objJson),
            headers: new Headers({ 
                'Accept': 'application/json',
                'Content-type':'application/json'
            })
        })
        .then( respuesta  => resolver(respuesta.json()))
        .catch(error => rechazar(error));
    });
} 

// Trae todos los bloques
export function promesaListarBloquesRegistrados() {
   return new Promise( (resolver, rechazar) => {
       fetch(servidor + '/api/bloque/')
           .then( respuesta  => respuesta.json() )
           .then( datos => { resolver(datos); })
       .catch((error) => {
           rechazar(error);
       });
   });
}

// Trae todos los bloques
export function promesaListarBloquesPorZona(Busqueda) {
    return new Promise( (resolver, rechazar) => {
        fetch(servidor + '/api/bloque/zona', {
            method : 'POST',
            body: JSON.stringify(Busqueda),
            headers: new Headers({ 'Accept': 'application/json','Content-type':'application/json' })
        })
        .then( respuesta  => resolver(respuesta.json()))
        .catch(error => rechazar(error));
    });
 }

// Deshabilita un BLOQUE
export function promesaDeshabilitarBloque( objJson ) {
   return new Promise( (resolver, rechazar) => {
       fetch(servidor + '/api/bloque/', {
           method : 'DELETE',
           body: JSON.stringify(objJson),
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

// Habilitar un BLOQUE
export function promesaHabilitarBloque( objJSon ) {
   return new Promise( (resolver, rechazar) => {
       fetch(servidor + '/api/bloque/habilitar', {
           method : 'PUT',
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

// Agregar un Bloque Urbano
export function promesaAgregarBloqueUrbano( objJSon ) {
   return new Promise( (resolver, rechazar) => {
       fetch(servidor + '/api/bloque/', {
           method : 'POST',
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

// Modificar los datos (denominacion) de un BLOQUE URBANO
export function promesaModificarNombreBloque( objJSon ) {
   return new Promise( (resolver, rechazar) => {
       fetch(servidor + '/api/bloque/denominacion', {
           method : 'PUT',
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

// Modificar los datos (ZONA) de un BLOQUE URBANO
export function promesaModificarZonaBloque( objJSon ) {
   return new Promise( (resolver, rechazar) => {
       fetch(servidor + '/api/bloque/zona', {
           method : 'PUT',
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