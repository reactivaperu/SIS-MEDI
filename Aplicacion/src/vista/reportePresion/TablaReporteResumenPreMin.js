import React from 'react';
import { numeroArabigoEnRomano } from '../../datos/funcionesSistema';

const TablaReporteResumenPresionMinima=({mostrarReporte,tipoReportePresion,zonas,zonaReporte})=>{
    if(mostrarReporte  && tipoReportePresion === "5"){
        return (
        <div id = "ReporteResumenPresionMinima">
            <div style = {{display:'flex', justifyContent:'center', alignItems:'center'}}>
            <table id = "tablaReporteResumenPresionMinima">
                <thead>
                    <tr>
                        <th colSpan={5} style={{border:'1px solid black',textAlign:'center'}}>&nbsp;PORCENTAJE DE LA POBLACION CON SERVICIO MENOR A 10 mca DE PRESIÓN&nbsp;</th>
                    </tr>
                    <tr>
                        <th style={{border:'1px solid black',textAlign:'center'}}>&nbsp;ZONA&nbsp;</th>
                        <th style={{border:'1px solid black',textAlign:'center'}}>&nbsp;AREA DE SERVICIO&nbsp;</th>
                        <th style={{border:'1px solid black',textAlign:'center'}}>&nbsp;CONEXIONES <br/>SERVICIO&nbsp;</th>
                        <th style={{border:'1px solid black',textAlign:'center'}}>&nbsp;CONEXIONES CON SERVICIO<br />MENOR A 10mca&nbsp;</th>
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
                                    <td style={{border: '1px solid black', textAlign:'center'}}> 2,641 </td>
                                    <td style={{border: '1px solid black', textAlign:'center'}}> 177 </td>                                      
                                </tr>
                            </tbody>
                        )              
                    })
                }
                <tbody>
                    <tr>
                        <td colSpan={2} rowSpan={2} style={{border:'1px solid black', textAlign:'center'}}>PORCION DE POBLACION CON MENOS DE 10 mca</td>
                        <td style={{border:'1px solid black', textAlign:'center'}}>86135</td>
                        <td style={{border:'1px solid black', textAlign:'center'}}>(%)</td>
                    </tr>
                    <tr>
                        <td style={{border:'1px solid black', textAlign:'center'}}>1536</td>
                        <td style={{border:'1px solid black', textAlign:'center'}}>1.78%</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <br />
        </div>
    )} else { return null}
    
}
export default TablaReporteResumenPresionMinima
