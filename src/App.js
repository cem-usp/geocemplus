import logo from './logo.svg';
import './App.css';

import React, { useEffect, useState } from "react";
import api from "./services/api";
import FormLayer from "./components/FormLayer";

function App() {

    const [user, setUser] = useState();

     useEffect(() => {
       api
         .get("/users/Euak")
         .then((response) => setUser(response.data))
         .catch((err) => {
           console.error("ops! ocorreu um erro" + err);
         });
     }, []);

      return (
        <div className="App">
            <p>Usuário: {user?.login}</p>
            <p>Biografia: {user?.bio}</p>
            <div>
                <FormLayer />
            </div>
        </div>
      );
}

export default App;
