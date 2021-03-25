import React, { Component } from 'react';
import { numeroArabigoEnRomano } from '../../datos/funcionesSistema';
import { verificarGrupoUsuario } from '../../datos/usuarioDB.js';
import { promesaModificarZona,
         promesaListarZonas, 
         promesaAgregarZona, 
         promesaDeshabilitarZona, 
         promesaHabilitarZona,
         promesaDeshabilitarUnaZonaComoSector,
         promesaHabilitarUnaZonaComoSector } from '../../datos/zonaDB.js';

// ---- COMPONENTES -----
import Paginacion, { CANTIDAD_PAGINA, TAMAGNO_PAGINA } from "../../componentes/Paginacion.js";
import UsuarioNoValido from '../../componentes/UsuarioNoValido.js';
import CuadroMensaje from '../../componentes/CuadroMensaje.js';
import Modal from '../../componentes/Modal';
const zonaSeleccionInicial={codigoZona:0,sector:0,subSector:0,microSector:"-",denominacionZona:"",esSector:0,tieneConexiones:0,habilitado:0};

export class Zona extends Component {
    
    constructor(props) { 
        super(props);
        this.state = { 
            usuario : verificarGrupoUsuario(),
            zonaSeleccion: zonaSeleccionInicial,
            zonas : [],
            paginaActual : 1,
            zonaInicioPaginado : 1,
            mostrarVentanaModal : false,

            anchoModal: 0, // El ancho que tendra la ventana del Modal expresado en Porcentaje
            altoModal: 0, // La altura que tendra la ventana del Modal expresado en Porcentaje
        };
    }

    listarZonas = () => {
        this.setState({ zonaInicioPaginado : (parseInt(this.state.paginaActual) - 1) * TAMAGNO_PAGINA }
        , () => {  
            promesaListarZonas({ inicio : this.state.zonaInicioPaginado, resultados : TAMAGNO_PAGINA }).then( respuesta => { 
                this.setState({ zonas : respuesta });
            });
        });
    }
        
    modificarZona = () => {
        let zonaModificada = { 
            zona : this.state.zonaSeleccion.codigoZona,
            sector : document.getElementById('sector').value,
            subsector : document.getElementById('subSector').value, 
            microsector : document.getElementById('microSector').value,
            denominacion : document.getElementById('denominacionZona').value,
            esSector : (document.getElementById('esSector').checked ? 1 : 0),
            tieneConexiones :  (document.getElementById('tieneConexiones').checked ? 1 : 0),
            quien: this.state.usuario.firmaDigital
        }
        if(zonaModificada.sector !== "0"){ promesaModificarZona(zonaModificada).then(respuesta => {
            if(!respuesta.error){
                this.listarZonas();
                this.controlarVentanaModal();
            }else{ alert("No se pudo guardar los datos") }
        })} else { alert("Ingrese un identificador de Sector") }
    }

    agregarZona = () => {
        const zonaNuevo = {
            sector : document.getElementById('sector').value,
            subsector : document.getElementById('subSector').value, 
            microsector : document.getElementById('microSector').value,
            denominacion : document.getElementById('denominacionZona').value,
            esSector : (document.getElementById('esSector').checked ? 1 : 0),
            tieneConexiones :  (document.getElementById('tieneConexiones').checked ? 1 : 0),
            quien : this.state.usuario.firmaDigital
        };
        if(zonaNuevo.sector !== "0"){ promesaAgregarZona(zonaNuevo).then(respuesta => {
            if(!respuesta.error){
                this.listarZonas();
                this.controlarVentanaModal();
            }else{ alert("No se pudo registrar") }
        })} else { alert("Ingrese un identificador de Sector") }
    }

    cambiarEstadoZona = (evento) => {
        const { zonaSeleccion } = this.state;
        var habilitar = evento.target.checked;
        zonaSeleccion["codigoZona"] = parseInt(evento.target.dataset.zona)
        this.setState({ zonaSeleccion }, () => { 
            const objetoEnviado = { zona : this.state.zonaSeleccion.codigoZona,firma : this.state.usuario.firmaDigital };
            if (!habilitar) { promesaDeshabilitarZona(objetoEnviado).then(_ => this.listarZonas()) } 
            else { promesaHabilitarZona(objetoEnviado).then(_ => this.listarZonas())}
        });
    }

    cambiarSiEsSector = (evento) => {
        const { zonaSeleccion } = this.state;
        var habilitar = evento.target.checked;
        zonaSeleccion["codigoZona"] = parseInt(evento.target.dataset.zona)
        this.setState({ zonaSeleccion }, () => {
            const objetoEnviadoSector = { zona : this.state.zonaSeleccion.codigoZona,firma : this.state.usuario.firmaDigital };
            if ( !habilitar) { promesaDeshabilitarUnaZonaComoSector(objetoEnviadoSector).then(_ => this.listarZonas())} 
            else { promesaHabilitarUnaZonaComoSector(objetoEnviadoSector).then(_ => this.listarZonas()) }
        });
    }

    seleccionarEditarDenominacionZona = (elemento) => {
        this.setState({ zonaSeleccion : elemento,  mostrarVentanaModal : true });
    }

    registrarZona = (evento) => {
        evento.preventDefault();
        if(this.state.zonaSeleccion.codigoZona > 0){ this.modificarZona() }
        else { this.agregarZona() }
    }

    controlarVentanaModal = () => {
        if(this.state.mostrarVentanaModal){ this.setState({ zonaSeleccion: zonaSeleccionInicial}) }
        this.setState({ mostrarVentanaModal : !this.state.mostrarVentanaModal });
    }

    cambiarPagina = (pagina) => {
        if(parseInt(pagina) > 0 ){ pagina = parseInt(pagina) }
        else { pagina = (parseInt(pagina.target.value) || "") }
        if(pagina <= CANTIDAD_PAGINA){ this.setState({ paginaActual: pagina }, () => this.listarZonas()) }
    }
  
    componentDidMount() {
        if (this.state.usuario.grupo > 0) {
            this.setState({ zonaInicioPaginado : (parseInt(this.state.paginaActual) - 1) * TAMAGNO_PAGINA },() => {
                this.listarZonas();
            });
        }// else{ this.props.history.push('/') }
    }

    render() {
        /* SI ES ADMINISTRADOR O GERENTE */
        if (this.state.usuario.grupo > 0) {
            let sectoresTemporales = new Array(30).fill(1).map( (_, i) => i+1 );
            let numeros = sectoresTemporales.map(numero => { return ( <option key={numero} value={numero}>{numeroArabigoEnRomano(numero)}</option> )});
            return (
                <div className="contenedor">
                    <Paginacion
                        cantidadElementos = {this.state.zonas.length}
                        cambiarPagina = {this.cambiarPagina}
                        paginaActual = {this.state.paginaActual}
                    ></Paginacion><br />
                    <div className="centrado">
                        <table style={{width:"70%"}}>
                            <thead>
                                <tr>       
                                    <th><img src="/img/agregarRegistro.png" alt="Registrar/Agregar una Nueva Zona" title="Registrar/Agregar una Nueva Zona" onClick={ () => this.controlarVentanaModal()}/></th>
                                    <th>Zona Comercial</th>
                                    <th>Área de Servicio</th>
                                    <th>Sector</th>
                                </tr>
                            </thead>
                            <tbody>
                            {this.state.zonas.map(elemento => ( 
                                <tr key={elemento.codigoZona} className="tabla_fila">
                                    <td style={{textAlign:'center'}}>
                                        <label className="boton_habilitado">
                                            <input onChange={this.cambiarEstadoZona} checked={ parseInt(elemento.habilitado) === 1 ? true : false } value={ parseInt(elemento.habilitado) === 1 ? 1 : 0 } data-zona={elemento.codigoZona} name={'chkBox'+elemento.codigoZona} id={'chkBox'+elemento.codigoZona} title="Habilitar/Deshabilitar la Zona Comercial" type="checkbox"/>
                                            <div className="boton_deslizar redondo"></div>
                                        </label>
                                    </td>
                                    <td onClick={() => this.seleccionarEditarDenominacionZona(elemento)}>
                                        {"Zona \u00A0" + numeroArabigoEnRomano(elemento.sector) + (parseInt(elemento.subSector) === 0 ? '':" \u2014 " + numeroArabigoEnRomano(elemento.subSector)) +   (elemento.microSector === '-' ? '':" \u2014 "+elemento.microSector)} 
                                    </td>
                                    <td onClick={() => this.seleccionarEditarDenominacionZona(elemento)}> 
                                        {elemento.denominacionZona || "\u2699" }
                                    </td>
                                    <td style={{textAlign:'center'}}> 
                                        <input type="checkbox" onChange={this.cambiarSiEsSector} checked={ parseInt(elemento.esSector) === 1 ? true : false } value={ parseInt(elemento.esSector) === 1 ? 1 : 0 } data-zona={elemento.codigoZona} name={'chkSS'+elemento.codigoZona} id={'chkSS'+elemento.codigoZona} title="Habilitar/Deshabilitar Si la Zona Comercial debe SER un SECTOR" />
                                    </td>   
                                </tr> 
                            ))}
                            </tbody>      
                        </table>
                    </div>
                    <div className="centrado">
                        {this.state.zonas.length > 0 ? null : <div style={{width:"70%"}}><CuadroMensaje tipoCuadro={"basico"}>No EXISTEN datos para mostrar</CuadroMensaje></div>  }
                    </div>
                    <Modal
                        mostrarModal = {this.state.mostrarVentanaModal}
                        controlModal = {this.controlarVentanaModal}
                        tituloModal = {"Datos de Zona Comercial"}
                    >
                    <form noValidate onSubmit={this.registrarZona} className="una_columna">
                        <label htmlFor="zona">{'Datos de Sector'}&nbsp;</label>
                        <div htmlFor="zona">
                            <select className="cuadro_dato" required name="sector" id="sector" defaultValue={this.state.zonaSeleccion.sector}>
                                <option value="0">Sector</option>{ numeros }
                            </select>
                            &nbsp;{'\u2014'}&nbsp; 
                            <select className="cuadro_dato" name="subSector" id="subSector" defaultValue={this.state.zonaSeleccion.subSector}>
                                <option value="0">Sub-Sector</option>{ numeros }
                            </select>
                            &nbsp;{'\u2014'}&nbsp; 
                            <select className="cuadro_dato" name="microSector" id="microSector" defaultValue={this.state.zonaSeleccion.microSector}>
                                <option value="-">Micro-Sector</option>
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                                <option value="D">D</option>
                                <option value="E">E</option>
                            </select>
                        </div>
                        <label htmlFor="esSector">Comportarse como un SECTOR &nbsp;
                            <input type="checkbox" name="esSector" id="esSector" 
                                defaultChecked = { this.state.zonaSeleccion.esSector || 0}
                            />
                        </label>
                        <label htmlFor="tieneConexiones">Habilitar para registrar Conexiones &nbsp;
                            <input type="checkbox" name="tieneConexiones" id="tieneConexiones" 
                                defaultChecked = { this.state.zonaSeleccion.tieneConexiones || 0}
                            />
                        </label>
                        <label htmlFor="denominacionZona">Nombre/Denominación de Zona Comercial</label>
                        <input className="cuadro_dato" type="text" name="denominacionZona" id="denominacionZona" maxLength="50" placeholder="Nombre de la Zona Comercial" 
                            defaultValue={this.state.zonaSeleccion.denominacionZona}
                        />
                        <div></div>
                        <div className="centrado">
                            <button className="boton boton_verde" type="submit">Registrar</button>
                        </div>
                    </form>                 
                    </Modal>
                </div>
            ); // final del RETURN
        } else { return <UsuarioNoValido /> }  
    }
}

export default Zona