import React, { Component } from 'react';
import { numeroArabigoEnRomano } from '../../datos/funcionesSistema';
import { verificarGrupoUsuario } from '../../datos/usuarioDB.js';
import { promesaListarZonasComponente } from '../../datos/zonaDB.js';
import { promesaListarBloquesPaginado, 
         promesaDeshabilitarBloque, 
         promesaHabilitarBloque, 
         promesaAgregarBloqueUrbano, 
         promesaModificarNombreBloque, 
         promesaModificarZonaBloque } from '../../datos/bloqueDB.js';

// ---- COMPONENTES -----
import Paginacion, { CANTIDAD_PAGINA, TAMAGNO_PAGINA } from "../../componentes/Paginacion.js";
import UsuarioNoValido from '../../componentes/UsuarioNoValido.js';
import CuadroMensaje from '../../componentes/CuadroMensaje.js';
import Modal from "../../componentes/Modal.js";

export class Bloque extends Component {

    constructor(propiedades) { 
        super(propiedades); 
        this.state = { 
            usuario: verificarGrupoUsuario(),
            zonas : [],    
            bloquesUrbanos : [],
            paginaActual : 1,
            urbanoInicioPaginado : 1,
            indiceBloqueSeleccionado : 0,
            denominacionBloqueSeleccionado : '',
            mostrarVentanaModalAgregar : false,
            mostrarVentanaModalEditar : false
        };
    }

    listarZonas = () => {
        promesaListarZonasComponente().then( respuesta => { 
            this.setState({ zonas : respuesta }); 
        });
    }
 
    listarBloquesUrbanos = () => {
        this.setState({ urbanoInicioPaginado : (parseInt(this.state.paginaActual) - 1) * TAMAGNO_PAGINA }
        , () => {  
            promesaListarBloquesPaginado({ inicio : this.state.urbanoInicioPaginado, resultados : TAMAGNO_PAGINA }).then( respuesta => { 
                this.setState({ bloquesUrbanos : respuesta }); 
            });
        }); 
    }

    controlarVentanaModalAgregar = () => {
        this.setState({ 
            mostrarVentanaAgregarModal : !this.state.mostrarVentanaAgregarModal 
        });
    }

    seleccionarBloqueUrbano = (indiceBloque, nombreBloque) => {
        this.setState({
            indiceBloqueSeleccionado : indiceBloque,
            denominacionBloqueSeleccionado : nombreBloque,
            mostrarVentanaEditarModal : !this.state.mostrarVentanaEditarModal
        });
    }

    cambiarEstadoBloque = (evento) => {
        const estaHabilitado = parseInt(evento.target.value);
        this.setState({indiceBloqueSeleccionado:parseInt(evento.target.dataset.bloque)},()=>{
            const objetoEnviado = {
                codigo : this.state.indiceBloqueSeleccionado,
                firma : this.state.usuario.firmaDigital
            };
            if (estaHabilitado === 1) {
                promesaDeshabilitarBloque(objetoEnviado).then(_=>this.listarBloquesUrbanos())
            }else {        
                promesaHabilitarBloque(objetoEnviado).then(_=>this.listarBloquesUrbanos());
            }
        });
    }

    controlarVentanaModalEditar = () => {
        this.setState({ 
            mostrarVentanaEditarModal : !this.state.mostrarVentanaEditarModal 
        });
    }

    alterarDenominacionBloque = (evento) => {
        this.setState ({ 
            denominacionBloqueSeleccionado : evento.target.value  
        });
    }

    agregarBloque = (evento) => {
        evento.preventDefault();
        let zonaParaAgregar = document.getElementById('zona_agregar_');
        let nombreBloqueParaAgregar = document.getElementById('bloque');
        let zonaTemporalAgregar = zonaParaAgregar.options[zonaParaAgregar.selectedIndex].value;
        this.setState({ mostrarVentanaAgregarModal:false }, () => {
            const objetoNuevo = { 
                zona : zonaTemporalAgregar,
                denominacion : nombreBloqueParaAgregar.value, 
                firma : this.state.usuario.firmaDigital
            };
            promesaAgregarBloqueUrbano( objetoNuevo ).then( respuesta => { 
                this.listarBloquesUrbanos();
            });
        });
    }
    
    actualizarDenominacionBloque = (evento) => {
        evento.preventDefault();
        this.setState({ mostrarVentanaEditarModal:false }, () => {
            const objetoModificado = {
                codigo : this.state.indiceBloqueSeleccionado, 
                denominacion: this.state.denominacionBloqueSeleccionado,
                firma : this.state.usuario.firmaDigital
            };
            promesaModificarNombreBloque( objetoModificado ).then ( respuesta => { 
                this.listarBloquesUrbanos(); 
            });
        } );
    }
    
    cambiarZona = (evento) => {
        const jsonModificado = {
            codigo : evento.target.dataset.urbano,
            zona : evento.target.options[evento.target.selectedIndex].value,
            firma :  this.state.usuario.firmaDigital
        }
        promesaModificarZonaBloque( jsonModificado ).then( respuesta => {
            this.listarBloquesUrbanos();
        }); 
    }

    cambiarPagina = (pagina) => {
        if(parseInt(pagina) > 0 ){ pagina = parseInt(pagina) }
        else { pagina = (parseInt(pagina.target.value) || "") }
        if(pagina <= CANTIDAD_PAGINA){ this.setState({ paginaActual: pagina }, () => this.listarBloquesUrbanos()) }
    }

    redireccionar = (ruta) => { this.props.history.push(ruta) }

    componentDidMount() {
        if (this.state.usuario.grupo > 0) {
            this.listarZonas();  
            this.listarBloquesUrbanos();
        }// else{ this.props.history.push('/') }
    }
        
    render() {
        /* SI ES ADMINISTRADOR O GERENTE */
        if (this.state.usuario.grupo > 0) {
            return (
                <div className="contenedor">
                    <Paginacion
                        cantidadElementos = {this.state.bloquesUrbanos.length}
                        cambiarPagina = {this.cambiarPagina}
                        paginaActual = {this.state.paginaActual}
                    ></Paginacion><br />
                    <div className="centrado">
                    <table style={{width:"50%"}}>
                        <thead>
                            <tr>
                                <th><img src="/img/agregarRegistro.png" alt="Registrar/Agregar un Nuevo Bloque Urbano" title="Registrar/Agregar un Nuevo Bloque Urbano" onClick={ () => this.controlarVentanaModalAgregar()}/></th>
                                <th style={{textAlign:'center'}}>Zona</th>
                                <th>Denominación</th>
                            </tr>
                        </thead>
                        <tbody>
                        {this.state.bloquesUrbanos.map( elemento => (
                            <tr key={elemento.codigoUrbano} className="tabla_fila">
                                <td style={{textAlign:'center'}}>
                                    <label className="boton_habilitado">
                                        <input type="checkbox" onChange={this.cambiarEstadoBloque} checked={ parseInt(elemento.habilitado) === 1 ? true : false } value={ parseInt(elemento.habilitado) === 1 ? 1 : 0 } data-bloque={elemento.codigoUrbano} name={'chkBox'+elemento.codigoUrbano} id={'chkBox'+elemento.codigoUrbano } />                                        
                                        <div className="boton_deslizar redondo"></div>
                                    </label>
                                </td>
                                <td style={{textAlign:'center'}}>
                                    <select className="cuadro_dato" name={'zona_' + elemento.codigoUrbano} id={'zona_' + elemento.codigoUrbano} value={elemento.codigoZona} data-urbano={elemento.codigoUrbano} onChange={this.cambiarZona}>
                                        <option value="0"> Seleccione la zona </option>
                                        {this.state.zonas.map((pZona, nIndice)  => (
                                            <option key={'z' + nIndice} value={pZona.codigoZona}> {"Zona \u00A0" + numeroArabigoEnRomano(pZona.sector) + (parseInt(pZona.subSector) === 0 ? '':" \u2014 " + numeroArabigoEnRomano(pZona.subSector)) + (pZona.microSector === '-' ? '':" \u2014 "+pZona.microSector)}
                                            </option>
                                        ))}
                                    </select>                
                                </td>
                                <td onClick={() => { this.seleccionarBloqueUrbano( elemento.codigoUrbano, elemento.denominacionBloque)}}>
                                    {elemento.denominacionBloque.toUpperCase()}
                                </td>
                            </tr>
                        ))} 
                        </tbody>  
                    </table>
                    </div>
                    <div className="centrado">
                        {this.state.bloquesUrbanos.length > 0 ? null : <div style={{width:"50%"}}><CuadroMensaje tipoCuadro={"basico"}>No EXISTEN datos para mostrar</CuadroMensaje></div>  }
                    </div>
                    <Modal
                        mostrarModal = {this.state.mostrarVentanaAgregarModal}
                        controlModal = {this.controlarVentanaModalAgregar}
                        tituloModal = {"Nueva Fuente de Agua"}
                    >
                    <form noValidate onSubmit={this.agregarBloque} className="una_columna">
                        <label htmlFor="zona_agregar_"> Zona Comercial : &nbsp;
                            <select className="cuadro_dato" name="zona_agregar_" id="zona_agregar_" required>
                                <option value="0"> Seleccione la zona </option>
                                {this.state.zonas.map((pZona, nIndice)  => (
                                    <option key={'z' + nIndice} value={pZona.codigoZona}> {"Zona \u00A0" + numeroArabigoEnRomano(pZona.sector) + (parseInt(pZona.subSector) === 0 ? '':" \u2014 " + numeroArabigoEnRomano(pZona.subSector)) + (pZona.microSector === '-' ? '':" \u2014 "+pZona.microSector)}</option>
                                ))}
                            </select>
                        </label>
                        <label htmlFor="bloque">Denominación del Bloque Urbano</label>
                        <input className="cuadro_dato" type="text" size="40" required name="bloque" id="bloque" placeholder="Nombre de la fuente de agua" />
                        <div className="centrado">
                            <button className="boton boton_verde" type="submit">Agregar</button>
                        </div>                        
                    </form>
                    </Modal>
                    
                    <Modal
                        mostrarModal = {this.state.mostrarVentanaEditarModal}
                        controlModal = {this.controlarVentanaModalEditar}
                        tituloModal = {"Editar Fuente de Agua"}
                    >
                    <form noValidate onSubmit={this.actualizarDenominacionBloque} className="una_columna">
                        <label htmlFor="bloqueModificado">Nueva denominación de la Fuente de Agua</label>
                        <input className="cuadro_dato" type="text" required name="bloqueModificado" id="bloqueModificado" placeholder="Nombre del BloqueUrbano" onChange={this.alterarDenominacionBloque} value={ this.state.denominacionBloqueSeleccionado } />
                        <div className="centrado">
                            <button className="boton boton_verde" type="submit">Actualizar</button>
                        </div>
                    </form>
                    </Modal>
                </div>
            ); // Final del RENDER
        } else { return <UsuarioNoValido /> }  
    }
}

export default Bloque