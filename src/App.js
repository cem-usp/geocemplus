import logo from './logo.svg';
import './App.css';

import React, { useEffect, useState } from "react";
import api from "./services/api";
import FormLayer from "./components/FormLayer";
import Container from 'react-bootstrap/Container';

function App() {

      return (
        <div className="App">
            <Container>
                <div>
                    <FormLayer />
                </div>
            </Container>
        </div>
      );
}

export default App;
