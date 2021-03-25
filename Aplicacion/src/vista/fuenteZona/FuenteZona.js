import React, { Component } from 'react';
import { numeroArabigoEnRomano } from '../../datos/funcionesSistema';
import { verificarGrupoUsuario } from '../../datos/usuarioDB.js';
import { promesaListarZonasComponente } from '../../datos/zonaDB.js'; 
import { promesaListarFuentesAguaParaComponente } from '../../datos/fuenteDB.js';
import { promesaListarFuenteZonaPaginado,
         promesaRelacionarFuenteAguaConZona, 
         promesaCambiarFuenteAguaDeRelacion,
         promesaEliminarRelacionFuenteAguaZona } from '../../datos/fuenteZonaDB.js';

import Paginacion, { CANTIDAD_PAGINA, TAMAGNO_PAGINA } from "../../componentes/Paginacion.js";
import UsuarioNoValido from '../../componentes/UsuarioNoValido.js';
import CuadroMensaje from '../../componentes/CuadroMensaje.js';
import Modal from "../../componentes/Modal.js";

export class FuenteZona extends Component {

    constructor(props) {
        super(props);
        this.state = {
            usuario : verificarGrupoUsuario(),
            zonas : [],
            fuentesAgua : [],
            zonasPorFuenteAgua : [],
            paginaActual : 1,
            fuenteZonaInicioPaginado : 1, 
            mostrarVentanaAgregarModal : false,
            alertaTexto : '', 
            alertaColor : '',
        };
    }

    controlarVentanaModalAgregar = () => {
        this.setState({ mostrarVentanaAgregarModal : !this.state.mostrarVentanaAgregarModal });
    }

    listarZonas = () => {
        promesaListarZonasComponente().then( respuesta => {
            this.setState({ zonas : respuesta }); 
        });
    }

    listarZonaPorFuenteAgua = () => {
        this.setState({ fuenteZonaInicioPaginado : (parseInt(this.state.paginaActual) - 1) * TAMAGNO_PAGINA }
        , () => {
            promesaListarFuenteZonaPaginado({ inicio : this.state.fuenteZonaInicioPaginado, resultados : TAMAGNO_PAGINA })
            .then( respuesta => { this.setState({ zonasPorFuenteAgua : respuesta }) });
        });
    }

    listarFuentesDeAgua = () => {
        promesaListarFuentesAguaParaComponente().then( respuesta => { 
            this.setState({ fuentesAgua : respuesta }); 
        });
    }

    agregarRelacionZonaFuente = () => {
        let fuenteSeleccionada = document.getElementById('lFuentes');
        let zonaSeleccionada = document.getElementById('lZonas');
        const objetoNuevo = { 
            fuente : fuenteSeleccionada.options[fuenteSeleccionada.selectedIndex].value,
            zona : zonaSeleccionada.options[zonaSeleccionada.selectedIndex].value, 
            firma : this.state.usuario.firmaDigital
        };
        promesaRelacionarFuenteAguaConZona( objetoNuevo ).then( respuesta => { 
            if(!respuesta[0].error){
                this.setState({ mostrarVentanaAgregarModal : false }, () => this.listarZonaPorFuenteAgua())
            }else {
                this.setState({ 
                    alertaTexto : "Relación Existente",
                    alertaColor : "danger"
                }, () => { setTimeout(this.setState.bind(this,{
                    alertaTexto : '',
                    alertaColor : ''}),5000) 
                });
            }
        });
    }

    cambiarRelacionZonaFuenteAgua = (evento) => {
        const objetoEnviado = {
            codigo : evento.target.dataset.codigo,
            fuente : evento.target.value,
            zona : evento.target.dataset.zona,
            firma : this.state.usuario.firmaDigital
        };
        promesaCambiarFuenteAguaDeRelacion( objetoEnviado ).then( respuesta => {
            if(!respuesta[0].error){ this.listarZonaPorFuenteAgua() }
        });
    }

    eliminarRelacionFuenteZona = (evento) => {
        const removerObjeto = {
            fuente : evento.target.dataset.fuente,
            zona : evento.target.dataset.zona,
            firma : this.state.usuario.firmaDigital
        };
        promesaEliminarRelacionFuenteAguaZona( removerObjeto ).then( respuesta => { 
            this.listarZonaPorFuenteAgua(); 
        });
    }

    cambiarPagina = (pagina) => {
        if(parseInt(pagina) > 0 ){ pagina = parseInt(pagina) }
        else { pagina = (parseInt(pagina.target.value) || "") }
        if(pagina <= CANTIDAD_PAGINA){ this.setState({ paginaActual: pagina }, () => this.listarZonaPorFuenteAgua()) }
    }

    redireccionar = (ruta) => { this.props.history.push(ruta) }

    componentDidMount = () => {
        if (this.state.usuario.grupo > 0) { 
            this.setState({ fuenteZonaInicioPaginado : (parseInt(this.state.paginaActual) - 1) * TAMAGNO_PAGINA }, () => {
                this.listarZonas();
                this.listarFuentesDeAgua();
                this.listarZonaPorFuenteAgua();
            });
        }// else{ this.props.history.push('/') }
    }

    render() {
        if (this.state.usuario.grupo > 0) {  
            return (
            <div className="contenedor">               
                <Paginacion
                    cantidadElementos = {this.state.zonasPorFuenteAgua.length}
                    cambiarPagina = {this.cambiarPagina}
                    paginaActual = {this.state.paginaActual}
                ></Paginacion><br />

                <div className="centrado">
                <table style={{width:'50%'}}>
                    <thead>
                        <tr>
                            <th><img src="/img/agregarRegistro.png" alt="Registrar/Agregar una Relación de Zona y Fuente" title="Registrar/Agregar una Relación de Zona y Fuente" onClick={ () => this.controlarVentanaModalAgregar()}/></th>
                            <th>Fuente de Agua&nbsp;</th>
                            <th>Zona Comercial</th>
                        </tr>
                    </thead>
                    <tbody>
                    {this.state.zonasPorFuenteAgua.map( (elemento, indice ) => (
                        <tr key={indice} className="tabla_fila">
                            <td style={{textAlign:'center'}}>
                                <img src="/img/borrarRegistro.png" onClick={this.eliminarRelacionFuenteZona} data-fuente={elemento.codigoFuente} data-zona={elemento.codigoZona} alt="Eliminar Registro" title="Elminar la relación entre una Fuente de Agua y una Zona Comercial"/>  
                            </td>
                            <td>
                                <select className="cuadro_dato" name={'fSel'+elemento.codigoFuente} id={'fSel'+elemento.codigoFuente} value={elemento.codigoFuente} onChange={this.cambiarRelacionZonaFuenteAgua} data-zona={elemento.codigoZona} data-codigo={elemento.codigoFuenteZona}>
                                {this.state.fuentesAgua.map( (fuente, nfIndice) => (
                                    <option key={nfIndice} value={fuente.codigoFuente}>{fuente.denominacionFuente}</option>
                                ))}
                                </select>
                            </td>
                            <td> 
                                { "Zona \u00A0" + numeroArabigoEnRomano(elemento.sector) + (parseInt(elemento.subSector) === 0 ? '' : " \u2014 " + numeroArabigoEnRomano(elemento.subSector)) + (elemento.microSector === '-' ? '' : " \u2014 " + elemento.microSector) } 
                            </td>
                        </tr>   
                    ))}
                    </tbody>
                </table>             
                </div>
                <div className="centrado">
                    {this.state.zonasPorFuenteAgua.length > 0 ? null : <div style={{width:"50%"}}><CuadroMensaje tipoCuadro={"basico"}>No EXISTEN datos para mostrar</CuadroMensaje></div>  }
                </div>
                {/* Inicio seccion para --- AGREGAR --- */}
                <Modal
                    mostrarModal = {this.state.mostrarVentanaAgregarModal}
                    controlModal = {this.controlarVentanaModalAgregar}
                    tituloModal = {"Registrar Fuente de Agua/Zona Comercial"}
                >
                <form noValidate onSubmit={this.agregarRelacionZonaFuente} className="una_columna">
                    { this.state.alertaTexto !==''?( <div color={this.state.alertaColor}>
                    { this.state.alertaTexto} </div> ): '' }
                    <label htmlFor="lFuentes">Fuentes de Agua</label>
                    <select name="lFuentes" id="lFuentes" required>
                        <option value="0">Seleccione una FUENTE de AGUA</option>
                        {this.state.fuentesAgua.map( (fuente, fIndice) => (
                            <option key={fIndice} value={fuente.codigoFuente}>{fuente.denominacionFuente}</option>
                        ))}
                    </select>
                    <label htmlFor="lZonas">Zonas Comerciales</label>
                    <select name="lZonas" id="lZonas" required>
                        <option value="0">Seleccione una ZONA COMERCIAL</option>
                        {this.state.zonas.map ( (zona, zIndice) => (        
                            <option key={zIndice} value={zona.codigoZona}>
                                {"Zona \u00A0" + numeroArabigoEnRomano(zona.sector) + (parseInt(zona.subSector) === 0 ? '' : " \u2014 " + numeroArabigoEnRomano(zona.subSector)) + (zona.microSector === '-' ? '' : " \u2014 " + zona.microSector)}
                            </option>
                        ))}                    
                    </select>
                    <div className="centrado">
                        <button className="boton boton_verde" type="submit">Agregar</button>
                    </div>
                </form>
                </Modal>
                {/* Final de seccion para --- AGREGAR --- */}   
            </div>
            ); // Final del RETURN
        } else { return <UsuarioNoValido /> }
    }
}

export default FuenteZona