import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./sidor/Layout.js";
import Hem from "./sidor/Hem";
import Editor from "./Editor.js";
import Support from "./sidor/Support";
import NoPage from "./sidor/NoPage";
import Policy from './sidor/policy.js';
import Användarvillkor from './sidor/villkor.js';
import ResetPassword from './sidor/ResetPassword.js';

import MittKonto from './sidor/mittKonto.js';
import Grid from './Grid.js';
import Grid3 from './SkapaKlassrum.jsx';
import SkapaPlaceringar from './Placeringar.js';
import Klasser from './Klasser.js';


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Hem />} />
          <Route path="Editor" element={<Editor />} />
          <Route path='Placeringar' element={<SkapaPlaceringar />}/>
          <Route path='Klassrum' element={<Grid3 />}/>
          <Route path="Klasser" element={<Klasser />}/>
          <Route path="Support" element={<Support />} />
          <Route path="policy" element={<Policy />} />
          <Route path="terms-of-service" element={<Användarvillkor />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route path="mittKonto" element={<MittKonto />} />


          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
