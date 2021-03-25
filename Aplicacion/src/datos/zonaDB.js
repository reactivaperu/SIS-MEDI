/*
-- File:             zonaDB.js
-- Project Name:     MediSeda
-- Version:          0.0.1
-- Description:      Consumir API de Server NODE JS EXPRESS y Exportar funciones de Zonas Comerciales.
-- Author:           Jorge Muñiz
-- Create Date:      2020-01-01
-- @Copyright        Jorge.Muñiz.Velasquez - World Connect Perú - 2020           
*/

//import servidor from '../servidorDatos.js';
import { urlServidor } from './funcionesSistema.js';
const servidor = urlServidor;

// Lista las zonas para un generar un COMPONENTE (comboBox/selectBox)
export function promesaListarZonasComponente() { 
    return new Promise((resolver, rechazar) =>{
        fetch(servidor + '/api/zona/') 
            .then( respuesta  => respuesta.json() )
            .then( datos => { 
                resolver(datos);
            })
        .catch((error) => {
            rechazar(error);
        });
    });
}

export function promesaListarZonasReporte() { 
    return new Promise((resolver, rechazar) =>{
        fetch(servidor + '/api/zona/sectorReporte') 
            .then( respuesta  => respuesta.json() )
            .then( datos => { 
                resolver(datos);
            })
        .catch((error) => {
            rechazar(error);
        });
    });
}

export function promesaListarZonas( jsonConsultada ) { 
    return new Promise((resolver, rechazar) =>{
        fetch(servidor + '/api/zona/paginado/', {
           method : 'POST',
           body: JSON.stringify( jsonConsultada ),
           headers: new Headers({
               'Accept': 'application/json',
               'Content-type':'application/json'
                })
            }) 
            .then( respuesta  => respuesta.json() )
            .then( datos => { 
                resolver(datos);
            })
        .catch((error) => {
            rechazar(error);
        });
    });
}

export function promesaAgregarZona( objJson ) {
    return new Promise( (resolver, rechazar) => {
        fetch(servidor + '/api/zona/', {
            method : 'POST',
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

export function promesaDeshabilitarZona( objJson ) {
    return new Promise( (resolver, rechazar) => {
        fetch(servidor + '/api/zona/deshabilitar', {
            method : 'PUT',
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

export function promesaHabilitarZona( objJson ) {
    return new Promise( (resolver, rechazar) => {
        fetch(servidor + '/api/zona/habilitar', {
            method : 'PUT',
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

export function promesaModificarZona( objJson ) {
    return new Promise( (resolver, rechazar) => {
        fetch(servidor + '/api/zona/', {
            method : 'PUT',
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

export function promesaDeshabilitarUnaZonaComoSector( objJson ) {
    return new Promise( (resolver, rechazar) => {
        fetch(servidor + '/api/zona/sector', {
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

export function promesaHabilitarUnaZonaComoSector( objJson ) {
    return new Promise( (resolver, rechazar) => {
        fetch(servidor + '/api/zona/sector', {
            method : 'PUT',
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