import React, { Component } from 'react';
import { verificarGrupoUsuario } from '../../datos/usuarioDB.js';
import { numeroArabigoEnRomano } from '../../datos/funcionesSistema';
import { promesaListarZonasComponente } from '../../datos/zonaDB.js';
import { promesaListarBloquesRegistrados, promesaListarBloquesPorZona } from '../../datos/bloqueDB.js';

import { promesaListarTodoDirecciones,
         promesaListarDireccionesPaginado,
         promesaAgregarDireccion,
         promesaDeshabilitarDireccion,
         promesaHabilitarDireccion, 
         promesaModificarNombreDireccion, 
         promesaModificarZonaDireccion,
         promesaModificarBloqueUrbanoDireccion,
         promesaModificarAltitudDireccion,
         promesaImportarArchivo } from '../../datos/direccionDB.js';

// ---- COMPONENTES -----
import Paginacion, { CANTIDAD_PAGINA, TAMAGNO_PAGINA } from "../../componentes/Paginacion.js";
import UsuarioNoValido from '../../componentes/UsuarioNoValido.js';
import CuadroMensaje from '../../componentes/CuadroMensaje.js';
import Modal from "../../componentes/Modal.js";

export class Direccion extends Component {

    constructor(propiedades) { 
        super(propiedades); 
        this.state = {
            usuario : verificarGrupoUsuario(),
            zonas : [],
            direcciones : [],
            bloques : [],
            bloquesZona : [],

            zonaConsultada : 1,   // Zona con el codigoZona 1 ???
            nombreZonaConsultada : '',
            
            paginaActual : 1,
            direccionInicioPaginado : 1,
            
            codigoDireccionSeleccionada : 0,
            denominacionDireccionSeleccionada : '',
            inscripcionDireccionSeleccionada : '',
            referenciaDireccion : 0,
            medirContinuidad : 0,
            medirPresion : 0,

            todoDirecciones:[],

            mostrarVentanaModalAgregar : false,
            mostrarVentanaModalEditar : false,

            mostrarVentanaModalArchivo : false,

            archivoCSV : null,
            nombreArchivo : "Seleccione un archivo (.csv)",
        };
    }

    listarZonas = () => {
        promesaListarZonasComponente().then( respuesta => { 
            this.setState({ zonas : respuesta }); 
        });
    }

    listarBloquesUrbanos = () => {
        promesaListarBloquesRegistrados().then(bloques=>this.setState({ bloques }));     
    }

    listarBloquesPorZona = (codigoZona) => {
        promesaListarBloquesPorZona({zona:codigoZona}).then(bloquesZona => {
            if(!bloquesZona.error){ this.setState({bloquesZona}) }
        });
    }

    listaDirecciones = ( ) => {
        this.setState({ direccionInicioPaginado : (parseInt(this.state.paginaActual) - 1) * TAMAGNO_PAGINA }
        , () => {
            promesaListarDireccionesPaginado({ 
                inicio : this.state.direccionInicioPaginado, 
                resultados : TAMAGNO_PAGINA
            }).then( respuesta => { this.setState({ direcciones : respuesta }); } )
        });
    }

    listarTodoDirecciones =()=> {
        promesaListarTodoDirecciones().then(res=>{
            if(!res.error){this.setState({todoDirecciones:res})}
        })
    }

    cambiarZonaRegistro = (evento) => {
        this.listarBloquesPorZona(evento.target.value);
    }

    cambiarZona = (evento) => {
        this.setState({ zonaConsultada : evento.target.value }, () => {
            this.listaDirecciones();    
        });        
    }
    
    controlarVentanaModalAgregar = () => {
        this.setState({
            mostrarVentanaModalAgregar : !this.state.mostrarVentanaModalAgregar
        });
    }
    
    controlarVentanaModalEditar = () => {
        this.setState({
            mostrarVentanaModalEditar : !this.state.mostrarVentanaModalEditar
        });
    }

    controlVentanaModalArchivo = () => {
        if(this.state.mostrarVentanaModalArchivo){
            this.setState({ archivoCSV : null , nombreArchivo : "Seleccione un archivo (.csv)" });
        }
        this.setState({ mostrarVentanaModalArchivo: !this.state.mostrarVentanaModalArchivo });
    }
    
    seleccionarDireccion = (elemento) => {
        this.setState({
            codigoDireccionSeleccionada : elemento.codigoDireccion,
            denominacionDireccionSeleccionada : elemento.denominacionLote,
            inscripcionDireccionSeleccionada : elemento.codigoInscripcion,
            hRedSeleccionada: elemento.hRed,
            referenciaDireccion : elemento.referenciaDireccion,
            medirContinuidad : elemento.medirContinuidad,
            medirPresion : elemento.medirPresion,
            mostrarVentanaModalEditar : !this.state.mostrarVentanaModalEditar
        });
    }

    seleccionarArchivo = (evento) => {
        const archivo = evento.target.files[0];
        this.setState({ archivoCSV: archivo , nombreArchivo: archivo.name });
    }

    importarArchivo = (evento) => {
        evento.preventDefault();
        if(this.state.archivoCSV !== null){
            promesaImportarArchivo(this.state.archivoCSV).then(respuesta => {
                if(respuesta){
                    this.listaDirecciones();
                    this.controlVentanaModalArchivo()
                }else{ alert("Error al importar Archivo...") }
            });
        }else{ alert("Seleccione un archivo") }
    }
    
    agregarNuevaDireccion = (evento) => {
        evento.preventDefault();
        const objetoNuevo = {
            zona : document.getElementById('zn_Agregar_').value,
            bloque : document.getElementById('bu_Agregar_').value, 
            denominacion : document.getElementById('nmbZn_Agregar_').value,
            altitud : document.getElementById('alt_Agregar_').value,
            inscripcion : document.getElementById('cdI_Agregar_').value,
            continuidad : document.getElementById('cont_Agregar_').checked?1:0,
            presion : document.getElementById('pres_Agregar_').checked?1:0,
            hred : document.getElementById('hRed_Agregar_').value,
            firma : this.state.usuario.firmaDigital
        };
        promesaAgregarDireccion( objetoNuevo ).then(_ => {
            console.log(objetoNuevo);
            console.log(_);
            this.setState({ mostrarVentanaModalAgregar : false });
            this.listaDirecciones();  
        });
    }   

    cambiarEstadoDireccion = (evento) => {
        const estaHabilitado = parseInt(evento.target.value);
        this.setState( { codigoDireccionSeleccionada : parseInt(evento.target.name) }, () => { 
            const objetoEnviado = {
                codigo : this.state.codigoDireccionSeleccionada,
                firma : this.state.usuario.firmaDigital
            };
            if (estaHabilitado === 1) {
                promesaDeshabilitarDireccion( objetoEnviado ).then( respuesta => { 
                    this.listaDirecciones();
                });
            } else {        
                promesaHabilitarDireccion( objetoEnviado ).then( respuesta => { 
                    this.listaDirecciones();
                });
            }
        });
    }
    
    modificarNombreDireccion = (evento) => {
        evento.preventDefault();
        this.setState({ mostrarVentanaModalEditar : false }, () => {
            const objetoModificado = {
                codigo : this.state.codigoDireccionSeleccionada, 
                denominacion : this.state.denominacionDireccionSeleccionada,
                inscripcion : this.state.inscripcionDireccionSeleccionada,
                hred : this.state.hRedSeleccionada,
                referencia: this.state.referenciaDireccion,
                continuidad: this.state.medirContinuidad,
                presion: this.state.medirPresion,
                firma : this.state.usuario.firmaDigital
            };
            promesaModificarNombreDireccion( objetoModificado ).then( respuesta => {
                this.listaDirecciones();  
            }); 
        });
    }

    cambiarZonaDireccion = (evento) => {
        const jsonModificado = {
            codigo : evento.target.dataset.direccion,
            zona : evento.target.options[evento.target.selectedIndex].value,
            firma :  this.state.usuario.firmaDigital
        }
        promesaModificarZonaDireccion( jsonModificado ).then( respuesta => {
            this.listaDirecciones();
        }); 
    }

    cambiarBloqueUrbano = (evento) => {
        const jsonModificado = {
            codigo : evento.target.dataset.direccion,
            bloque : evento.target.options[evento.target.selectedIndex].value,
            firma :  this.state.usuario.firmaDigital
        }
        promesaModificarBloqueUrbanoDireccion( jsonModificado ).then( respuesta => {
            this.listaDirecciones();
        }); 
    } 

    cambiarAltitud = (evento) => {
        const jsonModificado = {
            codigo : evento.target.dataset.direccion,
            altitud : evento.target.options[evento.target.selectedIndex].value,
            firma :  this.state.usuario.firmaDigital
        }
        promesaModificarAltitudDireccion( jsonModificado ).then( respuesta => {
            this.listaDirecciones();
        }); 
    }

    cambiarPagina = (pagina) => {
        if(parseInt(pagina) > 0 ){ pagina = parseInt(pagina) }
        else { pagina = (parseInt(pagina.target.value) || "") }
        if(pagina <= CANTIDAD_PAGINA){ this.setState({ paginaActual: pagina }, () => this.listaDirecciones()) }
    }

    redireccionar = (ruta) => { this.props.history.push(ruta) }

    componentDidMount() { 
        if (this.state.usuario.grupo > 0) {
            this.setState({ direccionInicioPaginado : (parseInt(this.state.paginaActual) - 1) * TAMAGNO_PAGINA }, () => { 
                this.listarZonas();
                this.listarBloquesUrbanos();
                this.listaDirecciones();
                this.listarTodoDirecciones();
            });
        }// else{ this.props.history.push('/') }
    }
    
    render() {
        /* SI ES ADMINISTRADOR O GERENTE */
        if (this.state.usuario.grupo > 0) {
            return (
                <div className="contenedor">
                    <Paginacion
                        cantidadElementos = {this.state.direcciones.length}
                        cambiarPagina = {this.cambiarPagina}
                        paginaActual = {this.state.paginaActual}
                    ></Paginacion><br />
                    <div className="centrado">
                        <button className="boton boton_verde" onClick={this.controlVentanaModalArchivo}>Importar</button>
                    </div>
                    <br />
                    <div className="centrado">
                        <table style={{width:'90%'}}>
                            <thead>
                                <tr>
                                    <th><img src="/img/agregarRegistro.png" alt="Registrar/Agregar una Nueva Dirección" title="Registrar/Agregar una Nueva Dirección" onClick={ () => this.controlarVentanaModalAgregar()}/></th>
                                    <th> Zona Comercial</th>
                                    <th> Bloque Urbano </th>
                                    <th> Denominación relativa a una dirección </th>
                                    <th> Altitud </th>
                                    <th> Inscripción </th>
                                    <th> H=RED </th>
                                </tr>
                            </thead>
                            <tbody>
                            {this.state.direcciones.map(elemento=> (
                                <tr key={elemento.codigoDireccion} data-id={elemento.codigoDireccion} className="tabla_fila">
                                    <td style={{textAlign:'center'}}>
                                        <label className="boton_habilitado">
                                            <input type="checkbox" onChange={this.cambiarEstadoDireccion} 
                                            checked={ parseInt(elemento.habilitado) === 1 ? true : false } value={ parseInt(elemento.habilitado) === 1 ? 1 : 0 } 
                                            name={ elemento.codigoDireccion } id={'chkBox' + elemento.codigoDireccion } />
                                            <div className="boton_deslizar redondo"></div>
                                        </label>
                                    </td>
                                    <td style={{textAlign:'center'}}>
                                        <select className="cuadro_dato" name={'zona_' + elemento.codigoDireccion} id={'zona_'+elemento.codigoDireccion} value={elemento.codigoZona} data-direccion={elemento.codigoDireccion} onChange={this.cambiarZonaDireccion}>
                                            <option value="0"> Seleccionar Zona </option>
                                            {(this.state.zonas || []).map( (elemento, indice) => ( 
                                                <option key={indice} value={elemento.codigoZona}> {"Zona \u00A0" + numeroArabigoEnRomano(elemento.sector) + (parseInt(elemento.subSector) === 0 ? '' : " \u2014 " + numeroArabigoEnRomano(elemento.subSector)) + (elemento.microSector === '-' ? '' : " \u2014 " + elemento.microSector)} </option> 
                                            ))}
                                        </select>
                                    </td>
                                    <td style={{textAlign:'center'}}>
                                        <select className="cuadro_dato" value={elemento.codigoUrbano} name={'bloque_'+elemento.codigoDireccion} id={'bloque_'+elemento.codigoDireccion} data-direccion={elemento.codigoDireccion} onChange={this.cambiarBloqueUrbano}>
                                            <option value="0"> Seleccionar Bloque Urbano</option>
                                            {(this.state.bloques || []).map(bloque => (
                                                <option key={bloque.codigoUrbano} value={bloque.codigoUrbano}> { bloque.denominacionBloque.toUpperCase() } </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td onClick={() => {this.seleccionarDireccion(elemento)}}>
                                        {elemento.denominacionLote}
                                    </td>
                                    <td style={{textAlign:'center'}}>
                                        <select className="cuadro_dato" value={elemento.tipoAltitud} name={'altitud_'+elemento.codigoDireccion } id={'altitud_'+elemento.codigoDireccion } data-direccion={elemento.codigoDireccion} onChange={this.cambiarAltitud}>
                                            <option value="0">Altitud</option>
                                            <option value="3">Alta</option>
                                            <option value="2">Media</option>
                                            <option value="1">Baja</option>
                                        </select>
                                    </td>
                                    <td style={{textAlign:'center'}} onClick={() => {this.seleccionarDireccion(elemento)}}>
                                        {elemento.codigoInscripcion}
                                    </td>
                                    <td style={{textAlign:'center'}} onClick={() => {this.seleccionarDireccion(elemento)}}>
                                        {elemento.hRed}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="centrado">
                        {this.state.direcciones.length > 0 ? null : <div style={{width:"90%"}}><CuadroMensaje tipoCuadro={"basico"}>No EXISTEN datos para mostrar</CuadroMensaje></div>  }
                    </div>
                    <Modal
                        mostrarModal = {this.state.mostrarVentanaModalAgregar}
                        controlModal = {this.controlarVentanaModalAgregar}
                        tituloModal = {"Nueva Dirección"}
                    >
                    <form noValidate onSubmit={this.agregarNuevaDireccion} className="una_columna">
                        <label htmlFor="bu_Agregar_">Zona Asignada:</label>
                        <select className="cuadro_dato" name="zn_Agregar_" id="zn_Agregar_" onChange={this.cambiarZonaRegistro}>
                            <option value="0"> Seleccionar Zona </option>
                            {(this.state.zonas || []).map( (elemento, indice) => ( 
                                <option key={indice} value={elemento.codigoZona}> {"Zona \u00A0" + numeroArabigoEnRomano(elemento.sector) + (parseInt(elemento.subSector) === 0 ? '' : " \u2014 " + numeroArabigoEnRomano(elemento.subSector)) + (elemento.microSector === '-' ? '' : " \u2014 " + elemento.microSector)}</option>
                            ))}
                        </select>

                        <label htmlFor="bu_Agregar_">Bloque Urbano:</label>
                        <select className="cuadro_dato" name="bu_Agregar_" id="bu_Agregar_" required>
                            <option value="0"> Seleccionar Bloque Urbano</option>
                            {(this.state.bloquesZona || []).map( (bloque, indice_n1) => (
                                <option key={indice_n1} value={bloque.codigoUrbano}> { bloque.denominacionBloque } </option>
                            ))}
                        </select>
                        <label htmlFor="alt_Agregar_">Tipo de Altitud:</label>
                        <select className="cuadro_dato" name="alt_Agregar_" id="alt_Agregar_" required>
                                <option value="0">Seleccionar Altitud</option>
                                <option value="3">Alta</option>
                                <option value="2">Media</option>
                                <option value="1">Baja</option>
                        </select>   
                        <label htmlFor="nmbZn_Agregar_">Denominación de Dirección:</label>
                        <input className="cuadro_dato" type="text" size={40} name="nmbZn_Agregar_" id="nmbZn_Agregar_" />
                        <label htmlFor="cdI_Agregar_">Código de Inscripción:</label>
                        <input className="cuadro_dato" type="text" size={40} name="cdI_Agregar_" id="cdI_Agregar_" />
                        <label htmlFor="hRed_Agregar_">H=RED:</label>
                        <input className="cuadro_dato" type="number" name="hRed_Agregar_" id="hRed_Agregar_" />
                        <label htmlFor="cont_Agregar_">Reporte para Continuidad &nbsp;
                            <input type="checkbox" name="cont_Agregar_" id="cont_Agregar_"/>
                        </label>
                        <label htmlFor="pres_Agregar_">Reporte para Presion &nbsp;
                            <input type="checkbox" name="pres_Agregar_" id="pres_Agregar_"/>
                        </label>
                        <div className="centrado">
                            <button className="boton boton_verde" type="submit">Agregar</button>
                        </div>                          
                    </form>
                    </Modal>
                                                            
                    <Modal
                        mostrarModal = {this.state.mostrarVentanaModalEditar}
                        controlModal = {this.controlarVentanaModalEditar}
                        tituloModal = {"Modificar la Denominación de la Dirección"}
                    >
                    <form noValidate onSubmit={this.modificarNombreDireccion} className="una_columna">
                        
                        <label htmlFor="nombreZonaModificado_">Denominación de una dirección</label>
                        <input className="cuadro_dato" type="text" size={50} name="nombreZonaModificado_" id="nombreZonaModificado_" value={ this.state.denominacionDireccionSeleccionada } onChange={ evento => this.setState({ denominacionDireccionSeleccionada : evento.target.value })}/>
                        
                        <label htmlFor="inscripcion_edtr_">Código de Inscripción</label>
                        <input className="cuadro_dato" type="text" size={50} name="inscripcion_edtr_" id="inscripcion_edtr_" value={this.state.inscripcionDireccionSeleccionada} onChange={evento => this.setState({ inscripcionDireccionSeleccionada : evento.target.value }) }/>
                        
                        <label htmlFor="hRed_edtr_">H=RED:</label>
                        <input className="cuadro_dato" type="text" size={40} name="hRed_edtr_" id="hRed_edtr_" value={this.state.hRedSeleccionada} onChange={evento => this.setState({ hRedSeleccionada : evento.target.value }) }/>

                        <label htmlFor="direccion_ref">Direccion de Referencia</label>
                        <select className="cuadro_dato" 
                            value={this.state.referenciaDireccion}
                            onChange={evento=>this.setState({referenciaDireccion:evento.target.value})}>
                            {(this.state.todoDirecciones||[]).map((dir,i)=>
                                <option key={i} value={dir.codigoDireccion}>{dir.denominacionLote}</option>)}
                        </select>
                        
                        <label htmlFor="medir_cont">Reporte para Continuidad &nbsp;
                            <input type="checkbox" name="medir_cont" id="medir_cont"
                                checked={this.state.medirContinuidad===1?true:false} 
                                onChange={e=>{
                                    this.setState({medirContinuidad:this.state.medirContinuidad===0?1:0})
                                }}
                            />
                        </label>

                        <label htmlFor="medir_pres">Reporte para Presion &nbsp;
                            <input type="checkbox" name="medir_pres" id="medir_pres"
                                checked={this.state.medirPresion===1?true:false} 
                                onChange={e=>this.setState({medirPresion:this.state.medirPresion===0?1:0})}
                            />
                        </label>

                        <div className="centrado">
                            <button className="boton boton_verde" type="submit">Actualizar</button>
                        </div>
                    </form>
                    </Modal>
                    
                    <Modal
                        mostrarModal = {this.state.mostrarVentanaModalArchivo}
                        controlModal = {this.controlVentanaModalArchivo}
                        tituloModal = {"Importar MS Excel CSV"}
                    >
                    <form noValidate onSubmit={this.importarArchivo} className="una_columna">
                        <div className="cuadro_archivo">
                            <input style={{opacity:"0"}} type="file" id="archivoDireccion" lang="es" onChange={e=>this.seleccionarArchivo(e)} accept=".csv"/>
                            <label className="cuadro_archivo_nombre" htmlFor="archivoDireccion">{ this.state.nombreArchivo}</label>
                        </div>
                        <div className="centrado">
                            <button className="boton boton_verde" type="submit">Importar</button>
                        </div>
                    </form>
                    </Modal>
                </div>
            ); // Final del Render
        } else { return <UsuarioNoValido /> }
    }
}

export default Direccion