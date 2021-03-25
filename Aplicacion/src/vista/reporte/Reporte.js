import React, {Component} from 'react';
import { verificarGrupoUsuario } from '../../datos/usuarioDB.js';
import { obtenerCodigoTipoAltitud,numeroArabigoEnRomano } from '../../datos/funcionesSistema';
import { promesaListarZonasComponente} from '../../datos/zonaDB.js';

import { reporteEncuestaContinuidad,reporteEncuestaPresion,reporteComercial} from '../../datos/reporteDB';
import { totalHoraZonaAltitudContinuidad } from '../../datos/continuidadDB.js';
import { promesaTotalConexionesActivasZonaAltitud } from '../../datos/conexionDB';

// IMPORTACION DE COMPONENTES
import UsuarioNoValido from '../../componentes/UsuarioNoValido.js';
import ModalDescargarArchivo from '../../componentes/DescargaArchivo.js';

import TablaReporteComercial from './TablaReporteComercial';

import TablaReporteEncuestaPresion from './TablaReporteEncuestaPresion';
import TablaReporteEncuestaContinuidad from './TablaReporteEncuestaContinuidad';

import TablaReporteResumenPresion from './TablaReporteResumenPresion';
import TablaReporteResumenContinuidad from './TablaReporteResumenContinuidad';

import TablaReporteResumenPresion10y50Mca from './TablaReporteResumenPresion10y50Mca';
import TablaReporteResumenContinuidad6y18Hrs from './TablaReporteResumenContinuidad6y18Hrs';

var mesActual = parseInt(new Date().getMonth()) + 1;
var agnoActual = parseInt(new Date().getFullYear());

const estadoInicial = {

    mostrarReporte : false,
    mostrarDescargaArchivo : false,

    usuario : verificarGrupoUsuario(),
    zonas : [], // Lista de Zonas

    zonaReporte : "%",
    urbanoReporte : "%",
    altitudReporte : "%",
    mesReporte : mesActual,
    agnoReporte : agnoActual,
    
    agnos : [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026],
    mesesAgno : ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre' ,'Diciembre'],
    tiposAltitud : ['Alta','Media','Baja','Sin Especificar'],
    
    cantidadZonas : 0,
    cantidadPuntosMedidos : 0,
    cantidadPuntosRegistrados : 0,

    tipoReporte : "1",
    tituloReporte : [
        'REPORTE NO ENCONTRADO', // REPORTE N° 0
        
        'ENCUESTA DE PRESIONES DEL SERVICIO POR ZONA DE ABASTECIMIENTO',
        'ENCUESTA DE CONTINUIDADES DEL SERVICIO POR ZONA DE ABASTECIMIENTO',

        'PRESIÓN DE SERVICIO',
        'CONTINUIDAD DE HORAS DE SERVICIO',

        'RESUMEN DE PRESION 10 y 50 MCA',
        'RESUMEN DE CONTINUIDAD 06 Y 18 HRS',
        
        'REPORTE CONTINUIDAD COMERCIAL',
    ],

    documento: {
        nombreArchivo : "",
        contenido : "",
        orientacion : "",
        idTabla : "",
    },

    actividadContinuidades:[], // Lista de Actividades de Continuidad
    actividadPresiones:[], // Lista de Actividades de Presion

    promedioPresiones : [], // Lista de Promedios de Presiones
    promedioPonderados : [], // Lista de Promedios Ponderados

    comercialResumen : [], // Lista de Resumen de Continuidad y Presion para Comercial

}

export class ReportePresion extends Component{
    constructor(props){
        super(props);
        this.state = estadoInicial;
    }

    mostrarReporte = () => { this.setState({ mostrarReporte : !this.state.mostrarReporte }) }

    mostrarDescargaArchivo = () => {

        this.generarInformacionDocumento(this.state.comercialResumen);
        this.setState({ mostrarDescargaArchivo : !this.state.mostrarDescargaArchivo })
    }

    cambiarMesReporte = (evento) => {
        this.setState({ mesReporte : evento.target.value, mostrarReporte : false },() => this.generarReporte());
    }

    cambiarAgnoReporte = (evento) => {
        this.setState({ agnoReporte : evento.target.value, mostrarReporte : false },() => this.generarReporte());
    }

    cambiarTipoReporte = (evento) => {
        this.setState({ tipoReporte : evento.target.value, mostrarReporte : false });
    }

    // --->>>>>>> REPORTE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    generarReporte = () => {
        var cantidadZonas = 0;
        const BusquedaEncuesta = {
            codigoZona : this.state.zonaReporte,
            codigoUrbano : this.state.urbanoReporte,
            tipoAltitud : this.state.altitudReporte,
            mesPeriodo : this.state.mesReporte,
            agnoPeriodo : this.state.agnoReporte,
        }
        promesaListarZonasComponente().then(zonas => {
            zonas.filter(z=>{return z.esSector}).forEach(_=>{cantidadZonas=cantidadZonas+1});
            this.generarReporteContinuidad(zonas,BusquedaEncuesta);
            this.generarReportePresion(zonas,BusquedaEncuesta);
            this.generarReporteComercial(BusquedaEncuesta);
            this.setState({ zonas, cantidadZonas });
        });
    };

    generarInformacionDocumento = (comercialResumen) => {
        var { documento } = this.state;

        switch (this.state.tipoReporte) {
            case "1":
                documento.nombreArchivo = "ReportePresionEncuesta";
                documento.idTabla = "tablaReportePresionEncuesta";
                documento.orientacion = "landscape";    
            break;
            case "2":
                documento.nombreArchivo = "ReporteContinuidadEncuesta";
                documento.idTabla = "tablaReporteContinuidadEncuesta";
                documento.orientacion = "landscape";
            break;
            case "3":
                documento.nombreArchivo = "ReporteResumenPresion";
                documento.idTabla = "tablaReporteResumenPresion";
                documento.orientacion = "landscape";
            break;
            case "4":                
                documento.nombreArchivo = "ReporteResumenContinuidad";
                documento.idTabla = "tablaReporteResumenContinuidad";
                documento.orientacion = "landscape";
            break;
            case "5":                
                documento.nombreArchivo = "ReporteResumenPresion10y50Mca";
                documento.idTabla = "reporteResumenPresion10y50Mca";
                documento.orientacion = "landscape";
            break;
            case "6":                
                documento.nombreArchivo = "ReporteResumenContinuidad6y18Hrs";
                documento.idTabla = "reporteResumenContinuidad6y18Hrs";
                documento.orientacion = "landscape";
            break;
            case "7":                
                documento.nombreArchivo = "ReporteResumenComercial";
                documento.idTabla = "tablaReporteResumenComercial";
                documento.contenido = "N°;DENOMINACION_ZONA;SECTOR;CODF;FUENTE;CONEX;HORA;ESTADO\n";
                documento.orientacion = "portrait";
                comercialResumen.map((c,i) =>  documento.contenido = documento.contenido + 
                    (i+1)+";"+numeroArabigoEnRomano(c.sector) + (parseInt(c.subSector) === 0 ? '':" \u2014 " + numeroArabigoEnRomano(c.subSector)) + (c.microSector === '-' ? '':" \u2014 "+c.microSector)+";"+ 
                    c.sector+";"+c.codigoFuente+";"+c.numeroConexiones+";"+c.promedioHora+";"+c.habilitado + "\n" )
            break;
            default:
                break;
        }
        this.setState({ documento });
    }

    verificarRegistrosCompletos = (continuidades) => {
        var datosVacios = 0;
        continuidades.map( continuidad => {
            if(continuidad.codigoContinuidad === 'sin datos'){ datosVacios = datosVacios + 1;}
            return 0;
        });
        return continuidades.length - datosVacios;
    }

    // ---------->>>>> PRESION >>>>>>>>>>>>>>>>>>>>
    generarReportePresion = (Zonas, BusquedaEncuesta) => {
        //generarReporte = (presiones) => {
        var actividadPresiones = [];
        var promedioPresiones = [];
        reporteEncuestaPresion(BusquedaEncuesta).then(presiones => { if(presiones.length > 0){
            Zonas.filter(zona => { 
                if(this.state.zonaReporte === "%" ){ return zona.esSector }
                else { return zona.esSector && zona.codigoZona.toString() === this.state.zonaReporte }
            }).forEach(zonaSector => {
                this.state.tiposAltitud.filter(altitud => {
                    if(this.state.altitudReporte === "%"){ return obtenerCodigoTipoAltitud(altitud) !== 0 }
                    else { return obtenerCodigoTipoAltitud(altitud).toString() === this.state.altitudReporte }   
                })
                .forEach(altitud => {
                    var tipoAltitud = obtenerCodigoTipoAltitud(altitud);
                    Zonas.forEach( z => {
                        if(zonaSector.sector === 1){
                            if(z.sector === zonaSector.sector && z.subSector === zonaSector.subSector ){
                                const actividades = this.insertarPromedioZonaAltitud(presiones,z.codigoZona,zonaSector.codigoZona,tipoAltitud)
                                actividades.forEach(actividad => { actividadPresiones.push(actividad) });
                            }
                        }else{
                            if(z.sector === zonaSector.sector){
                                const actividades = this.insertarPromedioZonaAltitud(presiones,z.codigoZona,zonaSector.codigoZona,tipoAltitud)
                                actividades.forEach(actividad => { actividadPresiones.push(actividad) });                        
                            }
                        }
                    });
                    const Busqueda = {
                        codigoZona : zonaSector.codigoZona,
                        tipoAltitud : tipoAltitud,
                        mesPeriodo : this.state.mesReporte,
                        agnoPeriodo : this.state.agnoReporte,
                    }
                    promesaTotalConexionesActivasZonaAltitud(Busqueda).then(conexion => {
                        const promedioPresionZonaAltitud = this.insertarTotalConexionesActivas(actividadPresiones,zonaSector.codigoZona,tipoAltitud,(conexion.conexionesActivas ||0 ))
                        promedioPresiones.push(promedioPresionZonaAltitud);
                    });
                });
            });
            this.setState({ actividadPresiones: actividadPresiones, promedioPresiones: promedioPresiones });
        }});
    }

    insertarTotalConexionesActivas = (actividadPresiones, codigoZonaReporte, tipoAltitud, conexionesActivas ) => {

        var promedioPresionAltitud = 0;
        var cantidadPresionAltitud = 0;

        actividadPresiones.map(presion => {
            if(presion.codigoZonaReporte === codigoZonaReporte && presion.tipoAltitud === tipoAltitud){           
                promedioPresionAltitud = promedioPresionAltitud + presion.promedioPresion;
                cantidadPresionAltitud = cantidadPresionAltitud + 1;
            }
            return 0;
        });

        var promedio  = (promedioPresionAltitud / cantidadPresionAltitud) || 0;

        var producto = promedio * conexionesActivas;

        const promedioPresion = {
            promedio : promedio,
            conexionesActivas : conexionesActivas,
            producto : producto,
            codigoZona : codigoZonaReporte,
            tipoAltitud : tipoAltitud,
        };
        

        return promedioPresion ;
    }

    insertarPromedioZonaAltitud = (presiones, codigoZona, codigoZonaReporte, tipoAltitud ) => {
        const actividades = [];
        var decimalMultiplicador = 0.703;

        presiones.map(presion => {
            if(presion.codigoZona === codigoZona && presion.tipoAltitud === tipoAltitud){
                               
                var promedioPresion = (presion.lecturaAbajo * decimalMultiplicador) + presion.hRed;

                presion["promedioPresion"] = promedioPresion;
                presion["codigoZonaReporte"] = codigoZonaReporte;

                actividades.push(presion);
            }
            return 0;
        });
       return actividades ;
    }

    // ---------->>>>> CONTINUINUIDAD >>>>>>>>>>>>>>>>>>>>
    generarReporteContinuidad = (Zonas, BusquedaEncuesta) => {
        var actividadContinuidades = [];
        var promedioPonderados = [];   

        reporteEncuestaContinuidad(BusquedaEncuesta).then(continuidades => {
            if(!continuidades.error){
            Zonas.filter(z=>{return z.esSector}).forEach(zonaSector=>{
                this.state.tiposAltitud.filter(altitud=>{return obtenerCodigoTipoAltitud(altitud)!==0})
                .forEach(altitud => {
                    var tipoAltitud = obtenerCodigoTipoAltitud(altitud);
                    const Busqueda = {
                        codigoZona : zonaSector.codigoZona,
                        codigoUrbano : "%",
                        tipoAltitud : tipoAltitud,
                        mesPeriodo : this.state.mesReporte,
                        agnoPeriodo : this.state.agnoReporte,
                    };
                    totalHoraZonaAltitudContinuidad(Busqueda).then(promedio => {
                        Zonas.forEach(z=>{
                            if(zonaSector.sector === 1){
                                if(z.sector === zonaSector.sector && z.subSector === zonaSector.subSector ){
                                    const actividades = this.insertarPonderado(continuidades,z.codigoZona,zonaSector.codigoZona,tipoAltitud,promedio.promedioHora)
                                    actividades.forEach(actividad => { actividadContinuidades.push(actividad) });
                            }
                            }else{
                                if(z.sector === zonaSector.sector){
                                    const actividades = this.insertarPonderado(continuidades,z.codigoZona,zonaSector.codigoZona,tipoAltitud,promedio.promedioHora)
                                    actividades.forEach(actividad => { actividadContinuidades.push(actividad) });
                                }
                            }
                        });
                        promedio = this.calcularPromedios(promedio);
                        promedio["codigoZona"] = zonaSector.codigoZona;
                        promedio["tipoAltitud"] = tipoAltitud;
                        promedioPonderados.push(promedio);
                    })
                });
            });
            this.setState({ actividadContinuidades,cantidadPuntosRegistrados:continuidades.length,cantidadPuntosMedidos:this.verificarRegistrosCompletos(continuidades),promedioPonderados }) 
            }
        });
    }

    calcularPromedios = ( promedio ) => {
        var hora = parseFloat((promedio.promedioHora || "00:00").substring(0,2));
        var minuto = parseFloat((promedio.promedioHora || "00:00").substring(3,5));
        var representa = parseFloat((minuto / 60).toFixed(2));

        var contProm = (hora + representa);
        var producto = parseFloat((contProm * promedio.conexionesActivas).toFixed(6));

        promedio["hora"] = hora;
        promedio["minuto"] = minuto;
        promedio["representa"] = representa;
        promedio["contProm"] = contProm;
        promedio["producto"] = producto;

        return promedio;
    }

    insertarPonderado = (continuidades, codigoZona, codigoZonaReporte, tipoAltitud, promedioPonderado) => {
        const actividades = [];
        continuidades.map(continuidad => {
            if(continuidad.codigoZona === codigoZona && continuidad.tipoAltitud === tipoAltitud){
                continuidad["promedioHora"] = promedioPonderado;
                continuidad["codigoZonaReporte"] = codigoZonaReporte;
                actividades.push(continuidad);
            }
            return 0;
        });
        return actividades;
    }

    // --------->>>>> COMERCIAL >>>>>>>>>>>>>>>>>>>>>>>>>
    generarReporteComercial = (BusquedaEncuesta) => {
        reporteComercial(BusquedaEncuesta).then(comercialResumen=>{
            if(!comercialResumen.error){
                this.setState({comercialResumen});
            }
        });
    }

    // ---------->>>> INICIALIZACION >>>>>>>>>>>>>>>>>>>>
    componentDidMount(){
        if(this.state.usuario.grupo > 0) {
            this.generarReporte();
        }// else{ this.props.history.push('/') }
    }

    render(){
        if(this.state.usuario.grupo > 0){
        return(
            <div className="contenedor">
                <div className="centrado">
                    <div className="buscador_actividad_reporte">
                        <div className="centrado">
                            <div>
                                <select className="cuadro_dato" value={this.state.mesReporte} onChange={this.cambiarMesReporte}>
                                    { this.state.mesesAgno.map( (mes, indice) => ( <option key={indice} value={indice + 1}> {mes} </option> ) ) }
                                </select> 
                                &nbsp; &mdash; &nbsp;
                                <select className="cuadro_dato" value={this.state.agnoReporte} onChange={this.cambiarAgnoReporte}>
                                    { this.state.agnos.map((a, indice) => <option key={indice} value={a}>{a}</option> )}
                                </select>
                            </div>
                        </div>
                        <select className="cuadro_dato" value={this.state.tipoReporte} onChange={this.cambiarTipoReporte}>
                            <option value="1">Encuesta de Presiones</option>
                            <option value="2">Encuesta de Continuidad</option>

                            <option value="3">Resumen de Presion</option>
                            <option value="4">Resumen de Continuidad</option>

                            <option hidden={true} value="5">Resumen de Presion 10 y 50 MCA</option>
                            <option hidden={true} value="6">Resumen de Continuidad 06 y 18 Hrs</option>

                            <option value="7">Reporte Continuidad Comercial</option>
                        </select>
                    </div>
                </div> 
                <br />
                <div className="centrado">
                    <div className="cuadro_mensaje informacion">
                        <div><b>Resumen de Reporte</b></div>
                        <hr />
                        <p>Zonas: {this.state.cantidadZonas}</p>
                        <p>Puntos Registrados: {this.state.cantidadPuntosRegistrados}</p>
                        <p>Puntos Medidos: {this.state.cantidadPuntosMedidos}</p>                                
                        <div hidden = {this.state.cantidadPuntosRegistrados < 1} className="dos_columnas">
                            <button className="boton boton_verde" onClick={this.mostrarReporte}>Generar<br/>Reporte</button>
                            <button className={"boton "+(!this.state.mostrarReporte?"boton_rojo":"boton_verde")} onClick={this.mostrarDescargaArchivo} disabled={ !this.state.mostrarReporte }>Descargar<br/>Reporte</button>
                        </div>
                    </div>
                </div>
                <hr />   
                <h2 style={{textAlign:'center'}}>{this.state.tituloReporte[this.state.tipoReporte]}<br />{this.state.mesesAgno[this.state.mesReporte-1]}, {this.state.agnoReporte}</h2> 
                
                <ModalDescargarArchivo
                    titulo = {""}
                    mensaje = {"Escoja el tipo de Documento que se Descargara"}
                    mostrarDescargaArchivo = { this.state.mostrarDescargaArchivo }
                    controlDescargaArchivo = { this.mostrarDescargaArchivo }
                    documento = { this.state.documento }
                    tipoReporte = { this.state.tipoReporte }
                />

                {/* REPORTE N° 1*/}
                <TablaReporteEncuestaPresion
                    mostrarReporte = {this.state.mostrarReporte}
                    zonas = {this.state.zonas}
                    tiposAltitud = {this.state.tiposAltitud}
                    zonaReporte = {this.state.zonaReporte}
                    altitudReporte = {this.state.altitudReporte}
                    actividadPresiones = {this.state.actividadPresiones}
                    tipoReporte = {this.state.tipoReporte}
                />

                {/* REPORTE N° 2 */}
                <TablaReporteEncuestaContinuidad
                    mostrarReporte = {this.state.mostrarReporte}
                    zonas = {this.state.zonas}
                    tiposAltitud = {this.state.tiposAltitud}
                    zonaReporte = {this.state.zonaReporte}
                    altitudReporte = {this.state.altitudReporte}
                    actividadContinuidades = {this.state.actividadContinuidades}
                    tipoReporte = {this.state.tipoReporte}
                />
                {/* REPORTE N° 3 */}
                <TablaReporteResumenPresion
                    mostrarReporte = {this.state.mostrarReporte}
                    promedioPresiones = {this.state.promedioPresiones}
                    zonas = {this.state.zonas}
                    zonaReporte = {this.state.zonaReporte}
                    tipoReporte = {this.state.tipoReporte}
                />

                {/* REPORTE N° 4 */}
                <TablaReporteResumenContinuidad
                    mostrarReporte = {this.state.mostrarReporte}
                    promedioPonderados = {this.state.promedioPonderados}
                    zonas = {this.state.zonas}
                    zonaReporte = {this.state.zonaReporte}
                    tipoReporte = {this.state.tipoReporte}
                />

                {/* REPORTE N° 5 */}
                <TablaReporteResumenPresion10y50Mca
                    mostrarReporte = {this.state.mostrarReporte}
                    zonas = {this.state.zonas}
                    zonaReporte = {this.state.zonaReporte}
                    tipoReporte = {this.state.tipoReporte}
                />

                {/* REPORTE N° 6 */}
                <TablaReporteResumenContinuidad6y18Hrs
                    mostrarReporte = {this.state.mostrarReporte}
                    zonas = {this.state.zonas}
                    zonaReporte = {this.state.zonaReporte}
                    tipoReporte = {this.state.tipoReporte}
                />               
                
                {/* REPORTE N° 7 */}
                <TablaReporteComercial
                    mostrarReporte = {this.state.mostrarReporte}
                    comercialResumen = {this.state.comercialResumen}
                    tipoReporte = {this.state.tipoReporte}
                />

            </div>
        )
        } else { return <UsuarioNoValido /> }
    }
}

export default ReportePresion