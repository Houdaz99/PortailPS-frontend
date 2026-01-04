import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { fetchDossiersRemboursements } from "./store";
import Asidebar from "./Asidebar";

export default function Récapitulatif() {
  const dispatch = useDispatch();
  const [selectedSituation, setSelectedSituation] = useState("Tous");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");

  // Récupérer les données depuis le store Redux
  const { 
    dossiersRemboursements, 
    loadingRemboursements, 
    errorRemboursements 
  } = useSelector((state) => state.dossierPaiement);
  
  // Fonction pour normaliser les situations
  const normalizeSituation = (situation) => {
    if (!situation) return null;
    
    const lowerSituation = situation.toLowerCase().trim();
    
    if (lowerSituation.includes('payé')) return 'Payé';
    if (lowerSituation.includes('retourné')) return 'Retourné';
    if (lowerSituation.includes('annulé')) return 'Annulé';
    if (lowerSituation.includes('en cours')) return 'En cours';
    
    return null;
  };

  // Filtrer les données selon les critères de recherche
  const filteredData = dossiersRemboursements.filter(dossier => {
    const matchesSituation = selectedSituation === "Tous" || 
      normalizeSituation(dossier.situation) === selectedSituation;
    
    const matchesDateDebut = !dateDebut || new Date(dossier.dateDepot) >= new Date(dateDebut);
    const matchesDateFin = !dateFin || new Date(dossier.dateDepot) <= new Date(dateFin);
    
    return matchesSituation && matchesDateDebut && matchesDateFin;
  });

  // Calcul des statistiques
  const calculateStatistics = () => {
    let stats = {
      "Payé": { count: 0, totalAmount: 0 },
      "Retourné": { count: 0, totalAmount: 0 },
      "Annulé": { count: 0, totalAmount: 0 },
      "En cours": { count: 0, totalAmount: 0 },
    };
  
    filteredData.forEach((dossier) => {
      const situation = normalizeSituation(dossier.situation);
      const montant = parseFloat(dossier.montant_accorde) || 0;
  
      if (situation && stats[situation]) {
        stats[situation].count += 1;
        stats[situation].totalAmount += montant;
      }
    });
  
    return stats;
  };

  const [stats, setStats] = useState({
    "Payé": { count: 0, totalAmount: 0 },
    "Retourné": { count: 0, totalAmount: 0 },
    "Annulé": { count: 0, totalAmount: 0 },
    "En cours": { count: 0, totalAmount: 0 },
  });

  useEffect(() => {
    if (dossiersRemboursements.length === 0) {
      dispatch(fetchDossiersRemboursements());
    }
  }, [dispatch, dossiersRemboursements.length]);

  useEffect(() => {
    if (dossiersRemboursements.length > 0) {
      setStats(calculateStatistics());
    }
  }, [dossiersRemboursements, selectedSituation, dateDebut, dateFin]);

  // Données pour les graphiques
  const pieData = [
    { name: "Payé", value: stats.Payé.count },
    { name: "Retourné", value: stats.Retourné.count },
    { name: "Annulé", value: stats.Annulé.count },
    { name: "En cours", value: stats["En cours"].count },
  ];

  const barData = [
    { name: "Payé", Montant: stats.Payé.totalAmount },
    { name: "Retourné", Montant: stats.Retourné.totalAmount },
    { name: "Annulé", Montant: stats.Annulé.totalAmount },
    { name: "En cours", Montant: stats["En cours"].totalAmount },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const rechercher = () => {
    setStats(calculateStatistics());
  };

  const reinitialiser = () => {
    setSelectedSituation("Tous");
    setDateDebut("");
    setDateFin("");
    setStats(calculateStatistics());
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-white">
   
      
      <h1 className="text-2xl font-bold text-blue-900 mb-4">Suivi des dossiers de Remboursement</h1>
      <h6 className="text-sm font-bold text-[#4DB9BB] mb-4">
        Par défaut, seules l'année en cours et l'année précédente sont affichées.
      </h6>
      <h6 className="text-sm font-bold text-[#4DB9BB] mb-4">
        Pour accéder aux autres exercices, veuillez renseigner la période souhaitée.
      </h6>

      {/* Barre de recherche */}
      <div className="border-2 border-gray-300 p-5 bg-gray-50 w-full mb-6">
        <legend className="text-lg font-semibold text-gray-400 mb-4">Critères de recherche</legend>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Situation</label>
            <select 
              className="p-2 border border-gray-300 rounded-md w-full"
              value={selectedSituation}
              onChange={(e) => setSelectedSituation(e.target.value)}
            >
              <option value="Tous">Tous</option>
              <option value="Payé">Payé</option>
              <option value="Retourné">Retourné</option>
              <option value="Annulé">Annulé</option>
              <option value="En cours">En cours</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Date de début</label>
            <input 
              type="date" 
              className="p-2 border border-gray-300 rounded-md w-full"
              value={dateDebut}
              onChange={(e) => setDateDebut(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Date de fin</label>
            <input 
              type="date" 
              className="p-2 border border-gray-300 rounded-md w-full"
              value={dateFin}
              onChange={(e) => setDateFin(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex space-x-4">
          <button 
            className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={rechercher}
          >
            Rechercher
          </button>
          <button 
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            onClick={reinitialiser}
          >
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Graphiques */}
      <div className="bg-[#F5F5DC] p-4 rounded-lg flex justify-center items-center">
        {/* Graphique en camembert */}
        <div className="bg-[#F5F5DC] p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4 text-center">Répartition des dossiers</h2>
          <div className="flex flex-col items-center">
            <PieChart width={400} height={300}>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        </div>

        {/* Graphique en barres */}
        {/* <div className="bg-[#F5F5DC] p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4 text-center">Montant total par situation</h2>
          <div className="flex flex-col items-center">
            <BarChart
              width={400}
              height={300}
              data={barData}
              margin={{
                top: 5, right: 30, left: 20, bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Montant" fill="#8884d8" />
            </BarChart>
          </div>
        </div> */}
      </div>
      <div className="w-full">
  <h2 className="text-lg font-semibold mb-2">Tableau récapitulatif</h2>
  <div className="overflow-x-auto">
    <table className="w-full border border-gray-300">
      <thead>
        <tr className="bg-blue-900 text-white">
          <th className="p-2">Situation</th>
          {/* <th className="p-2">Nombre</th> */}
          <th className="p-2">Montant total</th>
        </tr>
      </thead>
      <tbody>
        {/* Afficher uniquement la situation sélectionnée */}
        {selectedSituation !== "Tous" && stats[selectedSituation] ? (
          <tr key={selectedSituation} className="text-center bg-neutral-100 border-b border-gray-300">
            <td className="p-2">{selectedSituation}</td>
            {/* <td className="p-2">{stats[selectedSituation].count}</td> */}
            <td className="p-2">{stats[selectedSituation].totalAmount.toFixed(2)} DH</td>
          </tr>
        ) : (
          Object.entries(stats).map(([situation, { count, totalAmount }]) => (
            <tr key={situation} className="text-center bg-neutral-100 border-b border-gray-300">
              <td className="p-2">{situation}</td>
              {/* <td className="p-2">{count}</td> */}
              <td className="p-2">{totalAmount.toFixed(2)} DH</td>
            </tr>
          ))
        )}
        {/* <tr className="bg-gray-200 font-bold">
          <td className="p-2">TOTAL</td>
          <td className="p-2">
            {Object.values(stats).reduce((sum, { count }) => sum + count, 0)}
          </td>
          <td className="p-2">
            {Object.values(stats)
              .reduce((sum, { totalAmount }) => sum + totalAmount, 0)
              .toFixed(2)}{' '}
            DH
          </td>
        </tr> */}
      </tbody>
    </table>
  </div>
</div>


    </div>
  );
}
