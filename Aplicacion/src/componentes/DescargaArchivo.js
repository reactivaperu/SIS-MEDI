import React from 'react';
import Modal from "./Modal.js";
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { exportarArchivoPdf, exportarArchivoTexto, obtenerFecha } from '../datos/funcionesSistema';

const generarArchivoPdf = ( documento ) => {
    const html = document.getElementById(documento.idTabla);
    if(documento){ exportarArchivoPdf(`${html.outerHTML}`, documento.orientacion, documento.nombreArchivo + "-" + obtenerFecha() + ".pdf" ) }
}

const generarArchivoTxt = ( documento ) => {
    if(documento){ exportarArchivoTexto(documento.contenido, documento.nombreArchivo + "-" + obtenerFecha() + ".txt") }
}

const DescargaArchivo = ({ titulo,mensaje,mostrarDescargaArchivo,controlDescargaArchivo,documento,tipoReporte }) => {
    if(!mostrarDescargaArchivo){ return null }
    else{ return (
    <Modal
        mostrarModal = {mostrarDescargaArchivo}
        controlModal = {controlDescargaArchivo}
        tituloModal = {titulo || "Tipo de Descagar del Archivo"}
    >
    <div className="una_columna">
        <div className="centrado">{mensaje}</div>
        <div className={tipoReporte !== "7" ? "dos_columnas":"tres_columnas"}>
            <div className="centrado">
                <img style={{cursor:"pointer"}} src="/img/pdf.png" alt="Descargar Archivo Pdf" title="Descargar Archivo Pdf" onClick={()=>generarArchivoPdf(documento)}/>
            </div>
            <div className="centrado">
                <ReactHTMLTableToExcel
                    className = "boton_excel_descarga"
                    table = {documento.idTabla}
                    filename = {documento.nombreArchivo}
                    sheet = "hoja 1"
                    buttonText = " "
                />
                <img src="/img/excel.png" alt="Descargar Archivo Excel" title="Descargar Archivo Excel"/> 
            </div>
            <div hidden={tipoReporte !== "7"}>
                <div className="centrado">
                <img style={{cursor:"pointer"}} src="/img/txt.png" alt="Descargar Archivo Txt" title="Descargar Archivo Txt" onClick={()=>generarArchivoTxt(documento)}/>
                </div>
            </div>
        </div>
        <div className="centrado">
            <button className="boton boton_rojo" onClick={()=>controlDescargaArchivo()}>Cancelar</button>
        </div>
    </div>
    </Modal>
    )}
}

export default DescargaArchivo;