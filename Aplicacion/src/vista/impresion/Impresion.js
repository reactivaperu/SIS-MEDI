/*
-- File:             Impresion.js
-- Project Name:     MediSeda
-- Version:          0.0.1
-- Description:      Interfaz UI para Imprimir
-- Author:           Jorge Muñiz
-- Create Date:      2019-10-02
-- @Copyright        Jorge.Muñiz.Velasquez - World Connect Perú - 2019           
*/

import React, { Component } from 'react'
import Modal from "../../componentes/Modal.js";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { promesaListarActividadImpresion } from '../../datos/actividadDB';
import { promesaListarBloqueImpresionPaginaActividad } from '../../datos/impresionDB.js';
import { numeroArabigoEnRomano , obtenerDenominacionTipoAltitud} from '../../datos/funcionesSistema';

const estadoInicial = {
    mostrarDatosImpresion : false, // Mostrar datos de encuentas en la impresion
    pdf : null,
    tablasActividad : [],
    PaginasTabla : []
}

export class Impresion extends Component {
    constructor(props){
        super(props);
        this.state = estadoInicial;
    }

    cambiarMostrarDatosImpresion = () => {
        this.setState({ mostrarDatosImpresion: !this.state.mostrarDatosImpresion});
    }

    agregarTitulos = (pdf, paginas, altoPagina, anchoPagina ) => {
        if(pdf){
            var tituloHTML = document.getElementById('tituloActividades').innerHTML;
            var periodoHTML = document.getElementById('periodoActividades').innerHTML;
            var piePagina = 'Pagina ' + pdf.internal.getNumberOfPages() + ' de ' + paginas;

            pdf.setFontStyle('normal')
            pdf.setFontSize(8)
            pdf.text('EPS. SEDACUSCO S.A GERENCIA DE OPERACIONES', 5, 10)
            pdf.text('DEPARTAMENTO DE OPERACIONES DISTRIBUCIÓN Y RECOLECCIÓN', (anchoPagina/2)+145, 10)
            pdf.text(piePagina, 5, altoPagina - 10)

            pdf.setFontSize(15)
            pdf.text((tituloHTML||'Titulo de Actividades').toUpperCase(), anchoPagina / 2,30,'center');
            pdf.text((periodoHTML||'Periodo de Actividades').toUpperCase(), anchoPagina / 2,45,'center');

            this.setState({ pdf });
        }
    }
    
    generarTablas = (pagina) => {
        /* LISTA PARA LAS PAGINAS INDEPENDIENTES */
        const PaginasTabla = [];
        const {cantidadPaginas,mesPeriodo,agnoPeriodo} = this.props;
        const { mostrarDatosImpresion } = this.state;
        var paginas = pagina?1:cantidadPaginas;
        for(var i=0;i<paginas;i++){
            var paginaAImprimir = pagina||(i+1);
            // TABLAS A IMPRIMIR
            promesaListarBloqueImpresionPaginaActividad({pagina:paginaAImprimir,mes:mesPeriodo,agno:agnoPeriodo}).then(bloques=>{ // PaginaImpresion, Codigourbano, denominaciones
                if(!bloques.error){
                    var tablasDePagina = [];
                    var paginaTabla = {};
                    (bloques[0]||[]).sort((b1,b2)=>{return parseInt(b1.ordenImpresion)-parseInt(b2.ordenImpresion)}).forEach(bloque=>{
                        var numPagina = 0;
                        const Busqueda = {
                            codigoUrbano: bloque.codigoUrbano,mesPeriodo :mesPeriodo, agnoPeriodo: agnoPeriodo
                        };
                        if(numPagina !== bloque.paginaImprimir){ numPagina=bloque.paginaImpresion;}
                        
                        promesaListarActividadImpresion(Busqueda).then(actividades => {
                            if(!actividades.error){
                                var direcciones = [];
                                var denominacionZona = bloque.denominacionZona.substring(0,bloque.denominacionZona.indexOf("["));

                                var operarios = [];
                                var nombresCompletos= "";                    
                                actividades.forEach(actividad => {
                                    var existe = false;
                                    operarios.forEach(codigo=>{if(codigo === actividad.codigoUsuario){existe=true;}});
                                    var nombre = actividad.nombreCompleto.trim().length>0?actividad.nombreCompleto+" - ":"";
                                    if(!existe){ operarios.push(actividad.codigoUsuario); nombresCompletos=nombresCompletos+nombre;}
                                    var direccion = {
                                        codigoUrbano:"",denominacionFuente:"",denominacionZona:"",altitud:obtenerDenominacionTipoAltitud(actividad.tipoAltitud),
                                        ordenBloque1:actividad.ordenBloque,denominacion:actividad.denominacionLote, inscripcion:actividad.codigoInscripcion,
                                        de1:this.state.mostrarDatosImpresion?actividad.r1HoraDe:"",a1:this.state.mostrarDatosImpresion?actividad.r1HoraA:"",
                                        de2:this.state.mostrarDatosImpresion?actividad.r2HoraDe:"",a2:this.state.mostrarDatosImpresion?actividad.r2HoraA:"",
                                        horas:this.state.mostrarDatosImpresion?actividad.lecturaArriba:"",promeio:this.state.mostrarDatosImpresion?actividad.lecturaAbajo:"",
                                        ordenBloque:actividad.ordenBloque
                                    };
                                    direcciones.push(direccion);
                                });
                                direcciones.push({codigoUrbano:"",denominacionFuente:"",denominacionZona:"",altitud:"",ordenBloque1:"",denominacion:"PROMEDIO PARCIAL",
                                    inscripcion:"", de1:"",a1:"",de2:"",a2:"",horas:"",promeio:"",ordenBloque:direcciones.length+1})     

                                var tabla = { 
                                    codigoUrbano:bloque.codigoUrbano,
                                    denominacionFuente:bloque.denominacionFuente,
                                    denominacionZona:denominacionZona,
                                    denominacionBloque:(bloque.denominacionBloque||"").toUpperCase(),
                                    nombresCompletos : nombresCompletos,
                                    ordenImpresion : bloque.ordenImpresion,
                                    sector : 'ZONA \u0020' + numeroArabigoEnRomano(bloque.sector) + (parseInt(bloque.subSector) === 0 ? '':" \u2014 " + numeroArabigoEnRomano(bloque.subSector)) + (bloque.microSector === '-' ? '':" \u2014 "+bloque.microSector),
                                    bloqueUrbano : bloque.denominacionBloque
                                };
                                tabla["direcciones"] = direcciones;
                                tablasDePagina.push(tabla);
                                paginaTabla["numPagina"] = numPagina;                
                            }
                        });
                    });
                    paginaTabla["tablas"] = tablasDePagina;
                    PaginasTabla.push(paginaTabla); 
                };
            });
        }
        setTimeout(()=>this.setState({PaginasTabla},()=>this.generarPdfImpresion(mostrarDatosImpresion)),paginas*500);
    }

    generarPdfImpresion = (mostrarDatosImpresion) => {
        const {PaginasTabla} = this.state;
        const pdf = new jsPDF('l','pt');
        var paginas = PaginasTabla.length; 
        var altoPagina = pdf.internal.pageSize.height || pdf.internal.pageSize.getHeight();
        var anchoPagina = pdf.internal.pageSize.width || pdf.internal.pageSize.getWidth();
        pdf.autoTable({});
        PaginasTabla.sort((p1,p2)=>{return p1.numPagina-p2.numPagina}).forEach((pagina,i) =>{

            if(i>0){ pdf.addPage() }
            this.agregarTitulos(pdf,paginas,altoPagina,anchoPagina);          
                pagina.tablas.sort((t1,t2)=>{return t1.ordenImpresion - t2.ordenImpresion}).forEach((tabla, index)=> {
                var tablasActividades = [];
                tabla.direcciones.sort((d1,d2)=>{return d1.ordenBloque-d2.ordenBloque}).forEach(direccion => {
                    tablasActividades.push(Object.values(direccion));
                })
                let finalY = index?pdf.previousAutoTable.finalY:40;
                let head = [
                    [
                        {content: tabla.nombresCompletos, colSpan: 7, styles: {halign: 'left', fillColor: [255, 255, 0]}},
                        {content: 'HORAS SERVICIO', colSpan: 4, cellWidth: 80, styles: {halign: 'center', fillColor: [255, 255, 255]}},
                        {content: '', colSpan: 2, styles: {halign: 'center', fillColor: [255, 255, 255]}},
                    ],
                    [
                        {content: 'Sec', rowSpan: 2, styles: {halign: 'center', fillColor: [255, 255, 255]}}, 
                        {content: 'Fuente', rowSpan: 2, styles: {halign: 'center', fillColor: [255, 255, 255]}},
                        {content: tabla.sector, rowSpan: 2, styles: {halign: 'center', fillColor: [255, 255, 255]}},
                        {content: 'Altitud', rowSpan: 2, styles: {halign: 'center', fillColor: [255, 255, 255]}},
                        {content: 'N°', rowSpan: 2, styles: {halign: 'center', fillColor: [255, 255, 255]}},
                        {content: 'URBANIZACIÓN - CALLE', rowSpan: 2, styles: {halign: 'center', fillColor: [255, 255, 255]}},
                        {content: 'Inscripción', rowSpan: 2, styles: {halign: 'center', fillColor: [255, 255, 255]}},
                        {content: 'MAÑANAS', colSpan: 2, styles: {halign: 'center', fillColor: [255, 255, 255]}},
                        {content: 'TARDES', colSpan: 2, styles: {halign: 'center', fillColor: [255, 255, 255]}},
                        {content: mostrarDatosImpresion?'PRESIÓN\n A. Arriba':'TOTAL HRS\n DE SEVICIO', rowSpan: 2, styles: {halign: 'center', fillColor: [255, 255, 255]}},
                        {content: mostrarDatosImpresion?'PRESIÓN\n A. Abajo':'PROMEDIO', rowSpan: 2, styles: {halign: 'center', fillColor: [255, 255, 255]}},
                    ],
                    [
                        {content: 'DE', styles: {halign: 'center', fillColor: [255, 255, 255]}},
                        {content: 'A', styles: {halign: 'center', fillColor: [255, 255, 255]}},
                        {content: 'DE', styles: {halign: 'center', fillColor: [255, 255, 255]}},
                        {content: 'A', styles: {halign: 'center', fillColor: [255, 255, 255]}}
                    ],
                    [
                        {content: tabla.codigoUrbano, styles: {halign: 'center', fillColor: [255, 255, 255]}}, 
                        {content: tabla.denominacionFuente, styles: {halign: 'center', fillColor: [255, 255, 255]}},
                        {content: tabla.denominacionZona, styles: {halign: 'center', fillColor: [255, 255, 255]}},
                        {content: '', styles: {halign: 'center', fillColor: [255, 255, 255]}},
                        {content: '', styles: {halign: 'center', fillColor: [255, 255, 255]}},
                        {content: tabla.denominacionBloque,  styles: {halign: 'center', fillColor: [255, 255, 255]}},
                        {content: '', styles: {halign: 'center', fillColor: [255, 255, 255]}},
                        {content: '', styles: {halign: 'center', fillColor: [255, 255, 255]}},
                        {content: '', styles: {halign: 'center', fillColor: [255, 255, 255]}},
                        {content: '', styles: {halign: 'center', fillColor: [255, 255, 255]}},
                        {content: '', styles: {halign: 'center', fillColor: [255, 255, 255]}},
                        {content: '', styles: {halign: 'center', fillColor: [255, 255, 255]}},
                        {content: '', styles: {halign: 'center', fillColor: [255, 255, 255]}},
                    ],
                ];
                pdf.autoTable({
                    startY: finalY + 20,
                    head: head,
                    body: tablasActividades,
                    theme: 'plain',
                    columnStyles:{2:{cellWidth:70},5:{cellWidth:200,halign:'left'},7:{cellWidth:40},8:{cellWidth:40},9:{cellWidth:40},10:{cellWidth:40}},
                    styles: {
                        cellPadding: 2,
                        minCellHeight: 10,
                        halign: 'center',
                        valign: 'middle',
                        lineWidth: 0.5,
                        fontSize: 6,
                        textColor: 0
                    },
                    tableLineColor: [0, 0, 0],
                    bodyStyles: {lineColor: [0, 0, 0]},
                    headStyles: {lineColor: [0, 0, 0]},

                });
            });
        });
        pdf.save('descargaPdf.pdf');
        this.props.controlModalImpresion();
        this.setState({ estadoInicial });
    }

    imprimirPdf = (numeroPagina) => {
        this.generarTablas(numeroPagina);
    }

    render() {
        if(this.props.mostrarModalImpresion){ 
            return(
            <Modal
                mostrarModal = {this.props.mostrarModalImpresion}
                controlModal = {this.props.controlModalImpresion}
                tituloModal = {"Imprimir Actividades"}
            >
            <div className="centrado">
                <div className="una_columna">
                    <div className="">
                        <input className="boton" type="checkbox" id="mostrarDatosImpresion" value={this.state.mostrarDatosImpresion} onChange={()=>{this.cambiarMostrarDatosImpresion()}}></input>
                        <label htmlFor="mostrarDatosImpresion" style={{fontSize:"18px"}}>Imprir Datos de Encuenta</label>
                    </div>
                    <div className="impresion_actividad_botones">
                        <button className="boton boton_verde" onClick={()=>this.imprimirPdf(this.props.paginaActual)}>
                            Pagina Actual ({this.props.paginaActual})
                        </button>
        
                        <button className="boton boton_rojo" onClick={()=>this.imprimirPdf(0)}>
                            Todos los Bloques
                        </button>
                    </div>
                </div>
            </div>
            </Modal>
        )} else { return null }
    }
}

export default Impresion;