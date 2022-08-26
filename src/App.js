import logo from './logo.svg';
import './App.css';

import React, { useEffect, useState, useRef } from "react";
import FormLayer from "./components/FormLayer";
import Map from "./components/MapGeo";
import { Container } from 'react-bootstrap';

function App() {
	
	return (
		<div className="App">
			<Container>
				<FormLayer />
			</Container>
		</div>
	);
}

export default App;
