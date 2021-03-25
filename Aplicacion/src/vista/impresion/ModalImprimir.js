import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { promesaListarActividadImpresion } from '../../datos/actividadDB';
import { promesaListarBloqueImpresionPaginaActividad } from '../../datos/impresionDB.js';

import Modal from "../../componentes/Modal.js";

var doc = new jsPDF('l','pt');
var altoPagina = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
var anchoPagina = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

var encabezadoTabla = [[
    {content:'TABLA DE ACTIVIDADES', colSpan:2, styles:{halign:'center', fillColor:[0,0,0]}},
    {content:'TABLA DE ACTIVIDADES', colSpan:2, styles:{halign:'center', fillColor:[22,160,133]}},
    {content:'TABLA DE ACTIVIDADES', colSpan:3, styles:{halign:'center', fillColor:[22,160,133]}}
]];
var tablas = [];

const ModalImpresion = ({ controlModalImpresion, mostrarModalImpresion, paginaActual, cantidadPaginas,tipoActividad, mesPeriodo, agnoPeriodo} ) => {  
    function agregarTitulos(doc, paginas, altoPagina, anchoPagina ){
        if(doc){
            var tituloHTML = document.getElementById('tituloActividades').innerHTML;
            var periodoHTML = document.getElementById('periodoActividades').innerHTML;
            var piePagina = 'Pagina ' + doc.internal.getNumberOfPages() + ' de ' + paginas;

            doc.setFontStyle('normal')
            doc.setFontSize(8)
            doc.text('EPS. SEDACUSCO S.A GERENCIA DE OPERACIONES', 5, 10)
            doc.text('DEPARTAMENTO DE OPERACIONES DISTRIBUCIÓN Y RECOLECCIÓN', (anchoPagina/2)+145, 10)
            doc.text(piePagina, 5, altoPagina - 10)

            doc.setFontSize(15)
            doc.text((tituloHTML||'Titulo de Actividades').toUpperCase(), anchoPagina / 2,30,'center');
            doc.text((periodoHTML||'Periodo de Actividades').toUpperCase(), anchoPagina / 2,45,'center');
            

        }
        return doc;
    }
    function agregarTablas(doc){
        if(doc){
            // TABLA DE PRUEVA
            doc.autoTable({
                startY : 60,
                head : encabezadoTabla,
                body:[['Datos 1-1','Datos 1-2','Datos 1-3'],
                    ['Datos 2-1','Datos 2-2','Datos 2-3'],
                    ['Datos 3-1','Datos 3-2','Datos 3-3']    
                ]
            });
            doc.autoTable({
                head : encabezadoTabla
            });
        }
        return doc;
    }

    function verTablas(dato){
        tablas.push(dato);
        return true;
    }

    function generarTablasImpresion(paginaActual){
        //var doc = new jsPDF('l','pt');
        var paginas = paginaActual?1:cantidadPaginas;
        //var altoPagina = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
        //var anchoPagina = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
        var tablasActividad = []
        var paginasLlenadas = 0;
        while (paginasLlenadas < paginas) {
            var paginaImpresion = paginaActual||(paginasLlenadas+1);
            promesaListarBloqueImpresionPaginaActividad({pagina:paginaImpresion}).then(bloques=>{
                if(!bloques.error){
                    bloques[0].forEach(bloque => {
                        const Busqueda = {
                            codigoUrbano: bloque.codigoUrbano, tipoActividad:tipoActividad,
                            mesPeriodo :mesPeriodo, agnoPeriodo: agnoPeriodo
                        }
                        promesaListarActividadImpresion(Busqueda).then(actividad =>{
                            tablasActividad.push(actividad);
                            if(verTablas(actividad)){
                                paginasLlenadas = paginasLlenadas + 1;
                            }
                        });
                    });
                }
            });
        }
        //Guardar y Mostrar Dialogo de Impresion del Archivo pdf
        //doc.autoPrint({variant:'non-conf'});
        doc.save('descargaPdf.pdf');

    }

    return (
    <Modal
        mostrarModal = {mostrarModalImpresion}
        controlModal = {controlModalImpresion}
        tituloModal = {"Imprimir Actividades"}
    >
    <div className="centrado">
        <div className="impresion_actividad_botones">
            <button className="boton boton_verde" onClick={()=>generarTablasImpresion(paginaActual)}>
                Pagina Actual ({paginaActual})
            </button>

            <button className="boton boton_rojo" onClick={()=>generarTablasImpresion(0)}>
                Todos los Bloques
            </button>
        </div>
    </div>
    </Modal>
    )
}
export default ModalImpresion