import React from 'react';
import { numeroArabigoEnRomano, obtenerCodigoTipoAltitud, convertirNumeroAHora } from '../../datos/funcionesSistema';

const TablaReporteContinuidadMenor6Hrs=({mostrarReporte,tipoReporteContinuidad,actividadContinuidades,promedioPonderados,zonas,tiposAltitud,zonaReporte,altitudReporte})=>{
    if(mostrarReporte  && tipoReporteContinuidad === "4"){
        var sumaConexionesActivas = 0;
        var sumaConexionesMenor6Hrs = 0;
        var sumaContConex = 0;

        function sumarConexionesMenor6Hrs (continuidadMenor6Hrs, conexionesMenor6Hrs){
            sumaContConex = sumaContConex + (continuidadMenor6Hrs / 24 * conexionesMenor6Hrs);
            sumaConexionesMenor6Hrs = sumaConexionesMenor6Hrs + conexionesMenor6Hrs;
        }

        return (
        <div id="reporteContinuidadMenor6Hrs">
            <div className="centrado">
            <table id="tablaReporteContinuidadMenor6Hrs">
                <thead>
                <tr>
                    <th style={{border:'1px solid black',textAlign:'center'}}>&nbsp;Zona&nbsp;</th>
                    <th style={{border:'1px solid black',textAlign:'center'}}>Tipo de<br />Altitud&nbsp;</th>
                    <th style={{border:'1px solid black',textAlign:'center'}}>&nbsp;Urbanización - Calle&nbsp;</th>
                    <th style={{border:'1px solid black',textAlign:'center'}}>Horas<br/>Servicio</th>
                    <th style={{border:'1px solid black',textAlign:'center'}}>CANT.</th>
                    <th style={{border:'1px solid black',textAlign:'center'}}>Conexiones<br/>Activas</th>
                    <th style={{border:'1px solid black',textAlign:'center'}}>Conexiones<br/>Menor 6 Hrs</th>
                    <th style={{border:'1px solid black',textAlign:'center'}}>Continuidad<br/>Menor 6 Hrs</th>
                    <th style={{border:'1px solid black',textAlign:'center'}}>CONTx CONEX</th>
                </tr>
                </thead>
                {zonas.filter(zona => {
                    if(zonaReporte === "%" ){ return zona.esSector }
                    else { return zona.esSector && zona.codigoZona.toString() === zonaReporte }
                }).map(zona => {
                    const cantidadRegistrosZona = actividadContinuidades.filter(actividad=>actividad.codigoZonaReporte===zona.codigoZona).length;
                    var conexionesActivas = 0;
                    var conexionesMenor6hrs = 0;
                    var cant = 0;

                    if(cantidadRegistrosZona > 0){ return (
                    <tbody key={zona.codigoZona}>
                        <tr>
                            <td rowSpan={cantidadRegistrosZona + 4} style={{border:'1px solid black',textAlign:'center'}}>
                            { '\u0020' + numeroArabigoEnRomano(zona.sector) + (parseInt(zona.subSector) === 0 ? '':" \u2014 " + numeroArabigoEnRomano(zona.subSector)) + (zona.microSector === '-' ? '':" \u2014 "+zona.microSector)}
                            </td>
                        </tr>
                        {tiposAltitud.filter(altitud => {
                            if(altitudReporte === "%"){ return obtenerCodigoTipoAltitud(altitud) !== 0 }
                            else { return obtenerCodigoTipoAltitud(altitud).toString() === altitudReporte } 
                        }).map(altitud  => {

                            var horasAcumulado = 0;
                            var cantAcumulado = 0;
                            var continuidadMenor6Hrs = 0;

                            const tipoAltitud = obtenerCodigoTipoAltitud(altitud);
                            const cantidadRegistrosZonaAltitud = actividadContinuidades.filter(actividad => {
                                return actividad.codigoZonaReporte === zona.codigoZona && actividad.tipoAltitud === tipoAltitud;
                            }).length;
                            
                            promedioPonderados.filter(promedio => promedio.codigoZona === zona.codigoZona && promedio.tipoAltitud ===tipoAltitud)
                            .forEach(promedio => conexionesActivas = promedio.conexionesActivas);
                            sumaConexionesActivas = sumaConexionesActivas + conexionesActivas;
                            
                            if(cantidadRegistrosZonaAltitud > 0){
                                return(
                                    <React.Fragment key={zona.codigoZona+"-"+altitud}>
                                    <tr>
                                        <td rowSpan={cantidadRegistrosZonaAltitud + 1} style={{border:'1px solid black', textAlign:'center'}}>&nbsp;{altitud}</td>
                                    </tr>
                                    {actividadContinuidades.filter(actividad=>{return actividad.codigoZonaReporte === zona.codigoZona && actividad.tipoAltitud === tipoAltitud})
                                    .forEach(actividad => {
                                        var hora = parseInt(actividad.horaServicio.substring(0,2));
                                        var minuto = parseInt(((actividad.horaServicio.substring(3,5)*100)/60).toFixed(2));
                                        var totalHora = hora + (minuto/100);
                                        cant = totalHora < 6 ? 1 : 0;
                                        cantAcumulado = cant + cantAcumulado;
                                        conexionesMenor6hrs = conexionesActivas / cantidadRegistrosZonaAltitud * cantAcumulado; // CONEXIONES
                                        if(conexionesMenor6hrs !== 0){horasAcumulado = horasAcumulado + (cant === 1 ? totalHora : 0)}
                                        continuidadMenor6Hrs = ((horasAcumulado/cantAcumulado)||0).toFixed(2); // CONTINUIDAD
                                    })}
                                    {actividadContinuidades.filter(actividad=>{return actividad.codigoZonaReporte === zona.codigoZona && actividad.tipoAltitud === tipoAltitud})
                                    .map((actividad,indice) => {
                                        return (
                                        <tr key={indice}>
                                            <td style={{border: '1px solid black', textAlign:'left', paddingLeft:'8px'}}>
                                                {actividad.denominacionLote}
                                            </td>
                                            <td style={{border: '1px solid black', textAlign:'center'}}>
                                                {actividad.horaServicio}
                                            </td>
                                            <td style={{border: '1px solid black', textAlign:'center'}}>
                                                { cant }
                                            </td>
                                            { indice < 1 ?  <td rowSpan={cantidadRegistrosZonaAltitud} style={{border:'1px solid black', textAlign:'center'}}> { conexionesActivas } </td> : null }
                                            { indice < 1 ?  <td rowSpan={cantidadRegistrosZonaAltitud} style={{border:'1px solid black', textAlign:'center'}}> { conexionesMenor6hrs.toFixed(2) } </td> : null }
                                            { indice < 1 ?  <td rowSpan={cantidadRegistrosZonaAltitud} style={{border:'1px solid black', textAlign:'center'}}> { convertirNumeroAHora(continuidadMenor6Hrs,"hh:mm")} </td> : null }
                                            { indice < 1 ?  <td rowSpan={cantidadRegistrosZonaAltitud} style={{border:'1px solid black', textAlign:'center'}}> { (continuidadMenor6Hrs / 24 * conexionesMenor6hrs).toFixed(2)} </td> : null }
                                        </tr>
                                        )
                                    })}
                                    {sumarConexionesMenor6Hrs(continuidadMenor6Hrs, conexionesMenor6hrs)}
                                    </React.Fragment>
                                )
                            }else { return null} 
                        })}
                    </tbody>)
                    } else{ return  null }               
                    })
                }
                <tbody>
                    <tr>
                        <td colSpan={5} style={{border:'1px solid black', textAlign:'center'}}>SUMATORIA</td>
                        <td style={{border:'1px solid black', textAlign:'center'}}>{sumaConexionesActivas}</td>
                        <td style={{border:'1px solid black', textAlign:'center'}}>{sumaConexionesMenor6Hrs.toFixed(2)}</td>
                        <td style={{border:'1px solid black', textAlign:'center'}}>&nbsp;</td>
                        <td style={{border:'1px solid black', textAlign:'center'}}>{sumaContConex.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colSpan={2}>&nbsp;</td>
                        <td colSpan={2} style={{border:'1px solid black', textAlign:'center'}}>Continuidad Promedio Menor a 6 Horas</td>
                        <td colSpan={5} style={{border:'1px solid black', textAlign:'center'}}>{ convertirNumeroAHora((sumaContConex/sumaConexionesMenor6Hrs)*24,"hh:mm")}</td>
                    </tr>
                    <tr>
                        <td colSpan={2}>&nbsp;</td>
                        <td colSpan={2} style={{border:'1px solid black', textAlign:'center'}}>Porcentaje de Usuarios con Continuidad menor a 6 Horas</td>
                        <td colSpan={5} style={{border:'1px solid black', textAlign:'center'}}>{((sumaConexionesMenor6Hrs/sumaConexionesActivas)*100).toFixed(2)} %</td>
                    </tr>
                </tbody>
            </table>
            </div>
        </div>
    )} else { return null}
}
export default TablaReporteContinuidadMenor6Hrs