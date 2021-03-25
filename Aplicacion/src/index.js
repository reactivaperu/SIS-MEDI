/*
-- File:             index.js
-- Project Name:     MediSeda
-- Version:          0.0.1
-- Description:      Iniciar Aplicación MediSeda
-- Author:           Jorge Muñiz
-- Create Date:      2019-10-02
-- @Copyright        Jorge.Muñiz.Velasquez - World Connect Perú - 2019           
*/

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; // Importar Aplicación
import './Estilo.css';

ReactDOM.render(<App />, document.getElementById('root')); // Renderiza Aplicación en root de HTML
