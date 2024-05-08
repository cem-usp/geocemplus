import logo from './logo.svg';
import './App.css';

import React from "react";
import MainPane from "./components/MainPane";
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './config/Theme'

function App() {
	
	return (
		<ThemeProvider theme={theme}>
			<div className="App">
				<MainPane />
			</div>
		</ThemeProvider>
	);
}

export default App;
