import React, { Component } from 'react'
import { verificarGrupoUsuario } from '../../datos/usuarioDB.js';
import { numeroArabigoEnRomano } from '../../datos/funcionesSistema.js';
import { promesaListarFuentesAguaPaginado, 
         promesaListarZonasPorFuentesDeAgua,
         promesaAgregarFuenteAgua, 
         promesaDeshabilitarFuenteAgua, 
         promesaHabilitarFuenteAgua, 
         promesaModificarDenominacionFuenteAgua } from '../../datos/fuenteDB.js';

// ---- COMPONENTES -----
import Paginacion, { CANTIDAD_PAGINA, TAMAGNO_PAGINA } from "../../componentes/Paginacion.js";
import UsuarioNoValido from '../../componentes/UsuarioNoValido.js';
import CuadroMensaje from '../../componentes/CuadroMensaje.js';
import Modal from "../../componentes/Modal.js";

export class FuenteAgua extends Component {
   
    constructor(props) {
        super(props);
        this.state = {
            usuario: verificarGrupoUsuario(),
            fuentesAgua : [],
            zonasFuentes : [],
            paginaActual : 1,
            fuenteAguaInicioPaginado : 1,            
            indiceFuenteAguaSeleccionada : 0,
            denominacionFuenteAguaSeleccionada : "",            
            mostrarVentanaAgregarModal : false,
            mostrarVentanaEditarModal : false
        };
    }

    listarFuentesAgua = () => {
        this.setState({ fuenteAguaInicioPaginado : (parseInt(this.state.paginaActual) - 1) * TAMAGNO_PAGINA }
        , () => {
            promesaListarFuentesAguaPaginado({ inicio : this.state.fuenteAguaInicioPaginado, resultados : TAMAGNO_PAGINA })
            .then( respuesta => { this.setState({ fuentesAgua : respuesta }) });
        });
    }

    listarZonasFuente = () => {
        promesaListarZonasPorFuentesDeAgua().then( respuesta => {
            if (respuesta.length > 0) { 
                this.setState({ zonasFuentes : respuesta });
            }
        });
    }

    alterarDenominacionFuenteAgua = (evento) => {
        this.setState({ 
            denominacionFuenteAguaSeleccionada : evento.target.value
        });
    }

    seleccionarFuenteAgua = (indiceFuente, nombreFuente) => {
        this.setState({
            indiceFuenteAguaSeleccionada : indiceFuente,
            denominacionFuenteAguaSeleccionada : nombreFuente,
            mostrarVentanaEditarModal : !this.state.mostrarVentanaEditarModal
        });
    }

    cambiarEstadoFuenteAgua = (evento) => {
        const estaHabilitado = parseInt(evento.target.value);
        this.setState({ 
            indiceFuenteAguaSeleccionada: parseInt(evento.target.dataset.fuente)
        }, () => {
            const objetoEnviado = {
                codigo : this.state.indiceFuenteAguaSeleccionada,
                firma : this.state.usuario.firmaDigital
            };
            if (estaHabilitado === 1) {        
                promesaDeshabilitarFuenteAgua( objetoEnviado ).then( respuesta => { this.listarFuentesAgua();  } );
            } else {        
                promesaHabilitarFuenteAgua( objetoEnviado ).then( respuesta => { this.listarFuentesAgua();  });
            }
        });
    }

    controlModalAgregar = () => {
        this.setState({ 
            mostrarVentanaAgregarModal : !this.state.mostrarVentanaAgregarModal 
        });
    }

    controlModalEditar = () => {
        this.setState({
            mostrarVentanaEditarModal : !this.state.mostrarVentanaEditarModal
        });
    }

    agregarFuente = (evento) =>  {
        evento.preventDefault();
        const objetoNuevo = {
            denominacion : document.getElementById('nombreFuente').value,
            firma : this.state.usuario.firmaDigital
        };
         
        promesaAgregarFuenteAgua( objetoNuevo ).then(_ => {
            this.setState({ mostrarVentanaAgregarModal:false });
            this.listarFuentesAgua(); 
        }); 
    }
    
    redireccionar = (ruta) => { this.props.history.push(ruta) }

    enviarModificacion = (evento) => {
        evento.preventDefault();
        const objetoModificado = {
            codigo : this.state.indiceFuenteAguaSeleccionada,
            denominacion : document.getElementById('fuenteModificada').value,
            firma : this.state.usuario.firmaDigital
        };
        promesaModificarDenominacionFuenteAgua(objetoModificado).then (_ => {
            this.setState({ mostrarVentanaEditarModal: false });
            this.listarFuentesAgua(); 
        });
    }

    mostrarOcultarZonas = (codigoData) => {
        let ventana_ = document.getElementById('zInfo' + codigoData);
        ventana_.hidden = (ventana_.hidden === true) ? false : true;
    }

    cambiarPagina = (pagina) => {
        if(parseInt(pagina) > 0 ){ pagina = parseInt(pagina) }
        else { pagina = (parseInt(pagina.target.value) || "") }
        if(pagina <= CANTIDAD_PAGINA){ this.setState({ paginaActual: pagina }, () => this.listarFuentesAgua()) }
    }

    componentDidMount() {
        if (this.state.usuario.grupo > 0) {
            this.setState({ fuenteAguaInicioPaginado : (parseInt(this.state.paginaActual) - 1) * TAMAGNO_PAGINA }, () => {
                this.listarFuentesAgua();
                this.listarZonasFuente();
            });
        }// else{ this.props.history.push('/') }
    }

    render() {
        if (this.state.usuario.grupo > 0) {
            return (
            <div className="contenedor">
                <Paginacion
                    cantidadElementos = {this.state.fuentesAgua.length}
                    cambiarPagina = {this.cambiarPagina}
                    paginaActual = {this.state.paginaActual}
                ></Paginacion><br />
                <div className="centrado">
                <table style={{width:"40%"}}>
                    <thead>
                        <tr>
                            <th><img src="/img/agregarRegistro.png" alt="Registrar/Agregar una Nueva Fuente de Agua" title="Registrar/Agregar una Nueva Fuente de Agua" onClick={ () => this.controlModalAgregar()}/></th>
                            <th> Denominación/Nombre<br />Fuente de Agua</th>
                            <th> Zonas </th>
                        </tr>  
                    </thead>
                    <tbody>
                    {this.state.fuentesAgua.map( (elemento, indice ) => ( 
                        <tr key={indice} className="tabla_fila"> 
                            <td style={{textAlign:'center'}}>
                                <label className="boton_habilitado">
                                    <input type="checkbox" onChange={this.cambiarEstadoFuenteAgua} checked={ parseInt(elemento.habilitado) === 1 ? true : false } data-fuente={elemento.codigoFuente} value={ parseInt(elemento.habilitado) === 1 ? 1 : 0 } name={'chkBox'+elemento.codigoFuente} id={'chkBox'+elemento.codigoFuente } title="Habilitar/Deshabilitar la Fuente de Agua" />
                                    <div className="boton_deslizar redondo"></div>
                                </label>
                            </td>
                            <td onClick={ () => { this.seleccionarFuenteAgua(elemento.codigoFuente, elemento.denominacionFuente )}}>
                                { elemento.denominacionFuente.toUpperCase() || "\u2699" }
                                <div style={{marginLeft:'6%'}} id={'zInfo' + elemento.codigoFuente} hidden>
                                {this.state.zonasFuentes.filter( (pZona) => { return pZona.codigoFuente === parseInt(elemento.codigoFuente) }).map((pZona, nIndice) => (
                                    <div key={nIndice}>
                                        <label style={{fontSize:'11pt'}}>{"Zona \u00A0" + numeroArabigoEnRomano(pZona.sector) + (parseInt(pZona.subSector) === 0 ? '':" \u2014 " + numeroArabigoEnRomano(pZona.subSector)) + (pZona.microSector === '-' ? '':" \u2014 "+ pZona.microSector)}
                                        </label>
                                    </div>
                                ))}
                                </div>
                            </td>
                            <td style={{textAlign:'center',cursor:'pointer'}}>  
                                <img src="/img/lupaVer.png" alt="zona comercial coberturada" title="Ver zonas comerciales coberturas" onClick={ () => this.mostrarOcultarZonas(elemento.codigoFuente)}/>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>

                <div className="centrado">
                    {this.state.fuentesAgua.length > 0 ? null : <div style={{width:"40%"}}><CuadroMensaje tipoCuadro={"basico"}>No EXISTEN datos para mostrar</CuadroMensaje></div>  }
                </div>

                {/* Inicio seccion para --- AGREGAR --- */}
                <Modal
                    mostrarModal = {this.state.mostrarVentanaAgregarModal}
                    controlModal = {this.controlModalAgregar}
                    tituloModal = {"Registrar Fuente de Agua"}
                >
                <form noValidate onSubmit={this.agregarFuente} className="una_columna">
                    <label htmlFor="nombreFuente">Denominación de la Fuente de Agua</label>
                    <input className="cuadro_dato" type="text" required name="nombreFuente" id="nombreFuente" placeholder="Denominación" />
                    <div className="centrado">
                        <button className="boton boton_verde" type="submit">Agregar </button>
                    </div>
                </form>
                </Modal>

                {/* Inicio de seccion para EDITAR */}
                <Modal
                    mostrarModal = {this.state.mostrarVentanaEditarModal}
                    controlModal = {this.controlModalEditar}
                    tituloModal = {"Modificar la denominación"}
                >
                <form noValidate onSubmit={this.enviarModificacion} className="una_columna">
                    <label htmlFor="fuenteModificada">Nueva denominación de la Fuente de Agua</label>
                    <input className="cuadro_dato" type="text" required name="fuenteModificada" id="fuenteModificada" placeholder="Nombre de la fuente de agua" onChange={this.alterarDenominacionFuenteAgua} value={ this.state.denominacionFuenteAguaSeleccionada } />
                    <div className="centrado">
                        <button className="boton boton_verde" type="submit">Actualizar</button>
                    </div>
                </form>
                </Modal>
            </div>
            );
        } else {
            return ( <UsuarioNoValido /> );
        }
    }
}

export default FuenteAgua