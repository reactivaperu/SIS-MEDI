/*
-- File:             App.js
-- Project Name:     MediSeda
-- Version:          0.0.1
-- Description:      Rutas de Aplicación MediSeda
-- Author:           Jorge Muñiz
-- Create Date:      2019-10-02
-- @Copyright        Jorge.Muñiz.Velasquez - World Connect Perú - 2019
*/

import React, { Component } from 'react';
import { BrowserRouter , Route , Switch } from 'react-router-dom'; // Libreria React-Router
import { verificarGrupoUsuario } from './datos/usuarioDB.js'; // Verificar Datos de Usuario Conectado
import { conectarBaseDatos,conectarServidor } from './datos/appWebDB.js';
import Principal from './componentes/Principal.js'; // Importar Interfaz UI Principal
import Perfil from './componentes/Perfil.js'; // Importar Interfaz UI de Perfil de Usuario
import Usuario from './vista/usuario/Usuario.js'; // Importar Interfaz UI Usuario
import InicioSesion from './vista/sesion/InicioSesion.js'; // Importar Interfaz UI Inicio Sesion
import CerrarSesion from './vista/sesion/CerraSesion.js';
import CambioContrasegna from './vista/usuario/CambioContrasegna.js';
import FuenteConexionUI from './vista/fuenteConexionUI/fuenteConexion.js';
import ActividadAdministrador from './vista/actividadAdministrador/ActividadAdministrador.js';// Importar Interfaz UI de Actividad Para Administrador
import ActividadOperario from './vista/actividadOperario/ActividadOperario.js';// Importar Interfaz UI de Actividad Para Operario
import Bloque from './vista/bloque/Bloque.js'; // Interfaz Adicionales
import Conexion from './vista/conexion/Conexion.js';
import ConexionProdAgua from './vista/conexionProdAgua/ConexionProdAgua.js';
import Direccion from './vista/direccion/Direccion.js';
import FuenteAgua from './vista/fuenteAgua/FuenteAgua.js';
import FuenteZona from './vista/fuenteZona/FuenteZona.js';
import Zona from './vista/zona/Zona.js'; 
import Mapa from './vista/mapa/Mapa.js';
import Reporte from './vista/reporte/Reporte.js';

import Navegador from './componentes/Navegador.js';
import Error404 from './componentes/Error404.js'; // Importar Interfaz UI Error404
import Menu from './componentes/Menu.js';
import MenuCuadro from './componentes/MenuCuadro.js';

import { urlAplicacion } from './datos/funcionesSistema.js';

const estadoInicial = {
  estadoConectado : localStorage.getItem('estadoConectado') || "red", // red ==> Sin Conexion a server -- orange ==> Sin conexion a BD -- green ==> Conectado
  mostrarMenuLateral : false,
  usuario : verificarGrupoUsuario(),
};

class App extends Component {

  constructor(props){
    super(props);
    this.state = estadoInicial;
  }

  actualizarUsuario = (ruta) => {
    ruta = urlAplicacion + ruta;
    this.setState({usuario:verificarGrupoUsuario()},()=>{return true});
  }

  actualizarEstado = () => {
    conectarServidor().then(res => {
      if(!res.error){
        conectarBaseDatos().then(res => {
          if(!res.error){ 
            localStorage.setItem('estadoConectado',"green");
            this.setState({ estadoConectado : "green" })
          }
          else{ 
            localStorage.setItem('estadoConectado',"orange");
            this.setState({ estadoConectado : "orange" })
          }
        });
      }else{ 
        localStorage.setItem('estadoConectado',"red");
        this.setState({ estadoConectado : "red" })
      }
    });
  }

  controlMenuLateral = () => {
    this.setState({ mostrarMenuLateral : !this.state.mostrarMenuLateral });
  }

  controlFondoMenu = () =>{
    this.setState({ mostrarMenuLateral : false });
  }
  
  componentDidMount(){
    if(this.state.usuario.grupo === 0 || this.state.estadoConectado === "red"){
      this.actualizarEstado();
    }
  }

  render() {
    const { estadoConectado } = this.state;
    return (
      <div className="App" style={{height : '100%'}}>
        <Menu controlMenuLateral={this.controlMenuLateral} mostrar={this.state.mostrarMenuLateral} estadoConectado={ estadoConectado }
              controlFondoMenu={this.controlFondoMenu} cerrarSesion={this.cerrarSesion} usuario={this.state.usuario}/>
        <MenuCuadro grupoUsuario={this.state.usuario.grupo} mostrarMenu={this.state.mostrarMenuLateral} controlMenu={this.controlMenuLateral}/>

        <main style={{ marginTop : '56px' }}>
        <Navegador usuario={this.state.usuario}></Navegador>
        <BrowserRouter>
          <Switch>
            <Route exact path="/app" component={Principal}/>
            <Route path="/app/perfil" component={Perfil}/>
            <Route path="/app/ingresar" render={(props) => <InicioSesion actualizarUsuario={this.actualizarUsuario} {...props}/> } />
            <Route path="/app/salir" render={(props) => <CerrarSesion actualizarUsuario={this.actualizarUsuario} {...props}/>}/>
            <Route path="/app/usuario" component={Usuario}/>
            <Route path="/app/cambiocontra" component={CambioContrasegna}/>
            <Route path="/app/actividad/administrador" render={(props) => <ActividadAdministrador tipoActividad={1} {...props}/>}/>
            <Route path="/app/actividad/operario" component={ActividadOperario}/> 
            <Route path="/app/fuente/conexion" component={FuenteConexionUI}/>                        
            <Route path="/app/bloque" component={Bloque} />
            <Route path="/app/conexion/prodagua" component={ConexionProdAgua} />
            <Route path="/app/conexion" component={Conexion} />
            <Route path="/app/direccion" component={Direccion} />
            <Route path="/app/aguafuente" component={FuenteAgua} />
            <Route path="/app/zonafuente" component={FuenteZona} />
            <Route path="/app/zona" component={Zona} />
            <Route path="/app/mapa" component={Mapa} />
            <Route path="/app/reporte" component={Reporte} />
            <Route path="/app/*" component={Error404}/>
          </Switch>
        </BrowserRouter>
      </main>
    </div>
    )
  }

}

export default App;
/*
<Route path="/app/actividad/administrador/continuidad" render={(props) => <ActividadAdministrador tipoActividad={0} {...props}/>}/>
<Route path="/app/actividad/administrador/presion" render={(props) => <ActividadAdministrador tipoActividad={1} {...props}/>}/>

<Route path="/app/reporte/continuidad" component={ReporteContinuidad} />
<Route path="/app/reporte/presion" component={ReportePresion} />
*/