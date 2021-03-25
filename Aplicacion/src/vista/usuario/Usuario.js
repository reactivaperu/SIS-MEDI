/*
-- File:             Usuario.js
-- Project Name:     MediSeda
-- Version:          0.0.1
-- Description:      Interfaz UI para Usuario
-- Author:           Jorge Muñiz
-- Create Date:      2019-10-02
-- @Copyright        Jorge.Muñiz.Velasquez - World Connect Perú - 2019           
*/

import React, { Component } from 'react';
import { obtenerDenominacionGrupoUsuario } from '../../datos/funcionesSistema';
import { promesaModificarHabilitadoUsuario,
         promesaListarUsuariosPaginado,
         modificarUsuarioCuenta,
         modificarDatosCuenta,
         agregarNuevoUsuario,
         verificarGrupoUsuario } from '../../datos/usuarioDB.js';

//IMPORTAR COMPONENTES
import Paginacion, { CANTIDAD_PAGINA, TAMAGNO_PAGINA } from "../../componentes/Paginacion.js";
import UsuarioNoValido from '../../componentes/UsuarioNoValido.js';
import CuadroMensaje from '../../componentes/CuadroMensaje.js';
import Modal from "../../componentes/Modal.js";

const usuarioInical = { // Estado inicial de Usuario Seleccionado
    codigoUsuario : "",
    cuentaUsuario : "",
    contrasegnaUsuario : "",
    nombres : "",
    apellidosPaterno : "",
    apellidosMaterno : "",
    firmaDigital : "",
    grupo : "1", // GRUPO 1 POR DEFECTO OPERARIOS
    habilitado : "1", // HABILITADO POR DEFECTO
}

const estadoInicial = { // Estado inicial del Componente
    
    usuario : verificarGrupoUsuario(),
    usuarioSeleccion : usuarioInical, // Usuario Seleccionado Para Modificar o Deshabilitar
    
    usuarios : [], // Usuarios obtenidos de API
    sugerenciasUsuarios : [], // Sugerencia de Usuarios a Buscar
    
    mostrarModal : false, // Estado para Abrir o Cerrar el Modal
    mostrarContrasegna : false, // Estado para ver Contraseña al Hacer Reset
    
    paginaActual : 1, // Pagina Actual del Paginado
    usuarioInicioPaginado : 1, // Inicio de Paginado para Usuarios
    
    textoUsuarioBuscar : "", // Texto a Buscar
};

export class Usuario extends Component {
    constructor(props){
        super(props);
        this.state = estadoInicial;
        this.cambiarTextoUsuarioBusqueda = this.cambiarTextoUsuarioBusqueda.bind(this);
    }

    listarUsuarios = () => {
        this.setState({ usuarioInicioPaginado : (parseInt(this.state.paginaActual) - 1) * TAMAGNO_PAGINA }
        , () => {
            promesaListarUsuariosPaginado({inicio : this.state.usuarioInicioPaginado , resultados: TAMAGNO_PAGINA}).then((usuarios) => { // Consumiendo API
                if(!usuarios.error){ this.setState({ usuarios : usuarios , sugerenciasUsuarios : usuarios }) }// Cambiar estado con Resultado
            });
        });
    }

    cambiarHabilitadoUsuario = (usuario) => {
        if(usuario.codigoUsuario){
            const Parametros = { usuario:usuario.codigoUsuario,habilitado:(parseInt(usuario.habilitado)? 0 : 1),quien:this.state.usuario.firmaDigital };
            promesaModificarHabilitadoUsuario(Parametros).then(_ => this.listarUsuarios());
        }
    }

    resetearContrasegna = () => {
        const numAleatorio = (Math.random()*( 10000 - 900) + 900)|0;
        const usuarioSeleccion = this.state.usuarioSeleccion;
        usuarioSeleccion["contrasegnaUsuario"] = numAleatorio + "";
        this.setState({ usuarioSeleccion , mostrarContrasegna : !this.state.mostrarContrasegna});
    }

    guardarUsuario = (evento) => {
        evento.preventDefault();
        var usuario = this.state.usuarioSeleccion;
        usuario["quien"] = this.state.usuario.firmaDigital;

        if(usuario.codigoUsuario !== "" && usuario.codigoUsuario !== null){
            if(usuario.contrasegnaVisible !== "" && usuario.contrasegnaVisible !== null && usuario.contrasegnaVisible !== undefined){           
                modificarUsuarioCuenta(usuario).then(()=>{this.listarUsuarios();this.controlModal()})
            }else{
                modificarDatosCuenta(usuario).then(()=>{this.listarUsuarios();this.controlModal()});
            }
        }else{
            agregarNuevoUsuario(usuario).then(()=>{this.listarUsuarios();this.controlModal()});
        }
    }

    modificarUsuarioEstado = (e) => {
        const { usuarioSeleccion } = this.state;
        if(e.target.id === "habilitado"){
            usuarioSeleccion[e.target.id] = ! this.state.usuarioSeleccion.habilitado;
        }else{
            usuarioSeleccion[e.target.id] = e.target.value;
        }
        this.setState({ usuarioSeleccion });
    }

    seleccionarUsuario = (usuario) => {
        if(usuario){
            this.setState({ 
                usuarioSeleccion : usuario,
                mostrarModal : !this.state.mostrarModal 
            });
        }
    }

    controlModal = () => {
        if(this.state.mostrarModal){
            const usuarioInical={  codigoUsuario:"",cuentaUsuario:"",contrasegnaUsuario:"",nombres:"",
                apellidosPaterno:"",apellidosMaterno:"",firmaDigital:"",grupo:"1",habilitado:"1" }
            this.setState({mostrarContrasegna:false,usuarioSeleccion:usuarioInical});
        }
        this.setState({ 
            mostrarModal : !this.state.mostrarModal,
            mostrarContrasegna : false
        });
    }

    cambiarPagina = (pagina) => {        
        if(parseInt(pagina) > 0 ){ pagina = parseInt(pagina) }
        else { pagina = (parseInt(pagina.target.value) || "") }
        if(pagina <= CANTIDAD_PAGINA){ this.setState({ paginaActual: pagina }, () => this.listarUsuarios()) }
    }

    cambiarTextoUsuarioBusqueda = (evento) => {
        const textoUsuarioBuscar =  evento.target.value;
        let sugerenciasUsuarios = [];
        var paginaActual = this.state.paginaActual;
        if(textoUsuarioBuscar.length > 0){
            const regex = new RegExp(`${textoUsuarioBuscar + " "}*`, 'i');     
            sugerenciasUsuarios = this.state.usuarios.sort().filter( usuario => 
                regex.test(usuario["nombres"] + " " + usuario["apellidosPaterno"] + " " + usuario["apellidosMaterno"] + usuario["cuentaUsuario"]));
        }
        if(textoUsuarioBuscar.length === 0){
            sugerenciasUsuarios = this.state.usuarios;
        }
        paginaActual = 1;
        this.setState(()=>({ sugerenciasUsuarios , textoUsuarioBuscar , paginaActual }));
    }

    componentDidMount(){
        if(this.state.usuario.grupo > 0){
            this.setState({ usuarioInicioPaginado : (parseInt(this.state.paginaActual) - 1) * TAMAGNO_PAGINA },() => {
                this.listarUsuarios();
            });
        }//else{ this.props.history.push('/') }
    }

    render() {
        if(this.state.usuario.grupo > 0){
        return (
            <div className="contenedor">
                <div className="centrado">
                    <input className="cuadro_dato" type = "text"
                        placeholder = "Busqueda de Operarios"
                        value = { this.state.textoUsuarioBuscar }
                        onChange = { this.cambiarTextoUsuarioBusqueda }
                    ></input>
                </div><br />  
                <Paginacion
                    cantidadElementos = {this.state.sugerenciasUsuarios.length}
                    cambiarPagina = {this.cambiarPagina}
                    paginaActual = {this.state.paginaActual}
                ></Paginacion><br />
                <div className="centrado">
                <table style={{width:'60%'}}>
                    <thead>
                        <tr>                    
                            <th><img src="/img/agregarRegistro.png" alt="Registrar/Agregar un Nuevo Usuario" title="Registrar/Agregar un Nuevo Usuario" onClick={ () => this.controlModal()}/></th>
                            <th>Celular</th> 
                            <th>Nombres</th>
                            <th>Apellidos</th>
                            <th>Grupo</th>
                        </tr>
                    </thead>
                    <tbody>
                    {this.state.sugerenciasUsuarios.map(usuario =>
                        <tr key={usuario.codigoUsuario} className="tabla_fila">
                            <td style={{textAlign:'center'}}>
                                <label className="boton_habilitado">
                                    <input type="checkbox" onChange={()=>this.cambiarHabilitadoUsuario(usuario)} checked={ parseInt(usuario.habilitado) === 1 ? true : false } value={ parseInt(usuario.habilitado) === 1 ? 1 : 0 } name={ usuario.codigoUsuario } id={'chkBox' + usuario.codigoUsuario } />                                
                                    <div className="boton_deslizar redondo"></div>
                                </label>
                            </td>
                            <td onClick={() => this.seleccionarUsuario(usuario)}>{usuario.cuentaUsuario.toUpperCase()}</td>
                            <td onClick={() => this.seleccionarUsuario(usuario)}>{usuario.nombres.toUpperCase()}</td>
                            <td onClick={() => this.seleccionarUsuario(usuario)}>{(usuario.apellidosPaterno + " " + (usuario.apellidosMaterno || "")).toUpperCase()}</td>
                            <td style={{textAlign:'center'}} onClick={() => this.seleccionarUsuario(usuario)}>{obtenerDenominacionGrupoUsuario(usuario.grupo)}</td>
                        </tr>
                    )}
                    </tbody>
                </table>
                </div>
                <div className="centrado">
                    {this.state.sugerenciasUsuarios.length > 0 ? null : <div style={{width:"60%"}}><CuadroMensaje tipoCuadro={"basico"}>No EXISTEN datos para mostrar</CuadroMensaje></div>  }
                </div>
                <Modal
                    mostrarModal = {this.state.mostrarModal}
                    controlModal = {this.controlModal}
                    tituloModal = {"Datos de Usuario"}
                >
                <form noValidate onSubmit={this.guardarUsuario} className="una_columna">
                    <label><b> Numero Cuenta </b></label>
                    <input id="cuentaUsuario" className="cuadro_dato" maxLength="9" value={this.state.usuarioSeleccion.cuentaUsuario || ""} onChange={this.modificarUsuarioEstado}/>
                    <label><b> Nombres </b></label>
                    <input id="nombres" className="cuadro_dato" value={this.state.usuarioSeleccion.nombres || ""} onChange = {this.modificarUsuarioEstado}/>
                    <label><b> Apellido Paterno </b></label>
                    <input id="apellidosPaterno" className="cuadro_dato" value={this.state.usuarioSeleccion.apellidosPaterno || ""} onChange={this.modificarUsuarioEstado}/>
                    <label><b> Apellido Materno </b></label>
                    <input id="apellidosMaterno" className="cuadro_dato" value={this.state.usuarioSeleccion.apellidosMaterno || ""} onChange={this.modificarUsuarioEstado}/>
                    <label><b> Grupo </b></label>
                    <select id="grupo" className="cuadro_dato" defaultValue={this.state.usuarioSeleccion.grupo} onChange={this.modificarUsuarioEstado}>
                        <option value="0">Operario</option>
                        <option value="1">Administrador</option>
                        <option value="2">Gerente</option>
                    </select>
                    <div className="">
                        <input type='checkbox' id='habilitado' checked={this.state.usuarioSeleccion.habilitado || 0} onChange={this.modificarUsuarioEstado}/>
                        <label>{this.state.usuarioSeleccion.habilitado ? "Habilitado" : "Deshabilitado"}</label>
                    </div>
                    <label><b> Contraseña </b></label>
                    <input id='contrasegnaVisible' className="cuadro_dato" value={ this.state.usuarioSeleccion.contrasegnaVisible||""} onChange={this.modificarUsuarioEstado}/>
                    <div className="centrado">
                        <button className="boton boton_verde" type="submit">Guardar</button>
                    </div>
                </form>
                </Modal>  
            </div>
        )} else { return <UsuarioNoValido /> }
    }
}

export default Usuario;