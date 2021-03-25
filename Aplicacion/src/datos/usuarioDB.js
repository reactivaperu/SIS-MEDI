/*
-- File:             usuarioDB.js
-- Project Name:     MediSeda
-- Version:          0.0.1
-- Description:      Consumir API de Server NODE JS EXPRESS y Exportar funciones de Usuario.
-- Author:           Jorge Muñiz
-- Create Date:      2020-01-01
-- @Copyright        Jorge.Muñiz.Velasquez - World Connect Perú - 2020           
*/

//import server from '../ServerDatos.js'; // Obtener IP de SERVIDOR NODE JS
import jwt_decode from 'jwt-decode'; // Libreria para decodificar JsonWebToken
import { urlServidor } from './funcionesSistema.js';
const Url = urlServidor + '/api/usuario/';


// LISTAR USUARIOS DISPONIBLES
export function promesaListarUsuariosPaginado(Busqueda){ 
    return new Promise((resolver,rechazar)=>{
        fetch(Url + "paginado",{ // Fetch para consumir API de SERVER NODE JS
            method:'POST',
            body: JSON.stringify(Busqueda),
            headers: new Headers({ 'Content-type':'application/json' })
        })
        .then(response => resolver(response.json()))
        .catch(error => rechazar(error)); // Enviar Error
    });
}

// LISTAR USUARIOS DISPONIBLES
export function usuariosDisponibles(){ 
    return new Promise((resolver,rechazar) =>{
        fetch(Url+"disponibles") // Fetch para consumir API de SERVER NODE JS
        .then((usuarios) => usuarios.json())
        .then((usuariosJson) => {
            resolver(usuariosJson); // Enviar Usuarios
        })
        .catch((error)=>{
            rechazar(error); // Enviar Error
        });
    });
}

// AGREGAR NUEVO USUARIO
export function agregarNuevoUsuario(UsuarioNuevo){
    return new Promise((resolver,rechazar)=>{
        fetch(Url,{ // Fetch para consumir API de SERVER NODE JS
            method:'POST',
            body: JSON.stringify(UsuarioNuevo),
            headers: new Headers({
                'Content-type':'application/json'
            })
        })
        .then((response) => response.json())
        .then((responseJson) => {
            resolver(responseJson); // Enviar Respuesta
        })
        .catch((error)=>{
            rechazar(error); // Enviar Error
        });
    });
}

// DESHABILITAR USUARIO
export function deshabilitarCuentaUsuario(CuentaUsuario){
    return new Promise((resolver,rechazar)=>{
        fetch(Url,{ // Fetch para consumir API de SERVER NODE JS
            method:'DELETE',
            body: JSON.stringify(CuentaUsuario),
            headers: new Headers({
                'Content-type':'application/json'
            })
        })
        .then((response) => response.json())
        .then((responseJson) => {
            resolver(responseJson); // Enviar Respuesta
        })
        .catch((error)=>{
            rechazar(error); // Enviar Error
        });
    });
}

//MODIFICAR CONTRASEÑA DE USUARIO
export function modificarContrasegnaCuenta(UsuarioCuenta){ 
    const urlFetch = Url + "contrasegna/";
    return new Promise((resolver,rechazar)=>{
        fetch(urlFetch,{ // Fetch para consumir API de SERVER NODE JS
            method:'PUT',
            body: JSON.stringify(UsuarioCuenta),
            headers: new Headers({
                'Content-type':'application/json'
            })
        })
        .then(response => resolver(response.json()))//Enviar respuesta
        .catch(error => rechazar(error)); // Enviar Error
    });
}

//MODIFICAR DATOS DE CUENTA USUARIO
export function modificarDatosCuenta(UsuarioCuenta){ 
    const urlFetch = Url + "datos/";
    return new Promise((resolver,rechazar)=>{
        fetch(urlFetch,{ // Fetch para consumir API de SERVER NODE JS
            method:'PUT',
            body: JSON.stringify(UsuarioCuenta),
            headers: new Headers({
                'Content-type':'application/json'
            })
        })
        .then((response) => response.json())
        .then((responseJson) => {
            resolver(responseJson); // Enviar Respuesta
        })
        .catch((error)=>{
            rechazar(error); // Enviar Error
        });
    });
}

//MODIFICAR CUENTA DE USUARIO
export function modificarUsuarioCuenta(UsuarioCuenta){ 
    const urlFetch = Url;
    return new Promise((resolver,rechazar)=>{
        fetch(urlFetch,{ // Fetch para consumir API de SERVER NODE JS
            method:'PUT',
            body: JSON.stringify(UsuarioCuenta),
            headers: new Headers({
                'Content-type':'application/json'
            })
        })
        .then((response) => response.json())
        .then((responseJson) => {
            resolver(responseJson); // Enviar Respuesta
        })
        .catch((error)=>{
            rechazar(error); // Enviar Error
        });
    });
}

//MODIFICAR ESTADO HABILITADO DE USUARIO
export function promesaModificarHabilitadoUsuario(Parametros){ 
    return new Promise((resolver,rechazar)=>{
        fetch(Url + "habilitar/",{ // Fetch para consumir API de SERVER NODE JS
            method:'PUT',
            body: JSON.stringify(Parametros),
            headers: new Headers({'Content-type':'application/json' })
        })
        .then(response => resolver(response.json()))
        .catch(error=> rechazar(error));// Enviar Error
    });
}

/* VERIFICAR GRUPO DE USUARIO

==    Operario --> 1        |   Administrador --> 0
- Cambio de Contraseña      | - Cambio de Contraseña
- Ingresar/Salir            | - Ingresar/Salir
- Listar Tareas Pendientes  | - Listar Presiones
- Registrar Continuidad     | - Listar Continuidades
- Registrar Presión         | - CRUD Usuario
-                           | - CRUD Dirección
-                           | - CRUD Tareas
*/
export function verificarGrupoUsuario() {
    const token = localStorage.getItem('tokenUsuario');
    if(token !== "" && token !== null && token !== "undefined" && token !== undefined){
        const decode = jwt_decode(token);
        var res = {
            codigoUsuario : decode.codigoUsuario,
            cuentaUsuario : decode.cuentaUsuario,
            nombres : decode.nombres,
            apellidosPaterno : decode.apellidosPaterno,
            apellidosMaterno : decode.apellidosMaterno,
            grupo : decode.grupo,
            firmaDigital : decode.firmaDigital,
            firmaSesion : decode.firmaSesion
        }
        return res;
    }else{
        return false
    }
}
