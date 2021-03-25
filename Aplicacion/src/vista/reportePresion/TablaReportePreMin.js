import React from 'react';
import { numeroArabigoEnRomano, obtenerCodigoTipoAltitud } from '../../datos/funcionesSistema';

const TablaReportePreMin = ({mostrarReporte,tipoReportePresion,actividadPresiones,promedioPresiones,zonas,tiposAltitud,zonaReporte,altitudReporte})=>{
    if(mostrarReporte  && tipoReportePresion === "4"){
    var sumaConexionesActivas = 0;
    var sumaConexionesPresionMin = 0;
    var sumaPresConex = 0;

    function sumarConexionesMenor10Mca (presionMenor10Mca, conexionesMenor10Mca){
        sumaPresConex = sumaPresConex + (presionMenor10Mca * conexionesMenor10Mca);
        sumaConexionesPresionMin = sumaConexionesPresionMin + conexionesMenor10Mca;
    }

    return (
    <div id="reportePresionMinima">
        <div className="centrado">
            <table id="tablaReportePresionMinima">
                <thead>
                <tr>
                    <th style={{border:'1px solid black',textAlign:'center'}}>Zona</th>
                    <th style={{border:'1px solid black',textAlign:'center'}}>Tipo de<br />Altitud</th>
                    <th style={{border:'1px solid black',textAlign:'center'}}>Urbanización - Calle</th>
                    <th style={{border:'1px solid black',textAlign:'center'}}>PRESION</th>
                    <th style={{border:'1px solid black',textAlign:'center'}}>CANT</th>
                    <th style={{border:'1px solid black',textAlign:'center'}}>Conexiones <br/>Activas</th>
                    <th style={{border:'1px solid black',textAlign:'center'}}>Conexiones <br/>PRE - MIN</th>
                    <th style={{border:'1px solid black',textAlign:'center'}}>Presion <br/>Menor a 10</th>
                    <th style={{border:'1px solid black',textAlign:'center'}}>PRESx CONx</th>
                </tr>
                </thead>
                {(zonas||[]).filter(zona => {
                    if(zonaReporte === "%" ){ return zona.esSector }
                    else { return zona.esSector && zona.codigoZona.toString() === zonaReporte }
                }).map(zona => {                   
                    const cantidadRegistrosZona = (actividadPresiones||[]).filter(actividad=>actividad.codigoZonaReporte===zona.codigoZona).length;
                    var conexionesActivas = 0;
                    var conexionesMenor10Mca = 0;
                    var cant = 0;

                    if(cantidadRegistrosZona > 0){
                        return(
                        <tbody key={zona.codigoZona}>
                            <tr>
                                <td rowSpan={cantidadRegistrosZona + 7} style={{border:'1px solid black',textAlign:'center'}}>
                                { '\u0020' + numeroArabigoEnRomano(zona.sector) + (parseInt(zona.subSector) === 0 ? '':" \u2014 " + numeroArabigoEnRomano(zona.subSector)) + (zona.microSector === '-' ? '':" \u2014 "+zona.microSector)}
                                </td>
                            </tr>
                            {tiposAltitud.filter(altitud => {
                                if(altitudReporte === "%"){ return obtenerCodigoTipoAltitud(altitud) !== 0 }
                                else { return obtenerCodigoTipoAltitud(altitud).toString() === altitudReporte } 
                            }).map(altitud  => {

                                var presionAcumulado = 0;
                                var cantAcumulado = 0;
                                var presionMenor10Mca = 0;
                                var promedioPresionZonaAltitud = 0;
                                
                                const tipoAltitud = obtenerCodigoTipoAltitud(altitud);
                                const cantidadRegistrosZonaAltitud = (actividadPresiones||[]).filter(actividad => {
                                    return actividad.codigoZonaReporte === zona.codigoZona && actividad.tipoAltitud === tipoAltitud;
                                }).length;
                                
                                (promedioPresiones||[]).filter(promedio => promedio.codigoZona === zona.codigoZona && promedio.tipoAltitud ===tipoAltitud)
                                .forEach(promedio => conexionesActivas = promedio.conexionesActivas);
                                sumaConexionesActivas = sumaConexionesActivas + conexionesActivas;

                                if(cantidadRegistrosZonaAltitud > 0){
                                    return(
                                        <React.Fragment key={zona.codigoZona+"-"+altitud}>
                                        <tr>
                                            <td rowSpan={cantidadRegistrosZonaAltitud + 2} style={{border:'1px solid black', textAlign:'center'}}>&nbsp;{altitud}</td>
                                        </tr>
                                        {(actividadPresiones||[]).filter(actividad=>{return actividad.codigoZonaReporte === zona.codigoZona && actividad.tipoAltitud === tipoAltitud})
                                        .forEach(actividad => {
                                            cant = actividad.promedioPresion < 10.00 ? 1 : 0;
                                            cantAcumulado = cant + cantAcumulado;
                                            conexionesMenor10Mca = conexionesActivas / cantidadRegistrosZonaAltitud * cantAcumulado; // CONEXIONES
                                            if(conexionesMenor10Mca !== 0){presionAcumulado = presionAcumulado + (cant === 1 ? actividad.promedioPresion : 0)}
                                            presionMenor10Mca = ((presionAcumulado/cantAcumulado)||0).toFixed(2); // CONTINUIDAD
                                            promedioPresionZonaAltitud = promedioPresionZonaAltitud + actividad.promedioPresion;
                                        })}
                                        {(actividadPresiones||[]).filter(actividad=>{ return actividad.codigoZonaReporte === zona.codigoZona && actividad.tipoAltitud === tipoAltitud;})
                                        .map((actividad,indice) => { return (
                                            <tr key={zona.codigoZona+"-"+tipoAltitud+"-"+actividad.codigoPresion}>
                                                <td style={{border: '1px solid black', textAlign:'left', paddingLeft:'8px'}}>
                                                    {actividad.denominacionLote}
                                                </td>
                                                <td style={{border: '1px solid black', textAlign:'center'}}>
                                                    {actividad.promedioPresion.toFixed(2)}
                                                </td>
                                                <td style={{border: '1px solid black', textAlign:'center'}}>
                                                    {actividad.promedioPresion < 10.00 ? 1 : 0}
                                                </td>
                                                {indice<1?<td rowSpan={cantidadRegistrosZonaAltitud} style={{border:'1px solid black', textAlign:'center'}}> { conexionesActivas } </td> : null }
                                                {indice<1?<td rowSpan={cantidadRegistrosZonaAltitud} style={{border:'1px solid black', textAlign:'center'}}> { conexionesMenor10Mca.toFixed(2) } </td> : null }
                                                {indice<1?<td rowSpan={cantidadRegistrosZonaAltitud} style={{border:'1px solid black', textAlign:'center'}}> { presionMenor10Mca} </td> : null }
                                                {indice<1?<td rowSpan={cantidadRegistrosZonaAltitud} style={{border:'1px solid black', textAlign:'center'}}> { (presionMenor10Mca * conexionesMenor10Mca).toFixed(2)} </td> : null }
                                            </tr>
                                            )
                                        }) 
                                        }
                                        {sumarConexionesMenor10Mca(presionMenor10Mca, conexionesMenor10Mca)}
                                        <tr>
                                            <td style={{border:'1px solid black', textAlign:'center'}}>&nbsp;<b>PROMEDIO PARTE {(altitud).toUpperCase()}</b>&nbsp;</td>
                                            <td colSpan={6} style={{border:'1px solid black', textAlign:'center'}}> {(promedioPresionZonaAltitud/cantidadRegistrosZonaAltitud).toFixed(2)} </td>
                                        </tr>
                                        </React.Fragment>
                                    )
                                }else { return null} 
                            })}
                        </tbody>)
                    } else{ return  null }               
                })}
                <tbody>
                    <tr>
                        <td colSpan={5} style={{border:'1px solid black', textAlign:'center'}}>SUMATORIA</td>
                        <td style={{border:'1px solid black', textAlign:'center'}}>{sumaConexionesActivas}</td>
                        <td style={{border:'1px solid black', textAlign:'center'}}>{sumaConexionesPresionMin.toFixed(2)}</td>
                        <td style={{border:'1px solid black', textAlign:'center'}}>&nbsp;</td>
                        <td style={{border:'1px solid black', textAlign:'center'}}>{sumaPresConex.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colSpan={2}>&nbsp;</td>
                        <td colSpan={2} style={{border:'1px solid black', textAlign:'center'}}>Presion Minima Promedio</td>
                        <td colSpan={5}style={{border:'1px solid black', textAlign:'center'}}>{(sumaPresConex/sumaConexionesPresionMin).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colSpan={2}>&nbsp;</td>
                        <td colSpan={2} style={{border:'1px solid black', textAlign:'center'}}>Porcentaje de población con Presión menor a 10 mca</td>
                        <td colSpan={5}style={{border:'1px solid black', textAlign:'center'}}>{((sumaConexionesPresionMin/sumaConexionesActivas)*100).toFixed(2)} %</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    )} else { return null}
    
}
export default TablaReportePreMin