import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Asidebar from "./Asidebar";
import Accueil from "./Accueil";
import SuiviDossierPage from "./SuiviDossierPage";
import Récapitulatif from "./Récapitulatif";
import DétailsDespaiements from "./DétailsDespaiements";
import CréationSouscompt from "./CréationSouscompt";
import GéstionSousCompte from "./GéstionSousCompte";
import ParDateémission from "./ParDateémission";
import Login from "./Login";
import Dcnx from "./Dcnx";
import Dcnx1 from "./Dcnx1";
import ProtectedRoute from "./ProtectedRoute"; 
import Suividesdemandes from "./Suividesdemandes";
import Recapitulatif1 from "./Recapitulatif1";
import Assuré from "./Assuré";
import CréationSouscompt1 from "./CréationSouscompt1";
import GéstionSousCompte1 from "./GéstionSousCompte1";

export default function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem("token"));
  console.log("Auth Token:", authToken);

  useEffect(() => {
    const checkToken = () => {
      setAuthToken(localStorage.getItem("token"));
    };
  
    window.addEventListener("storage", checkToken);
    return () => window.removeEventListener("storage", checkToken);
  }, []);

  return (
    <Router>
      <div className="flex h-screen">
        {authToken && <Asidebar />}
        <div className="flex-1 overflow-y-auto p-5">
          <Routes>
            <Route path="/" element={authToken ? <Accueil /> : <Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Dcnx />} />
            <Route path="/logout1" element={<Dcnx1 />} />
            <Route element={<ProtectedRoute authToken={authToken} />}>
              <Route path="/SuiviDossierPage" element={<SuiviDossierPage />} />
              <Route path="/Récapitulatif" element={<Récapitulatif />} />
              <Route path="/DétailsDespaiements" element={<DétailsDespaiements />} />
              <Route path="/ParDateémission" element={<ParDateémission />} />
              <Route path="/CréationSouscompt" element={<CréationSouscompt />} />
              <Route path="/GéstionSousCompte" element={<GéstionSousCompte />} />
              <Route path="/Suividesdemandes" element={<Suividesdemandes />} />
              <Route path="/Recapitulatif1" element={<Recapitulatif1 />} />
              <Route path="/Assuré" element={<Assuré />} />
              <Route path="/CréationSouscompt1" element={<CréationSouscompt1 />} />
              <Route path="/GéstionSousCompte1" element={<GéstionSousCompte1 />} />
            </Route>
          </Routes>
        </div>
      </div>
    </Router>
  );
}
