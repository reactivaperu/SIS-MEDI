/*
-- File:             fuenteDB.js
-- Project Name:     MediSeda
-- Version:          0.0.1
-- Description:      Consumir API de Servidor NODE JS EXPRESS y Exportar funciones de Fuentes de Agua.
-- Author:           Jorge Muñiz
-- Create Date:      2020-01-01
-- @Copyright        Jorge.Muñiz.Velasquez - World Connect Perú - 2020          
*/

//import servidor from '../ServerDatos.js'; // Obtener IP de SERVIDOR NODE JS
import { urlServidor } from './funcionesSistema.js';
const servidor = urlServidor;

// Lista las fuentes de agua REGISTRADAS independientemente si están habilitadas o no
export function promesaListarFuentesAguaParaComponente() {
    return new Promise( (resolver, rechazar) => {
        fetch(servidor + '/api/fuente')
            .then( respuesta  => respuesta.json() )
            .then( datos => { resolver(datos); })
        .catch((error) => {
            rechazar(error);
        });
    });
}

// Lista los Fuentes de Agua POR PAGINADO
export function promesaListarFuentesAguaPaginado(objJson) {
    return new Promise( (resolver, rechazar) => {
        fetch(servidor + '/api/fuente/paginado/', {
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

// Lista las fuentes de agua REGISTRADAS independientemente si están habilitadas o no
export function promesaListarFuentesAgua() {
    return new Promise( (resolver, rechazar) => {
        fetch(servidor + '/api/fuente/registradas')
            .then( respuesta  => respuesta.json() )
            .then( datos => { resolver(datos); })
        .catch((error) => {
            rechazar(error);
        });
    });
}

// Lista las ZONAS REGISTRADAS para todas las FUENTES
export function promesaListarZonasPorFuentesDeAgua() {
    return new Promise( (resolver, rechazar) => {
        fetch(servidor + '/api/zona/fuentes/registradas/')
            .then( respuesta  => respuesta.json() )
            .then( datos => { resolver(datos); })
        .catch((error) => {
            rechazar(error);
        });
    });
}

// Deshabilitar el registro de una Fuente de Agua
export function promesaDeshabilitarFuenteAgua( objJson ) {
    return new Promise( (resolver, rechazar) => {
        fetch(servidor + '/api/fuente/', {
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

// Habilitar una Fuente de agua previamente deshabilitada
export function promesaHabilitarFuenteAgua( objJSon ) {
    return new Promise( (resolver, rechazar) => {
        fetch(servidor + '/api/fuente/habilitar', {
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

// Insertar una nueva Fuente de agua
export function promesaAgregarFuenteAgua( objJSon ) {
    return new Promise( (resolver, rechazar) => {
        fetch(servidor + '/api/fuente/', {
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

// Cambiar la denominacion de una Fuente de agua registrada
export function promesaModificarDenominacionFuenteAgua( objJSon ) {
    return new Promise( (resolver, rechazar) => {
        fetch(servidor + '/api/fuente/', {
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