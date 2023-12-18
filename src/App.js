import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./authentication/SignUp.jsx";
import Home from "./page/home.jsx";
import Quetsion from "./page/Question.jsx";
import Answers from "../src/page/Answer.jsx";
import Purchase from './page/purchase/hardware_purchase.jsx'

function App() {
  return (
    
      <Router>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Home />} />
          <Route path="/question/:id" element={<Quetsion/>} />
          <Route path="/result/:id" element={<Answers/>} />
          <Route  path="/purchase" element={<Purchase/>}/>
        </Routes>
      </Router>
   
  );
}


export default App;
