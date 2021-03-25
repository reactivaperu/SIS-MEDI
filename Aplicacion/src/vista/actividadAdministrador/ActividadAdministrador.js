/*
-- File:             ActividadAdministrador.js
-- Project Name:     MediSeda
-- Version:          0.0.1
-- Description:      Interfaz UI para Administrar las Acitividades de Continuidad y Presion
-- Author:           Jorge Muñiz
-- Create Date:      2019-10-02
-- @Copyright        Jorge.Muñiz.Velasquez - World Connect Perú - 2019           
*/

import React, { Component } from 'react'

//IMPORTAR COMPONENTES
import ModalEliminar from "../../componentes/Modal.js";
import ModalAgregar from './ModalAgregar.js';
import Impresion from '../impresion/Impresion.js';
import ModalAsignar from './ModalAsignarOperador.js';
import ModalObservacion from './ModalObservacion.js';
import CuadroMensaje from '../../componentes/CuadroMensaje.js';
import UsuarioNoValido from '../../componentes/UsuarioNoValido.js';
import ModalAjusteImpresion from '../impresion/ModalAjusteImpresion.js';

//IMPORTAR FUNCIONES
import { promesaListarActividadBloque,generarBloqueActividad,agregarActividad,modificarActividad,cambiarHabilitadoActividad } from '../../datos/actividadDB';
import { promesaListarBloquesRegistrados } from '../../datos/bloqueDB.js';
import { registrarMedicionPresion,modificarLecturasPresion } from '../../datos/presionDB';
import { registrarMedicionContinuidad,modificarHorasContinuidad } from '../../datos/continuidadDB';
import { buscarObservacion } from '../../datos/observacionDB.js';
import { usuariosDisponibles,verificarGrupoUsuario } from '../../datos/usuarioDB';
import { cambiarPosicionDireccionDB } from '../../datos/direccionDB';

import { promesaListarBloqueImpresionPaginaActividad, promesaCantidadPagina, promesaEliminarBloqueImpresion } from '../../datos/impresionDB.js';
import { obtenerFecha,verificarEstadoActividad,listaMesesAgno,listaAgnos, dispositivoMovil} from '../../datos/funcionesSistema.js';


var fechaHoy = obtenerFecha();

const bloqueActividadInicial = {
    codigoActividad : "", // Codigo de Actividad Seleccionada
        
    codigoZona : "%", // Zona seleccionada para busqueda de actividades
    codigoUrbano : "%", // Bloque urbano si es presion
    codigoUsuario : "%", // Usuario seleccionado para busquda de actividades
    
    mesPeriodo : fechaHoy.split('-')[1],// Periodo en que se hara la actividad
    agnoPeriodo : fechaHoy.split('-')[0],// Periodo en que se hara la actividad

    denominacionZona : "", // Denominacion de la zona
    denominacionAreaServicio : "", // Denominacion de Area de Servicio
    denominacionBloque : "", // Denominacion del Bloque Urbano
    denominacionAltitud : "Alta", // denominacion de Altitud / Alta Media Baja

    nombres : "", // Nombres del Operador asignado
    apellidosPaterno : "", // Apellido Paterno del Operador Asignado
    apellidosMaterno : "", // Apellido Materno del Operador Asignado

    tipoAltitud : "3", // Tipo de Altitud 3 - Alta / 2 - Media / 1 - Baja / 0 No definido
    tipoActividad : 0, // Tipo medicion de actividades a generar -- 0 = Continuidad ... 1 = Presion

    fechaCreacion : fechaHoy, // Fecha de creacion de actividad
    fechaFinal : obtenerFecha(fechaHoy, 7), // Fecha de entrega de una actividad

    codigoObservacion: "", // Codigo de observacion seleccionado
    textoObservacion: "", // Texto de observacion seleccionado
    
    habilitado : "1",

    quien : verificarGrupoUsuario().firmaDigital // Firma digital quien hace las transacciones
}

const actividadInicial = { 
    codigoActividad : "",
    codigoUsuario : "",
    codigoZona : "",
    codigoDireccion : "",
    tipoMedicion : "0",
    fechaCreacion : fechaHoy,
    fechaFinal : fechaHoy,
    tipoInscripcion : "---",
    estadoActividad : "0",
    habilitado : "1"
};

const estadoInicial = {

    // USUARIO
    usuario : verificarGrupoUsuario(), 

    // SELECCIÓN
    actividadSeleccion : actividadInicial, // Actividad Seleccionada para editar

    // DATOS DE BLOQUE ACTIVIDADES
    bloqueActividad : bloqueActividadInicial,

    // LISTAS CON DATOS
    actividades : [], // Lista de actividades encontradas
    sugerenciasActividades : [], // Sugerencias de busqueda de actividades

    usuarios : [], // Lista de Operarios registrados y habilitados
    direcciones : [], // Lista de Direcciones habilitados
    
    bloques : [], // Lista de Bloques Urbanos habilitados para impresion
    bloquesUrbanos:[], // todos los Bloques Urbanos 
    bloquesSeleccionados:[], // Lista de ids de Bloques Urbanos habilitados para impresion

    textoActividadBuscar : "", // Texto de actividad a buscar

    paginaActual : 1, // Pagina Actual del Paginado
    actividadInicioPaginado : 1, // Inicio de Paginado de Actividades

    cantidadPaginas : 0, // Cantidad de Paginas que tendra la paginacion

    mostrarModal : false, // Indicador para abrir o cerrar el modal
    mostrarModalEliminar : false, // Indicador para abrir o cerrar modal de elimnar bloque
    mostrarModalObservacion : false, // Indicar para abrir o cerrar el modal de Observacion
    mostrarModalAsignar : false, // Indicador para abrir o cerrar el Modal para Asignar un Operador
    mostrarModalImpresion : false, // Indicador para abrir o cerrar el modal de Impresion
    mostrarModalAjusteImpresion : false // Indicador para abrir o cerrar el modal de Ajuste de Impresion    
}

export class Actividad extends Component {
    constructor(props){
        super(props);
        this.state = estadoInicial;
    }

    //METODOS DE LLENADO Y LISTADO DE DATOS
    listarUsuarios = () => {
        usuariosDisponibles().then( res => {
            this.setState({ usuarios : res });
        });
    }

    /* ES DIFERENTE DE BLOQUES DE IMPRESION */
    listarBloquesUrbanos = () => {
        promesaListarBloquesRegistrados().then(bloquesUrbanos=>{
            this.setState({ bloquesUrbanos })
        });     
    }

    listarBloquesPagina = () => {
        const Buscar={
            pagina:this.state.paginaActual,
            mes:this.state.bloqueActividad.mesPeriodo,
            agno:this.state.bloqueActividad.agnoPeriodo}
        const sugerenciasActividades = []; 
        promesaListarBloqueImpresionPaginaActividad(Buscar).then(bloques=>{
            if(!bloques.error){
                const bloquesSeleccionados = [];
                bloques[0].forEach(bloque => {
                    const Busqueda = {
                        codigoUrbano:bloque.codigoUrbano,//tipoActividad:this.props.tipoActividad,
                        mesPeriodo:this.state.bloqueActividad.mesPeriodo, agnoPeriodo:this.state.bloqueActividad.agnoPeriodo
                    }
                    bloquesSeleccionados.push(bloque.codigoUrbano);
                    promesaListarActividadBloque(Busqueda).then(actividades=>{
                        if(!actividades.error && actividades.length > 0){
                            actividades.forEach(actividad => {
                                sugerenciasActividades.push(actividad);
                            });
                            this.setState({ sugerenciasActividades });
                        }
                    })
                });
                this.setState({bloques : bloques[0], bloquesSeleccionados});
            }
        })
    }

    /* CAMBIAR POSICION DE DIRECCIONES EN IMPRESION */
    cambiarPosicionDireccion =(accion,actividad)=> {
        const { sugerenciasActividades } = this.state;
        /* OBTENER EL ULTIMO ORDEN */
        var ultimoOrdenBloque = 0;
        var actividades = sugerenciasActividades.filter(a=>a.codigoUrbano===actividad.codigoUrbano);
        actividades.forEach(a=>{ if(a.ordenBloque>ultimoOrdenBloque){ ultimoOrdenBloque = a.ordenBloque} });
        actividades.sort((a,b)=>a.ordenBloque-b.ordenBloque);
        var posicion = actividades.indexOf(actividad);

        if(accion==='subir'){
            if(actividad.ordenBloque!==1){
                /* OBTENER EL DIRECCION ARRIBA */   
                var direccionArriba = actividades[posicion-1]; //sugerenciasActividades.find(a=>a.ordenBloque===actividad.ordenBloque-1);
                const nuevaOrden = {
                    codigoDireccion1: actividad.codigoDireccion,
                    ordenDireccion1: direccionArriba.ordenBloque,
                    codigoDireccion2: direccionArriba.codigoDireccion,
                    ordenDireccion2: actividad.ordenBloque,
                }
                cambiarPosicionDireccionDB(nuevaOrden).then(res=>{
                    if(!res.error){ this.listarBloquesPagina() }
                });
            }
        }

        if(accion==='bajar'){
            if(actividad.ordenBloque!==ultimoOrdenBloque){
                /* OBTENER EL DIRECCION ABAJO */   
                var direccionAbajo = actividades[posicion+1]; //sugerenciasActividades.find(a=>a.ordenBloque===actividad.ordenBloque+1);
                const nuevaOrden = {
                    codigoDireccion1: actividad.codigoDireccion,
                    ordenDireccion1: direccionAbajo.ordenBloque,
                    codigoDireccion2: direccionAbajo.codigoDireccion,
                    ordenDireccion2: actividad.ordenBloque,
                }
                cambiarPosicionDireccionDB(nuevaOrden).then(res=>{
                    if(!res.error){ this.listarBloquesPagina() }
                });
            }
        }
    }                   

    // ========================= ACCIONES EVENTOS ==================================
    controlModalAgregar = () => {
        this.setState({ mostrarModal : !this.state.mostrarModal });
    }

    controlModalEliminar =()=> {
        this.setState({ mostrarModalEliminar : !this.state.mostrarModalEliminar });
    }

    controlModalObservacion = () => {
        this.setState({ mostrarModalObservacion : !this.state.mostrarModalObservacion });
    }

    controlModalImpresion = () => {
        this.setState({ mostrarModalImpresion : !this.state.mostrarModalImpresion })
    }

    controlModalAjusteImpresion = () => {
        this.setState({ mostrarModalAjusteImpresion : !this.state.mostrarModalAjusteImpresion })
    }

    controlModalAsignar = () => {
        this.setState({ mostrarModalAsignar : !this.state.mostrarModalAsignar });
    }

    seleccionarUsuarioActividad = (evento) => {
        const { bloqueActividad } = this.state;
        bloqueActividad["codigoUsuario"] = evento.target.value
        this.setState({ bloqueActividad });
    }

    seleccionarSectorActividad =(evento)=> {
        const { bloquesSeleccionados } = this.state;
        let pos = bloquesSeleccionados.indexOf(parseInt(evento.target.value));
        if(pos<0){
            bloquesSeleccionados.push(parseInt(evento.target.value));
            this.setState({ bloquesSeleccionados })
        } else {
            bloquesSeleccionados.splice(pos,1);
            this.setState({ bloquesSeleccionados });
        }
    }

    seleccionarFechaFinalActividad = (evento) => {
        const { bloqueActividad } = this.state;
        bloqueActividad["fechaFinal"] = evento.target.value;
        this.setState({ bloqueActividad });
    }

    seleccionDatosActividad = (evento) => {
        evento.preventDefault();
        const { bloqueActividad } = this.state;
        if(evento.target.id === "habilitar"){
            bloqueActividad["habilitado"] = ! bloqueActividad.habilitado;
        }else{
            bloqueActividad[evento.target.id] = evento.target.value
        }
        this.setState({ bloqueActividad });
    }

    seleccionarActividad = (Actividad) => {
        if(Actividad){
            const { bloqueActividad } = this.state;
            bloqueActividad["codigoUsuario"] = Actividad.codigoUsuario;
            bloqueActividad["codigoDireccion"] = Actividad.codigoDireccion;
            bloqueActividad["denominacionLote"] = Actividad.denominacionLote;
            bloqueActividad["denominacionBloque"] = Actividad.denominacionBloque;
            bloqueActividad["fechaCreacion"] = Actividad.fechaCreacion;
            
            bloqueActividad["codigoActividadPresion"] = Actividad.codigoActividadPresion;
            bloqueActividad["codigoActividadContinuidad"] = Actividad.codigoActividadContinuidad;
            
            bloqueActividad["codigoPresion"] = Actividad.codigoPresion;
            bloqueActividad["codigoContinuidad"] = Actividad.codigoContinuidad;

            bloqueActividad["lecturaArriba"] = Actividad.lecturaArriba;
            bloqueActividad["lecturaAbajo"] = Actividad.lecturaAbajo;

            bloqueActividad["lecturaArribaAnterior"] = Actividad.lecturaArribaAnterior||'sin datos';
            bloqueActividad["lecturaAbajoAnterior"] = Actividad.lecturaAbajoAnterior||'sin datos';

            bloqueActividad["r1HoraDe"] = Actividad.r1HoraDe;
            bloqueActividad["r1HoraA"] = Actividad.r1HoraA;
            bloqueActividad["r2HoraDe"] = Actividad.r2HoraDe;
            bloqueActividad["r2HoraA"] = Actividad.r2HoraA;

            bloqueActividad["r1HoraDeAnterior"] = Actividad.r1HoraDeAnterior||'sin datos';
            bloqueActividad["r1HoraAAnterior"] = Actividad.r1HoraAAnterior||'sin datos';
            bloqueActividad["r2HoraDeAnterior"] = Actividad.r2HoraDeAnterior||'sin datos';
            bloqueActividad["r2HoraAAnterior"] = Actividad.r2HoraAAnterior||'sin datos';

            bloqueActividad["habilitado"] =  Actividad.habilitado;
            if(Actividad.fechaFinal){
                bloqueActividad["fechaFinal"] = Actividad.fechaFinal;
            }else{ bloqueActividad["fechaFinal"] = obtenerFecha(fechaHoy , 0) }
            this.setState({ bloqueActividad, mostrarModal : !this.state.mostrarModal});    
        }
    }

    guardarActividad = (evento) => {
        evento.preventDefault();
        // SI NO TIENE CODIGO ACTIVIDAD
        const { bloqueActividad } = this.state;
        const presion = {
            codigoActividad:bloqueActividad.codigoActividadPresion,
            lecturaArriba:bloqueActividad.lecturaArriba,
            lecturaAbajo:bloqueActividad.lecturaAbajo,
            quien : this.state.usuario.firmaDigital
        }
        const continuidad = {
            codigoActividad : bloqueActividad.codigoActividadContinuidad,
            r1HoraDe : bloqueActividad.r1HoraDe,
            r1HoraA : bloqueActividad.r1HoraA,
            r2HoraDe : bloqueActividad.r2HoraDe,
            r2HoraA : bloqueActividad.r2HoraA,
            quien : this.state.usuario.firmaDigital
        }
        if(bloqueActividad.codigoPresion === "Sin datos"){
            registrarMedicionPresion(presion).then(_=>{});
        }else{
            modificarLecturasPresion(presion).then(_=>{});                
        }
        if(bloqueActividad.codigoContinuidad === "Sin datos"){
            registrarMedicionContinuidad(continuidad).then(_=>{});
        }else{
            modificarHorasContinuidad(continuidad).then(_=>{});
        }
        
        [0,1].forEach(tipoActividad=> {
            var nuevaActividad = {
                codigoActividad:tipoActividad?bloqueActividad.codigoActividadPresion:bloqueActividad.codigoActividadContinuidad,
                codigoUsuario:(bloqueActividad.codigoUsuario||0),
                codigoDireccion:bloqueActividad.codigoDireccion,
                fechaCreacion:fechaHoy,
                fechaFinal:bloqueActividad.fechaFinal,
                habilitado:true,
                mesPeriodo:bloqueActividad.mesPeriodo,
                agnoPeriodo:bloqueActividad.agnoPeriodo,
                tipoActividad:tipoActividad,
                quien:this.state.usuario.firmaDigital
            };
            if(nuevaActividad.codigoActividad === null || nuevaActividad.codigoActividad === "" || nuevaActividad.codigoActividad === undefined ){ // Nueva Actividad
                agregarActividad(nuevaActividad).then(_ => this.listarBloquesPagina());
            }else{ // Editar Actividad
                modificarActividad(nuevaActividad).then(_ => this.listarBloquesPagina());
            }
        });
        
        this.controlModalAgregar();
    }

    verObservacion = (actividad) => {
        buscarObservacion(actividad.codigoActividadPresion).then(res => {
            if(!res.error){
                actividad["codigoObservacion"] = res.codigoObservacion;
                actividad["textoObservacion"] = res.textoObservacion;
                actividad["denominacionAreaServicio"] = this.state.bloqueActividad.denominacionAreaServicio;
                actividad["denominacionBloque"] = this.state.bloqueActividad.denominacionBloque;
                this.setState({ actividadSeleccion : actividad });
                this.controlModalObservacion();
            }
        });
    }

    asignarOperadorBloque = (evento) => {
        evento.preventDefault();
        const { bloqueActividad, bloquesSeleccionados, paginaActual } = this.state;
        var {cantidadPaginas} = this.state;
        var bloquesGenerados = 0;
        if(bloqueActividad.codigoUsuario !== "0" && bloqueActividad.codigoUsuario !== "%"){
            const bloqueEliminar = {
                paginaImpresion:paginaActual,
                mesPeriodo: bloqueActividad.mesPeriodo,
                agnoPeriodo: bloqueActividad.agnoPeriodo};
            promesaEliminarBloqueImpresion(bloqueEliminar).then(res=>{
                if(!res.error){
                    bloquesSeleccionados.forEach((bloque,i)=> {
                        const Bloque = {
                            codigoUsuario: bloqueActividad.codigoUsuario,
                            codigoUrbano: bloque,
                            mesPeriodo: bloqueActividad.mesPeriodo,
                            agnoPeriodo: bloqueActividad.agnoPeriodo,
                            paginaImpresion:paginaActual,
                            ordenImpresion:i+1,
                            fechaFinal: bloqueActividad.fechaFinal,
                            quien: this.state.usuario.firmaDigital
                        };
                        setTimeout(()=>{
                            generarBloqueActividad(Bloque).then(_=>{
                                if(!_.error){
                                    bloquesGenerados=bloquesGenerados+1
                                    if(bloquesGenerados === (bloquesSeleccionados.length)){
                                        const actividadPeriodo = {agno:bloqueActividad.agnoPeriodo,mes:bloqueActividad.mesPeriodo}
                                        promesaCantidadPagina(actividadPeriodo).then(paginas=>{
                                            if(!paginas.error){cantidadPaginas = paginas.paginas}
                                            this.setState({ cantidadPaginas },() => {
                                                this.controlModalAsignar();this.listarBloquesPagina()
                                            });
                                        });
                                    }
                                }
                            });
                        }, i * 750);
                    });
                }
            });            
        }else{ alert("Operador no Seleccionado") }
    }

    eliminarBloquePagina =()=> {
        const {paginaActual,bloqueActividad} = this.state;
        var {cantidadPaginas} = this.state;
        const bloqueEliminar = { paginaImpresion:paginaActual,mesPeriodo:bloqueActividad.mesPeriodo,agnoPeriodo:bloqueActividad.agnoPeriodo};
        promesaEliminarBloqueImpresion(bloqueEliminar).then(res=>{
            if(!res.error){
                const actividadPeriodo = {agno:bloqueActividad.agnoPeriodo,mes:bloqueActividad.mesPeriodo}
                promesaCantidadPagina(actividadPeriodo).then(paginas=>{
                    if(!paginas.error){cantidadPaginas = paginas.paginas}
                    this.setState({ cantidadPaginas,paginaActual:1 },() => {
                        this.controlModalEliminar(); this.listarBloquesPagina();
                    });
                });
            }
            else { alert("No se puedo eliminar el bloque, vuelva a intentarlo"); this.controlModalEliminar(); }
        });
    }

    cambiarPeriodo = (evento) => {
        const { bloqueActividad } = this.state;
        bloqueActividad[evento.target.id] = evento.target.value;
        this.setState({ bloqueActividad },() => { this.listarBloquesPagina() });
    }

    habilitarActividad = (actividad) => {
        if(actividad.codigoActividad === null){
            var nuevaActividad = {
                codigoUsuario:(actividad.codigoUsuario||0),
                codigoDireccion:actividad.codigoDireccion,
                fechaCreacion:fechaHoy,
                fechaFinal:fechaHoy,
                habilitado:true,
                mesPeriodo:this.state.bloqueActividad.mesPeriodo,
                agnoPeriodo:this.state.bloqueActividad.agnoPeriodo,
                tipoActividad:this.state.bloqueActividad.tipoActividad,
                quien:this.state.usuario.firmaDigital
            };
            agregarActividad(nuevaActividad).then(_=>this.listarBloquesPagina());
        }else{
            const actividadHabilitado = { 
                codigoActividad : actividad.codigoActividad, 
                habilitado : !actividad.habilitado,
                quien : this.state.usuario.firmaDigital }
            cambiarHabilitadoActividad(actividadHabilitado).then(_=>this.listarBloquesPagina());
        }
    }

    cambiarPagina = (pagina) => {
        if(parseInt(pagina) >= 0 ){ pagina = parseInt(pagina) }
        else { pagina = (parseInt(pagina.target.value) || 0) }
        if(pagina > 0 && pagina <= this.state.cantidadPaginas+1){
            this.setState({ paginaActual: pagina },()=>this.listarBloquesPagina());
        }
    }

    componentDidMount(){
        if(this.state.usuario.grupo > 0){
            const { bloqueActividad } = this.state;
            var {cantidadPaginas} = this.state;
            bloqueActividad["tipoActividad"] = this.props.tipoActividad;
            const actividadPeriodo = {agno:bloqueActividad.agnoPeriodo,mes:bloqueActividad.mesPeriodo}
            promesaCantidadPagina(actividadPeriodo).then(paginas=>{if(!paginas.error){cantidadPaginas=paginas.paginas}
                this.setState({ bloqueActividad, cantidadPaginas },() => {
                    this.listarUsuarios();
                    this.listarBloquesUrbanos();
                    this.listarBloquesPagina();
                });
            });
        }// else{ this.props.history.push('/') }
    }

    render() {
        if(this.state.usuario.grupo > 0){
        return(
            <div className="contenedor">
                <div className="centrado">
                    <br/>
                    <div id="tituloActividades" className="navegador_titulo">
                        {/*ENCUESTA DE {this.props.tipoActividad?"PRESIÓN":"CONTINUIDAD"} DEL SERVICIO POR ZONA DE ABASTECIMIENTO*/}
                        ENCUESTA DE PRESIÓN Y CONTINUIDAD DEL SERVICIO POR ZONA DE ABASTECIMIENTO
                    </div>
                </div>
                <br></br>
                <div className="centrado">
                    <div>
                        <select className="cuadro_dato" style={{fontSize:"20px"}} onChange={this.cambiarPeriodo} id="mesPeriodo" value={this.state.bloqueActividad.mesPeriodo}>
                        { listaMesesAgno.map(mes => ( 
                            <option value={mes.letra} key={mes.numero}>{mes.nombre}</option>
                        ))}
                        </select>
                        &nbsp; &mdash; &nbsp;
                        <select className="cuadro_dato" style={{fontSize:"20px"}} onChange={this.cambiarPeriodo} value={this.state.bloqueActividad.agnoPeriodo} id="agnoPeriodo">
                        {listaAgnos.map((agno,key) => ( 
                            <option value={agno} key={key}>{agno}</option>
                        ))}
                        </select>
                    </div>
                </div>
                <div hidden={true}>
                    <label id="periodoActividades">{(listaMesesAgno[parseInt(this.state.bloqueActividad.mesPeriodo||1)-1].nombre||"") + " - " + this.state.bloqueActividad.agnoPeriodo}</label> 
                </div>
                <br/>
                <div className="buscador_actividad">
                    <div className="buscador_actividad_impresion">
                        <div className="buscador_actividad_impresion_boton">
                            <button className="boton boton_azul" onClick={() => this.controlModalAsignar()}
                            ><img src="/img/agregarUsuario.png" style={{width:"40px",margin:"3px"}} alt="Asignar Operador" title="Asignar Operador"/><br/>Asignar Operador</button>

                            <button className="boton boton_rojo" onClick={() => this.controlModalImpresion()}
                            ><img src="/img/pdf.png" style={{width:"45px",margin:"3px"}} alt="Asignar Operador" title="Asignar Operador"/><br/>Imprimir Actividades</button>
                        </div>
                        <div className="paginado_impresion">
                            <div className="centrado">
                                <div className="paginado">
                                    <button className="boton boton_azul" style={{fontSize:"15px"}} onClick={()=>this.cambiarPagina(this.state.paginaActual - 1)} title="Página anterior">&larr;</button>
                                    <div>
                                        <input style={{textAlign:'center',border:'none',fontSize:"1em",width:"35px"}} size={2} type="number" value={this.state.paginaActual} 
                                                min="1" pattern="[0-9]*" name="pagina_" id="pagina_" title={'Número de Página : ' + this.state.paginaActual} 
                                                onChange={(e)=>this.cambiarPagina(e)} 
                                        />/{this.state.cantidadPaginas}
                                    </div>
                                    <button className="boton boton_azul" style={{fontSize:"15px"}} onClick={()=>this.cambiarPagina(this.state.paginaActual + 1)} title="Página siguiente">&rarr;</button> 
                                </div>
                            </div>
                            <button hidden={true} className="boton" style={{fontSize:"15px"}} onClick={()=>this.controlModalAjusteImpresion()}>{"\u2699"}</button>
                        </div>
                        <div className="paginado_eliminar">
                            <div onClick={()=>this.controlModalEliminar()} className="boton boton_rojo">Eliminar</div>
                        </div>
                    </div>
                </div>
                <br />           
                <div className="centrado">
                <table style={ { width : dispositivoMovil()?'100%':'70%' }} className="tabla_actividad">
                    <thead>
                        <tr>
                            <th hidden={true}></th>
                            <th></th>
                            <th>Dirección/Lote</th>
                            <th hidden={dispositivoMovil()}>Codigo Inscripción</th>
                            <th hidden={dispositivoMovil()}>Fecha de Entrega</th>
                            <th hidden={dispositivoMovil()}>Estado</th>
                            <th>Operador</th>
                            <th>Obs.</th>
                        </tr>
                    </thead>
                    {(this.state.bloques||[]).map((bloque,i) => {
                        return ( 
                        <tbody key={bloque.codigoUrbano+"-"+i}>
                            <tr><td colSpan={7} style={{textAlign:'center',padding:"10px", fontSize:"20px"}}>
                                <b> { bloque.denominacionBloque.toUpperCase()} - SECTOR ({bloque.codigoUrbano})</b>
                            </td></tr>
                            {(this.state.sugerenciasActividades.filter(a=>a.codigoUrbano===bloque.codigoUrbano)
                            .sort((a1,a2)=>{return a1.ordenBloque-a2.ordenBloque}).map((actividad,i)=>{
                            var estadoActividad = verificarEstadoActividad(actividad.estadoActividadPresion, actividad.estadoActividadContinuidad,actividad.fechaFinal); // Para verificar el estado de la actividad
                            return(
                                <tr key={actividad.codigoDireccion+"-"+i} style={{cursor:"pointer"}} className="tabla_fila">   
                                    <td hidden={true} style={{textAlign:'center'}}>
                                        <label className="boton_habilitado">
                                            <input type='checkbox' id='habilitado' defaultChecked={true} /*onChange = {(e)=>{this.habilitarActividad(actividad)}}*//>
                                            <div className="boton_deslizar redondo"></div>
                                        </label>
                                    </td>
                                    <td style={{textAlign:'center'}}>
                                        <div className="boton_position">
                                            <div onClick={()=>this.cambiarPosicionDireccion('subir',actividad)} title="Subir una casilla">&#9650;</div>
                                            <div onClick={()=>this.cambiarPosicionDireccion('bajar',actividad)} title="Bajar una casilla">&#9660;</div>
                                        </div>
                                    </td>
                                    <td onClick={() => this.seleccionarActividad(actividad)}>{ "("+actividad.ordenBloque+")  "+actividad.denominacionLote }</td>    
                                    <td hidden={dispositivoMovil()} style={{textAlign:'center'}} onClick={()=>this.seleccionarActividad(actividad)}>{ actividad.codigoInscripcion }</td>                     
                                    
                                    <td hidden={dispositivoMovil()} style={{textAlign:'center'}} onClick={()=>this.seleccionarActividad(actividad)}> {actividad.fechaFinal? <div className={"cuadro_mensaje "+(estadoActividad.cuadro)} style={{color:estadoActividad.colorFecha}}>{actividad.fechaFinal}</div> : <img src="/img/vacio.png" alt="Datos sin Programar" title="Datos Sin Programar"/>}</td>       
                                    <td hidden={dispositivoMovil()} style={{textAlign:'center'}} onClick={() => this.seleccionarActividad(actividad)}>{actividad.estadoActividadPresion!==null?<div style={{color:estadoActividad.colorAvance}}>{estadoActividad.mensaje}</div>:<img src="/img/vacio.png" alt="Datos sin Programar" title="Datos Sin Programar"/>}</td>
                                    
                                    <td colSpan={actividad.observacion?1:2} style={{textAlign:'center'}} onClick={() => this.seleccionarActividad(actividad)}><b>{actividad.codigoActividadPresion?(actividad.codigoUsuario ? actividad.nombres + " " + actividad.apellidosPaterno : 
                                        <img src="/img/agregarUsuario.png" alt="Asignar Operador" title="Asignar Operador"/>) :
                                        <img src="/img/vacio.png" alt="Datos sin Programar" title="Datos Sin Programar"/> }</b>
                                    </td>
                                    <td style={{textAlign:'center',cursor:'pointer'}}>{ actividad.observacion ?
                                        <img src="/img/lupaVer.png" alt="Ver Observación" title="Ver Observación" onClick={()=>this.verObservacion(actividad)}/>:null  }
                                    </td>
                                </tr>)
                            }))
                            }
                        </tbody>
                    )})}
                </table>
                </div>


                <div className="centrado">
                    {this.state.sugerenciasActividades.length > 0 ? null : <div style={{width:"70%"}}><CuadroMensaje tipoCuadro={"basico"}>No EXISTEN datos para mostrar</CuadroMensaje></div>  }
                </div>

                <ModalEliminar mostrarModal={this.state.mostrarModalEliminar} controlModal={this.controlModalEliminar} tituloModal={"Eliminar Bloque"}>
                    <div className="modal_eliminar">
                        <label>La pagina será eliminada!.. Los datos de actividades se mantienen.</label>
                        <div className="dos_columnas">
                            <div className="boton boton_rojo" onClick={()=>this.controlModalEliminar()}>Cancelar</div>
                            <div className="boton boton_verde" onClick={()=>this.eliminarBloquePagina()}>Continuar</div>
                        </div>
                    </div>
                </ModalEliminar>

                <ModalAgregar
                    actividad = {this.state.bloqueActividad}
                    tipoActividad={this.props.tipoActividad}
                    usuarios = {this.state.usuarios}
                    direcciones = {this.state.direcciones}
                    mostrarModal = {this.state.mostrarModal}
                    controlModalAgregar = {this.controlModalAgregar}
                    seleccionDatosActividad = {this.seleccionDatosActividad}
                    guardarActividad = {this.guardarActividad}
                ></ModalAgregar>
                
                <ModalObservacion
                    actividad={this.state.actividadSeleccion}
                    controlModalObservacion={this.controlModalObservacion}
                    mostrarModalObservacion={this.state.mostrarModalObservacion}
                ></ModalObservacion>

                <ModalAsignar
                    usuarios={this.state.usuarios}
                    bloques={this.state.bloquesUrbanos}
                    bloquesSeleccionados={this.state.bloquesSeleccionados}
                    actividad={this.state.bloqueActividad}
                    tipoActividad={this.props.tipoActividad}
                    mostrarModalAsignar={this.state.mostrarModalAsignar}
                    controlModalAsignar={this.controlModalAsignar}
                    asignarOperadorBloque={this.asignarOperadorBloque}
                    seleccionarUsuarioActividad = {this.seleccionarUsuarioActividad}
                    seleccionarSectorActividad = {this.seleccionarSectorActividad}
                    seleccionarFechaFinalActividad = {this.seleccionarFechaFinalActividad}
                ></ModalAsignar>
                
                <Impresion
                    controlModalImpresion={this.controlModalImpresion}
                    mostrarModalImpresion={this.state.mostrarModalImpresion}
                    paginaActual={this.state.paginaActual}
                    cantidadPaginas={this.state.cantidadPaginas}
                    mesPeriodo={this.state.bloqueActividad.mesPeriodo}
                    agnoPeriodo={this.state.bloqueActividad.agnoPeriodo}
                    tipoActividad={this.props.tipoActividad}
                ></Impresion>

                <ModalAjusteImpresion
                    controlModalAjusteImpresion={this.controlModalAjusteImpresion}
                    mostrarModalAjusteImpresion={this.state.mostrarModalAjusteImpresion}
                ></ModalAjusteImpresion>
            </div>
        )}else { return <UsuarioNoValido /> }
    }
}

export default Actividad;