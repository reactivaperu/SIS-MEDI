import React, { Component } from 'react';
import XLSX from 'xlsx';
import { verificarGrupoUsuario } from '../../datos/usuarioDB.js';
import { numeroArabigoEnRomano , obtenerFecha,listaMesesAgno } from '../../datos/funcionesSistema';
import { promesaListarTotalConexiones,
         promesaRegistrarTotalConexiones,
         promesaImportarTotalConexiones,
         promesaModificarTotalConexiones } from '../../datos/conexionDB.js';

// COMPONENTES
import UsuarioNoValido from '../../componentes/UsuarioNoValido.js';
import CuadroMensaje from '../../componentes/CuadroMensaje.js';
import Modal from "../../componentes/Modal.js";
var fechaHoy = obtenerFecha();
const estadoInicial = {
    usuario : verificarGrupoUsuario(),
    zonas : [],
    listaTotalConexiones : [],
    
    identificadorZona : 3, // La primera ZONA por defecto
    tieneConexiones : 1, // La primera ZONA tiene conexiones

    agnoPeriodo : fechaHoy.split('-')[0],// Periodo en que se hara la actividad
    mesPeriodo : fechaHoy.split('-')[1],// Periodo en que se hara la actividad
    meses : ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre' ,'diciembre'],
    agnos : ["2018","2019","2020","2021","2022","2023","2024","2025"], // Lista de agnos del Periodo por Defecto 

    codigoTotalConexion : 0,
    mesSeleccionado : parseInt(new Date().getMonth()) + 1,
    agnoSeleccionado : parseInt(new Date().getFullYear()),
    totalConexionesSeleccionado : 0, 

    mostrarVentanaModalRegistrar : false,  
    mensajeTexto : '',

    mostrarVentanaModalArchivo : false,
    archivoCSV : null,
    nombreArchivo : "Seleccione un archivo (.csv)",
}
export class Conexion extends Component {

    constructor(props) { 
        super(props);
        this.state = estadoInicial;
    }
    
    listarTotalConexiones = () => {
        const Busqueda = { mes : this.state.mesPeriodo, agno : this.state.agnoPeriodo  }
        promesaListarTotalConexiones( Busqueda ).then(respuesta => {
            if(!respuesta.error){ this.setState({ listaTotalConexiones : respuesta }) }            
        });
    }

    controlVentanaModalRegistrar = () => {
        if(this.state.mostrarVentanaModalRegistrar){ // SI LA VENTANA ESTA ACTIVA
            this.setState({ 
                codigoTotalConexion : 0,
                mesSeleccionado : parseInt(new Date().getMonth()) + 1,
                agnoSeleccionado : parseInt(new Date().getFullYear()),
                totalConexionesSeleccionado : 0,
                mostrarVentanaModalRegistrar : false
            });
        }else{
            if(this.state.tieneConexiones){ this.setState({ mostrarVentanaModalRegistrar : true }) }
            else{ alert("NO SE PUEDE AGREGAR DATOS (Zona NO habilitada para registrar Conexiones)") }
        }
    }
    
    controlAlertaModalRegistrar = (texto) => {
        this.setState({mensajeTexto:texto},()=>{setTimeout(this.setState.bind(this,estadoInicial),5000) });
    }

    controlVentanaModalArchivo = () => {
        if(this.state.mostrarVentanaModalArchivo){
            this.setState({ archivoCSV : null , nombreArchivo : "Seleccione un archivo (.csv)" });
        }
        this.setState({ mostrarVentanaModalArchivo: !this.state.mostrarVentanaModalArchivo });
    }

    seleccionarArchivo = (evento) => {
        const archivo = evento.target.files[0];
        this.setState({ archivoCSV: archivo , nombreArchivo: archivo.name });
    }

    importarArchivo = (evento) => {
        evento.preventDefault();
        const { archivoCSV } = this.state;
        if(archivoCSV !== null){
            let fileReader = new FileReader();
            fileReader.readAsBinaryString(archivoCSV);
            fileReader.onload =(e)=>{
                let data = e.target.result;
                let workbook = XLSX.read(data,{type:'binary'});
                var paginaConexiones = workbook.SheetNames.filter(s=>s.toLowerCase()==='conexiones')[0];
                if(paginaConexiones){
                    let datos = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[paginaConexiones]);
                    this.verificarDatosExcel(datos);
                } else { 
                    alert("El archivo seleccionado no tiene la hoja CONEXIONES, agregela y vuelva a intentar!.");
                    this.controlVentanaModalArchivo();
                }
            }
        }else{ alert("Seleccione un archivo") } 
    }    

    verificarDatosExcel =(datos)=> {
        if(datos[0].SECTOR && datos[0].CONEX){
            var Dato = this.obtenerDatosExcel(datos);
            const Importar={datos:Dato,mes:this.state.mesPeriodo,agno:this.state.agnoPeriodo}
            promesaImportarTotalConexiones(Importar).then(res=>{
                console.log(res);
                if(res.mensaje){this.listarTotalConexiones();this.controlVentanaModalArchivo();}
            });
        } else { 
            alert("CAMBIE EL FORMADO DE LAS COLUMAS [ SECTOR , CONEX ]");
            this.controlVentanaModalArchivo(); 
        }
    }

    verificarZonaDato =(Sector)=> {
        const { listaTotalConexiones } = this.state;
        var codigoTotalConexion = 0;
        (listaTotalConexiones||[]).forEach(l=>{
            var zon = "ZONA "+numeroArabigoEnRomano(l.sector)+(parseInt(l.subSector)===0?'':"-"+numeroArabigoEnRomano(l.subSector))+(l.microSector==='-'?'':"-"+l.microSector);
            if(Sector===zon){ codigoTotalConexion = l.codigoZona }
        });
        return codigoTotalConexion;
    }

    obtenerDatosExcel =(datos)=>{
        const { mesPeriodo,agnoPeriodo } = this.state;
        var Dato = [];
        (datos||[]).forEach(d => {
            var conexion = [this.verificarZonaDato(d.SECTOR),mesPeriodo,agnoPeriodo,d.CONEX,0];
            Dato.push(conexion)
        });
        return Dato;
    }

    registrarTotalConexion = (evento) => {
        evento.preventDefault();
        const nuevoTotalConexion = {
            codigo : this.state.codigoTotalConexion,
            zona : this.state.codigoZonaSeleccionado,
            mes : this.state.mesPeriodo,
            agno : this.state.agnoPeriodo,
            conexiones : document.getElementById('totalConexionesSeleccionado').value,
            quien : this.state.usuario.firmaDigital
        }
        if(parseInt(this.state.codigoTotalConexion)>0){ //SI EXISTE REGISTRO, SE MODIFICARA
            promesaModificarTotalConexiones(nuevoTotalConexion).then(respuesta => {
                if(!respuesta[0].error){ this.setState({ mostrarVentanaModalRegistrar : false }, () => this.listarTotalConexiones())}
                else { this.controlAlertaModalRegistrar("Registros Existente") }
            });
        }else { //NO EXISTE REGISTRO, SE REGISTRARA
            promesaRegistrarTotalConexiones(nuevoTotalConexion).then(respuesta => {
                if(!respuesta[0].error){ this.setState({ mostrarVentanaModalRegistrar : false }, () => this.listarTotalConexiones())}
                else { this.controlAlertaModalRegistrar("Registro Existente") }
            });
        }
    }

    modificarTotalConexiones = (zona,codigo, mes, agno, conexiones) => {
        this.setState({
            codigoZonaSeleccionado: zona,
            codigoTotalConexion : codigo,
            mesSeleccionado : mes,
            agnoSeleccionado : agno,
            totalConexionesSeleccionado : conexiones,
            mostrarVentanaModalRegistrar : !this.state.mostrarVentanaModalRegistrar
        });
    }

    cambiarPeriodo = (evento) => this.setState({ [evento.target.id]: evento.target.value },() => this.listarTotalConexiones());

    componentDidMount() {
        if (this.state.usuario.grupo > 0) { 
            this.listarTotalConexiones();
        }// else{ this.props.history.push('/') }
    }

    render() {
        if (this.state.usuario.grupo > 0) { 
            return (
            <div className="contenedor">                
                <div className="centrado" style={{alignItems:'center'}}>
                    <div>
                        <select className="cuadro_dato" style={{fontSize:"20px"}} onChange={this.cambiarPeriodo} value={this.state.agnoPeriodo} id="agnoPeriodo" >
                        { this.state.agnos.map((agno,i) => ( 
                            <option value={agno} key={i}>{agno}</option>
                        ))}
                        </select>
                        &nbsp; &mdash; &nbsp;
                        <select className="cuadro_dato" style={{fontSize:"20px"}} onChange={this.cambiarPeriodo} value={this.state.mesPeriodo} id="mesPeriodo">
                        {listaMesesAgno.map((mes,key) => ( 
                            <option value={mes.letra} key={key}>{mes.nombre}</option>
                        ))}
                        </select>
                    </div>
                </div>
                <br/>
                <div className="centrado">
                    <button className="boton boton_verde" onClick={this.controlVentanaModalArchivo}>Importar</button>
                </div>
                <br />
                <div className="centrado">
                <table style={{width:"30%"}}>      
                    <thead>
                        <tr style={{textAlign:'center'}}>
                            <th>SECTOR</th>
                            <th>CONEXIONES</th>
                        </tr> 
                    </thead>                         
                    <tbody>

                    {this.state.listaTotalConexiones.map ((conexion,i) => (
                        <tr key={i} className="tabla_fila">
                            <td style={{textAlign:'left'}}>
                                {"Zona \u00A0"+numeroArabigoEnRomano(conexion.sector)+(parseInt(conexion.subSector)===0?'':" \u2014 "+numeroArabigoEnRomano(conexion.subSector))+(conexion.microSector==='-'?'':" \u2014 "+conexion.microSector)}
                            </td> 
                            <td style={{textAlign:'center', fontSize:'20pt'}} onClick={() => this.modificarTotalConexiones(conexion.codigoZona,conexion.codigoTotalConexion,conexion.mes,conexion.agno,conexion.numeroConexiones)}>
                                {conexion.numeroConexiones }
                            </td> 
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
                <div className="centrado">
                    {this.state.listaTotalConexiones.length > 0 ? null : <div style={{width:"30%"}}><CuadroMensaje tipoCuadro={"basico"}>No EXISTEN datos para mostrar</CuadroMensaje></div>  }
                </div>
                {/* Inicio seccion para --- REGISTAR --- */}
                <Modal
                    mostrarModal = {this.state.mostrarVentanaModalRegistrar}
                    controlModal = {this.controlVentanaModalRegistrar}
                    tituloModal = {"Registrar Total de Conexiones"}
                >
                <form noValidate onSubmit={this.registrarTotalConexion}>
                    { this.state.mensajeTexto.length < 1 ? null:
                    <div className="centrado">
                        <div style={{width:"100%"}}><CuadroMensaje tipoCuadro={"peligro"}>{this.state.mensajeTexto}</CuadroMensaje></div>
                    </div>}
                    <br/>
                    <label htmlFor="mesSeleccionado">Mes/año de Registro :</label>&nbsp; 
                    <select className="cuadro_dato" name="mesSeleccionado" id="mesSeleccionado" defaultValue={this.state.mesSeleccionado}>
                        {this.state.meses.map( (mes, mIndice) => (
                            <option key={mIndice} value={(mIndice+1) < 10 ? '0'+(mIndice+1) : (mIndice+1)}>{mes}</option> 
                        ))}
                    </select> / <input className="cuadro_dato" type="number" name="agnoSeleccionado" id="agnoSeleccionado" pattern="[0-9]*" min="2018" style={{ width:"4em" }} defaultValue={parseInt(this.state.agnoSeleccionado)}/><br /><br />
                    <label htmlFor="conexiones">Total de Conexiones :</label>&nbsp;
                    <input className="cuadro_dato" type="number" min="0" name="totalConexionesSeleccionado" id="totalConexionesSeleccionado" defaultValue={ this.state.totalConexionesSeleccionado }/>
                    <br /> <br />
                    <div className="centrado">
                        <button className="boton boton_verde" type="submit">Registrar</button>
                    </div>
                </form>
                </Modal>
                {/* Final de seccion para --- REGISTRAR --- */}

                <Modal
                    mostrarModal = {this.state.mostrarVentanaModalArchivo}
                    controlModal = {this.controlVentanaModalArchivo}
                    tituloModal = {"Importar MS Excel CSV"}
                >
                <form noValidate onSubmit={this.importarArchivo} className="una_columna">
                    <div className="cuadro_archivo">
                        <input style={{opacity:"0"}} type="file" id="archivoDireccion" lang="es" onChange={e=>this.seleccionarArchivo(e)} accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
                        <label className="cuadro_archivo_nombre" htmlFor="archivoDireccion">{ this.state.nombreArchivo}</label>
                    </div>
                    <div className="centrado">
                        <button className="boton boton_verde" type="submit">Importar</button>
                    </div>
                </form>
                </Modal>
            </div>  
            )
        } else { return <UsuarioNoValido /> } 
    }
}

export default Conexion