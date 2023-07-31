import logo from './logo.svg';
import './App.css';

import React, { useEffect, useState, useRef } from "react";
import MainPane from "./components/MainPane";
import { Container } from 'react-bootstrap';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ptBR } from '@mui/material/locale';


function App() {
	
	const theme = createTheme(
		{
			palette: {
			primary: { main: '#1976d2' },
			},
		},
		ptBR,
	);

	return (
		<ThemeProvider theme={theme}>
			<div className="App">
				<MainPane />
			</div>
		</ThemeProvider>
	);
}

export default App;
