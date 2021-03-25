import React from 'react';
import { numeroArabigoEnRomano } from '../../datos/funcionesSistema';

const TablaReporteResumenComercial=({mostrarReporte,comercialResumen,tipoReporte})=>{
    if(mostrarReporte  && tipoReporte === "7"){
        return (
        <div id="reporteResumenComercial">
            <div style = {{display:'flex', justifyContent:'center', alignItems:'center'}}>
            <table id = "tablaReporteResumenComercial">
                <thead>
                    <tr>
                        <th style={{border:'1px solid black',textAlign:'center'}}>&nbsp;ZONA&nbsp;</th>
                        <th style={{border:'1px solid black',textAlign:'center'}}>&nbsp;SECTOR&nbsp;</th>
                        <th style={{border:'1px solid black',textAlign:'center'}}>&nbsp;CODF&nbsp;</th>
                        <th style={{border:'1px solid black',textAlign:'center'}}>&nbsp;FUENTE&nbsp;</th>
                        <th style={{border:'1px solid black',textAlign:'center'}}>&nbsp;CONEX&nbsp;</th>
                        <th style={{border:'1px solid black',textAlign:'center'}}>&nbsp;HORA&nbsp;</th>
                        <th style={{border:'1px solid black',textAlign:'center'}}>&nbsp;ESTADO&nbsp;</th>

                    </tr>
                </thead>
                {comercialResumen.map(comercial=>{return(
                    <tbody key={comercial.codigoZona}>
                        <tr>
                            <td style={{border:'1px solid black',textAlign:'center'}}>
                            { '\u0020' + numeroArabigoEnRomano(comercial.sector) + (parseInt(comercial.subSector) === 0 ? '':" \u2014 " + numeroArabigoEnRomano(comercial.subSector)) + (comercial.microSector === '-' ? '':" \u2014 "+comercial.microSector)}
                            </td>
                            <td style={{border: '1px solid black', textAlign:'center'}}> {comercial.sector} </td>
                            <td style={{border: '1px solid black', textAlign:'center'}}> {comercial.codigoFuente} </td>
                            <td style={{border: '1px solid black', textAlign:'center'}}> {comercial.denominacionFuente.toUpperCase()} </td>     
                            <td style={{border: '1px solid black', textAlign:'center'}}> {comercial.numeroConexiones} </td>     
                            <td style={{border: '1px solid black', textAlign:'center'}}> {(comercial.promedioHora||"00:00")} </td>
                            <td style={{border: '1px solid black', textAlign:'center'}}> {comercial.habilitado} </td>     
                        </tr>
                    </tbody>
                )})}
            </table>
        </div>
        <br />
        </div>
    )} else { return null}
    
}
export default TablaReporteResumenComercial
