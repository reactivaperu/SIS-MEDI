import React from 'react';
import { numeroArabigoEnRomano } from '../../datos/funcionesSistema';

const TablaReporteResumenContinuidad18Hrs=({mostrarReporte,tipoReporteContinuidad,zonas,zonaReporte})=>{
    if(mostrarReporte  && tipoReporteContinuidad === "7"){
        return (
        <div id = "reporteResumenContinuidad18Hrs">
            <div style = {{display:'flex', justifyContent:'center', alignItems:'center'}}>
            <table id = "tablaReporteResumenContinuidad18Hrs">
                <thead>
                    <tr>
                        <th colSpan={5} style={{border:'1px solid black',textAlign:'center'}}>&nbsp;SECTORES DE DISTRIBUCIÓN CON CONTINUIDAD MENOR A 06 HRS&nbsp;</th>
                    </tr>
                    <tr>
                        <th style={{border:'1px solid black',textAlign:'center'}}>&nbsp;ZONA&nbsp;</th>
                        <th style={{border:'1px solid black',textAlign:'center'}}>&nbsp;AREA DE SERVICIO&nbsp;</th>
                        <th style={{border:'1px solid black',textAlign:'center'}}>&nbsp;PROMEDIO HORAS<br/>Servicio&nbsp;</th>
                        <th style={{border:'1px solid black',textAlign:'center'}}>&nbsp;CONEXIONES CON SERVICIO<br />MENOR A 6Hrs&nbsp;</th>
                        <th style={{border:'1px solid black',textAlign:'center'}}>&nbsp;POBLACION&nbsp;</th>
                    </tr>
                </thead>
                {zonas
                    .filter(zona => {
                        if(zonaReporte === "%" ){ return zona.esSector }
                        else { return zona.esSector && zona.codigoZona.toString() === zonaReporte }
                    })
                    .map(zona => {     
                        return(
                            <tbody key={zona.codigoZona}>
                                <tr>
                                    <td style={{border:'1px solid black',textAlign:'center'}}>
                                    { '\u0020' + numeroArabigoEnRomano(zona.sector) + (parseInt(zona.subSector) === 0 ? '':" \u2014 " + numeroArabigoEnRomano(zona.subSector)) + (zona.microSector === '-' ? '':" \u2014 "+zona.microSector)}
                                    </td>
                                    <td style={{border: '1px solid black'}}> {zona.denominacionZona} </td>
                                    <td style={{border: '1px solid black', textAlign:'center'}}> 04:46 </td>
                                    <td style={{border: '1px solid black', textAlign:'center'}}> 1302 </td>
                                    <td style={{border: '1px solid black', textAlign:'center'}}> 7436 </td>                                        
                                </tr>
                            </tbody>
                        )              
                    })
                }
                <tbody>
                    <tr>
                        <td colSpan={2} style={{border:'1px solid black', textAlign:'center'}}>TOTAL</td>
                        <td style={{border:'1px solid black', textAlign:'center'}}></td>
                        <td style={{border:'1px solid black', textAlign:'center'}}>4961</td>
                        <td style={{border:'1px solid black', textAlign:'center'}}>28325</td>
                    </tr>
                    <tr>
                        <td colSpan={3} style={{border:'1px solid black', textAlign:'center'}}>TOTAL USUARIOS</td>
                        <td colSpan={2} style={{border:'1px solid black', textAlign:'center'}}>86135</td>
                    </tr>
                    <tr>
                        <td colSpan={3} style={{border:'1px solid black', textAlign:'center'}}>Porcentaje de Usuarios con Continuidad menor a 6 horas</td>
                        <td colSpan={2} style={{border:'1px solid black', textAlign:'center'}}>5.76%</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <br />
        </div>
    )} else { return null}
    
}
export default TablaReporteResumenContinuidad18Hrs
