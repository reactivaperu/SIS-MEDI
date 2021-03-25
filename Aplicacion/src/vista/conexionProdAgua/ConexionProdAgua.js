import React, { Component } from 'react';
import { verificarGrupoUsuario } from '../../datos/usuarioDB.js';
import { numeroArabigoEnRomano , obtenerDenominacionTipoAltitud} from '../../datos/funcionesSistema';
import { promesaListarZonasComponente } from '../../datos/zonaDB.js';
import { promesaListarTotalConexionesPorZonaAltitud,
         promesaRegistrarTotalConexionesProdAgua,
         promesaModificarTotalConexionesProdAgua } from '../../datos/conexionProdAguaDB.js';

/* COMPONENTES */
import Paginacion, { CANTIDAD_PAGINA, TAMAGNO_PAGINA } from "../../componentes/Paginacion.js";
import UsuarioNoValido from '../../componentes/UsuarioNoValido.js';
import CuadroMensaje from '../../componentes/CuadroMensaje.js';
import Modal from "../../componentes/Modal.js";
const estadoInicial = {
    usuario : verificarGrupoUsuario(),
    zonas : [],
    totalConexionesProdAgua : [],

    zonaSeleccionado : "%",
    altitudSeleccionado : "%",

    paginaActual : 1,
    conexionInicioPaginado : 1,

    codigoProdConexion : 0,
    zonaRegistro : 0,
    altitudRegistro : 0,
    conexionesRegistro : 0,

    mostrarVentanaModalRegistrar : false,
    mensajeTexto : ''
}
export class ConexionProdAgua extends Component {

    constructor(props) { 
        super(props);
        this.state = estadoInicial;
    }
    
    listarZonas = () => {
        promesaListarZonasComponente().then( respuesta => { this.setState({ zonas : respuesta }) });
    }

    listarTotalConexionesProdAgua = () => {
        this.setState({conexionInicioPaginado:(parseInt(this.state.paginaActual)-1)*TAMAGNO_PAGINA},()=>{
            const Busqueda={ zona:this.state.zonaSeleccionado,altitud:this.state.altitudSeleccionado,
                inicio:this.state.conexionInicioPaginado,resultados:TAMAGNO_PAGINA };
            promesaListarTotalConexionesPorZonaAltitud(Busqueda).then(res=>{if(!res.error){this.setState({totalConexionesProdAgua:res})}});
        });
    }

    controlVentanaModalRegistrar = () => {
        this.setState({ mostrarVentanaModalRegistrar : !this.state.mostrarVentanaModalRegistrar });
    }

    controlVentanaModalRegistrar = () => {
        if(this.state.mostrarVentanaModalRegistrar){ // SI LA VENTANA ESTA ACTIVA
            this.setState({ zonaRegistro : 0, altitudRegistro : 0, conexionesRegistro : 0  });
        }
        this.setState({ mostrarVentanaModalRegistrar :  !this.state.mostrarVentanaModalRegistrar});
    }
    
    controlAlertaModalRegistrar = (texto) => {
        this.setState({mensajeTexto:texto},()=>{setTimeout(this.setState.bind(this,estadoInicial),5000) });
    }

    cambiarZonaSeleccionado = (evento) => {
        this.setState({ zonaSeleccionado : evento.target.value }, () => this.listarTotalConexionesProdAgua());
    }

    cambiarAltitudSeleccionado = (evento) => {
        this.setState({ altitudSeleccionado : evento.target.value }, () => this.listarTotalConexionesProdAgua());
    }

    registrarTotalConexiones = (evento) => {
        evento.preventDefault();
        const nuevoTotalConexion = {
            codigo : this.state.codigoProdConexion,
            zona : document.getElementById('zonaRegistro').value,
            altitud : document.getElementById('altitudRegistro').value,
            conexiones : document.getElementById('conexionesRegistro').value,
            quien : this.state.usuario.firmaDigital
        }
        if(this.state.codigoProdConexion > 0){ // SI EXISTE REGISTRO, SE EDITARA
            promesaModificarTotalConexionesProdAgua(nuevoTotalConexion).then(respuesta => {
                if(!respuesta[0].error){ this.setState({ mostrarVentanaModalRegistrar : false }, () => this.listarTotalConexionesProdAgua())}
                else { this.controlAlertaModalRegistrar("Registro Existente") }
            });
        }else{ // NO EXISTE REGISTRO, SE REGISTRARA
            promesaRegistrarTotalConexionesProdAgua(nuevoTotalConexion).then(respuesta => {
                if(!respuesta[0].error){ this.setState({ mostrarVentanaModalRegistrar : false }, () => this.listarTotalConexionesProdAgua())}
                else { this.controlAlertaModalRegistrar("Registro Existente") }
            });
        }
    }

    modificarTotalConexiones = (conexion) => {
        this.setState({
            codigoProdConexion : conexion.codigoProdConexion,
            zonaRegistro : conexion.codigoZona,
            altitudRegistro : conexion.tipoAltitud,
            conexionesRegistro : conexion.numeroConexiones,
            mostrarVentanaModalRegistrar : !this.state.mostrarVentanaModalRegistrar
        });
    }

    cambiarPagina = (pagina) => {
        if(parseInt(pagina) > 0 ){ pagina = parseInt(pagina) }
        else { pagina = (parseInt(pagina.target.value) || "") }
        if(pagina <= CANTIDAD_PAGINA){ this.setState({ paginaActual: pagina }, () => this.listarTotalConexionesProdAgua()) }
    }

    redireccionar = (ruta) => { this.props.history.push(ruta) }

    componentDidMount() { 
        if (this.state.usuario.grupo > 0) { 
            this.listarZonas();      
            this.listarTotalConexionesProdAgua();
        }// else{ this.props.history.push('/') }
    }

    render() {
        if (this.state.usuario.grupo > 0) { 
            return (
            <div className="contenedor">
                <div className="centrado" style={{alignItems:'center'}}>
                    <select className="cuadro_dato" value={this.state.zonaSeleccionado} onChange={this.cambiarZonaSeleccionado}>
                        <option value="%"> Seleccione la zona </option>
                        {this.state.zonas.filter(zona => zona.esSector).map(zona  => (
                            <option key={zona.codigoZona} value={zona.codigoZona}> {"Zona \u00A0" + numeroArabigoEnRomano(zona.sector) + (parseInt(zona.subSector) === 0 ? '':" \u2014 " + numeroArabigoEnRomano(zona.subSector)) + (zona.microSector === '-' ? '':" \u2014 "+zona.microSector)}</option>
                        ))}
                    </select>
                    &nbsp; &mdash; &nbsp;
                    <select className="cuadro_dato" id="altitudSeleccionado" value={this.state.altitudSeleccionado} onChange={ this.cambiarAltitudSeleccionado }>
                        <option value="%"> Seleccione la altitud </option>
                        <option value="3">Alta</option>
                        <option value="2">Media</option>
                        <option value="1">Baja</option>
                        <option value="0">SNES</option>
                    </select>
                </div> 
                <br /><br />
                <Paginacion
                    cantidadElementos = {this.state.totalConexionesProdAgua.length}
                    cambiarPagina = {this.cambiarPagina}
                    paginaActual = {this.state.paginaActual}
                ></Paginacion><br />
                <div className="centrado">
                <table style={{width:"40%"}}>      
                    <thead>
                        <tr style={{textAlign:'center'}}>
                            <th style={{width:"1%"}}><img src="/img/agregarRegistro.png" alt="Registrar/Agregar Datos de conexiones de la Ofi. Producción de Agua" title="Registrar/Agregar Datos de conexiones de la Ofi. Producción de Agua" onClick={ () => this.controlVentanaModalRegistrar()}/></th>
                            <th>Zona</th>
                            <th>Altitud</th>
                            <th>Número de<br />Conexiones</th>
                        </tr> 
                    </thead>                         
                    <tbody>
                    {this.state.totalConexionesProdAgua.map ((conexion, indice ) => (
                        <tr key={indice} className="tabla_fila">
                            <td></td>
                            <td style={{textAlign:'center'}}>
                                { "Zona \u00A0" + numeroArabigoEnRomano(conexion.sector) + (parseInt(conexion.subSector) === 0 ? '' : " \u2014 " + numeroArabigoEnRomano(conexion.subSector)) +   (conexion.microSector === '-' ? '' : " \u2014 " + conexion.microSector) } 
                            </td>
                            <td style={{textAlign:'center'}}> {obtenerDenominacionTipoAltitud(conexion.tipoAltitud)} </td>
                            <td style={{textAlign:'center', fontSize:'20pt'}} onClick={() => this.modificarTotalConexiones(conexion)}> 
                                {conexion.numeroConexiones } 
                            </td> 
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
                <div className="centrado">
                    {this.state.totalConexionesProdAgua.length > 0 ? null : <div style={{width:"40%"}}><CuadroMensaje tipoCuadro={"basico"}>No EXISTEN datos para mostrar</CuadroMensaje></div>  }
                </div>
                {/* Inicio seccion para --- REGISTAR --- */}

                <Modal
                    mostrarModal = {this.state.mostrarVentanaModalRegistrar}
                    controlModal = {this.controlVentanaModalRegistrar}
                    tituloModal = {"Registrar Total de Conexiones"}
                >
                <form noValidate onSubmit={this.registrarTotalConexiones} className="una_columna">
                    {this.state.mensajeTexto.length < 1 ? null:
                    <div className="centrado">
                        <div style={{width:"100%"}}><CuadroMensaje tipoCuadro={"peligro"}>{this.state.mensajeTexto}</CuadroMensaje></div>
                    </div>}

                    <label htmlFor="zonaRegistro">Zona : &nbsp; 
                    <select className="cuadro_dato" name="zonaRegistro" id="zonaRegistro" defaultValue={this.state.zonaRegistro}>
                        <option value="0">Seleccione Zona</option>
                        {this.state.zonas.filter(zona => zona.esSector).map(zona  => (
                            <option key={zona.codigoZona} value={zona.codigoZona}> {"Zona \u00A0" + numeroArabigoEnRomano(zona.sector) + (parseInt(zona.subSector) === 0 ? '':" \u2014 " + numeroArabigoEnRomano(zona.subSector)) + (zona.microSector === '-' ? '':" \u2014 "+zona.microSector)}</option>
                        ))}
                    </select></label>

                    <label htmlFor="altitudRegistro">Altitud : &nbsp; 
                    <select className="cuadro_dato" id="altitudRegistro" defaultValue={this.state.altitudRegistro}>
                        <option value="0">Seleccione Altitud</option>
                        <option value="3">Alta</option>
                        <option value="2">Media</option>
                        <option value="1">Baja</option>
                    </select></label>

                    <label htmlFor="conexionesRegistro">Conexiones : &nbsp;
                        <input className="cuadro_dato" type="number" min="0" name="conexionesRegistro" id="conexionesRegistro" defaultValue={ this.state.conexionesRegistro }/>
                    </label>
                    <div className="centrado">
                        <button className="boton boton_verde" type="submit">Registrar</button>
                    </div>
                </form>
                </Modal>
                {/* Final de seccion para --- REGISTRAR --- */}
            </div>  
            )
        } else {
            return ( <UsuarioNoValido /> );
        } 
    }
}

export default ConexionProdAgua