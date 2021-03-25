import React from 'react';
import { numeroArabigoEnRomano } from '../../datos/funcionesSistema';

const TablaReporteResumenContinuidad=({mostrarReporte,tipoReporteContinuidad,zonas,zonaReporte})=>{
    if(mostrarReporte  && tipoReporteContinuidad === "8"){
        return (
        <div id = "reporteResumenContinuidad">
            <div style = {{display:'flex', justifyContent:'center', alignItems:'center'}}>
            <table id = "tablaReporteResumenContinuidad">
                <thead>
                    <tr>
                        <th style={{border:'1px solid black',textAlign:'center'}}>&nbsp;DESCRIPCIÓN ZONA&nbsp;</th>
                        <th style={{border:'1px solid black',textAlign:'center'}}>&nbsp;SECTOR&nbsp;</th>
                        <th style={{border:'1px solid black',textAlign:'center'}}>&nbsp;CODF&nbsp;</th>
                        <th style={{border:'1px solid black',textAlign:'center'}}>&nbsp;FUENTE&nbsp;</th>
                        <th style={{border:'1px solid black',textAlign:'center'}}>&nbsp;CONEX&nbsp;</th>
                        <th style={{border:'1px solid black',textAlign:'center'}}>&nbsp;HORA&nbsp;</th>
                        <th style={{border:'1px solid black',textAlign:'center'}}>&nbsp;ESTADO&nbsp;</th>

                    </tr>
                </thead>
                {zonas.filter(zona => { return zona.tieneConexiones }).map(zona => {  
                return(
                <tbody key={zona.codigoZona}>
                    <tr>
                        <td style={{border:'1px solid black',textAlign:'center'}}>
                        { '\u0020' + numeroArabigoEnRomano(zona.sector) + (parseInt(zona.subSector) === 0 ? '':" \u2014 " + numeroArabigoEnRomano(zona.subSector)) + (zona.microSector === '-' ? '':" \u2014 "+zona.microSector)}
                        </td>
                        <td style={{border: '1px solid black', textAlign:'center'}}> 1 </td>
                        <td style={{border: '1px solid black', textAlign:'center'}}> 1 </td>
                        <td style={{border: '1px solid black', textAlign:'center'}}> KORKOR </td>     
                        <td style={{border: '1px solid black', textAlign:'center'}}> 1109 </td>     
                        <td style={{border: '1px solid black', textAlign:'center'}}> 06:40 </td>     
                        <td style={{border: '1px solid black', textAlign:'center'}}> 1 </td>     
                    </tr>
                </tbody>)              
                })}
            </table>
        </div>
        <br />
        </div>
    )} else { return null}
    
}
export default TablaReporteResumenContinuidad
