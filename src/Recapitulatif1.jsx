import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from "recharts";

// Définition des couleurs pour les segments du graphique
const COLORS = ["#FF6347", "#228B22", "#1E3A8A", "#FF8C00"]; // Rouge, Vert forêt, Bleu foncé, Orange

export default function Récapitulatif1() {
  // États pour la gestion des données et des filtres
  const [suiviData, setSuiviData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedStatut, setSelectedStatut] = useState("Tous");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");

  // Chargement initial des données depuis l'API
  useEffect(() => {
    fetch("http://localhost:8000/api/pec")
      .then((response) => response.json())
      .then((data) => {
        setSuiviData(data);
        setFilteredData(data);
      })
      .catch((error) => console.error("Erreur de chargement des données :", error));
  }, []);

  // Normalisation des statuts pour correspondre aux libellés attendus
  const normalizeStatut = (statut) => {
    if (!statut) return null;
    const lowerStatut = statut.toLowerCase().trim();

    if (lowerStatut.includes('pec accordé')) return 'PEC accordé';
    if (lowerStatut.includes('pec en cours')) return 'PEC en cours';
    if (lowerStatut.includes('pec retourné')) return 'PEC retourné';
    if (lowerStatut.includes('pec annulé')) return 'PEC annulé';

    return null;
  };

  // Filtrage dynamique des données en fonction des critères sélectionnés
  const filteredDataByCriteria = filteredData.filter((dossier) => {
    const matchesStatut = selectedStatut === "Tous" || normalizeStatut(dossier.statut) === selectedStatut;
    const matchesDateDebut = !dateDebut || new Date(dossier.dateDepot) >= new Date(dateDebut);
    const matchesDateFin = !dateFin || new Date(dossier.dateDepot) <= new Date(dateFin);

    return matchesStatut && matchesDateDebut && matchesDateFin;
  });

  // Calcul des statistiques par statut
  const calculateStatistics = () => {
    let stats = {
      "PEC accordé": { count: 0, totalAmount: 0 },
      "PEC en cours": { count: 0, totalAmount: 0 },
      "PEC retourné": { count: 0, totalAmount: 0 },
      "PEC annulé": { count: 0, totalAmount: 0 },
    };

    filteredDataByCriteria.forEach((dossier) => {
      const statut = normalizeStatut(dossier.statut);
      const montant = parseFloat(dossier.montant_accorde) || 0;

      if (statut && stats[statut]) {
        stats[statut].count += 1;
        stats[statut].totalAmount += montant;
      }
    });

    return stats;
  };

  // État local pour stocker les statistiques calculées
  const [stats, setStats] = useState({
    "PEC accordé": { count: 0, totalAmount: 0 },
    "PEC en cours": { count: 0, totalAmount: 0 },
    "PEC retourné": { count: 0, totalAmount: 0 },
    "PEC annulé": { count: 0, totalAmount: 0 },
  });

  // Mise à jour des statistiques lors d’un changement de filtre
  useEffect(() => {
    if (suiviData.length > 0) {
      setStats(calculateStatistics());
    }
  }, [suiviData, selectedStatut, dateDebut, dateFin]);

  // Préparation des données pour le graphique en camembert
  const pieData = [
    { name: "PEC accordé", value: stats["PEC accordé"].count },
    { name: "PEC en cours", value: stats["PEC en cours"].count },
    { name: "PEC retourné", value: stats["PEC retourné"].count },
    { name: "PEC annulé", value: stats["PEC annulé"].count },
  ];

  // Gestion de l'action de recherche
  const rechercher = () => {
    setStats(calculateStatistics());
  };

  // Réinitialisation des filtres et des statistiques
  const reinitialiser = () => {
    setSelectedStatut("Tous");
    setDateDebut("");
    setDateFin("");
    setStats(calculateStatistics());
  };

  // === Interface Utilisateur ===
  return (
    <div className="flex-1 overflow-y-auto p-8 bg-white">
      {/* Titre principal */}
      <h1 className="text-2xl font-bold text-blue-900 mb-4">Suivi des dossiers PEC</h1>

      {/* Section filtres de recherche */}
      <div className="border-2 border-gray-300 p-5 bg-gray-50 w-full mb-6">
        <legend className="text-lg font-semibold text-gray-400 mb-4">Critères de recherche</legend>
        
        {/* Filtres : statut, dates */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Statut</label>
            <select
              className="p-2 border border-gray-300 rounded-md w-full"
              value={selectedStatut}
              onChange={(e) => setSelectedStatut(e.target.value)}
            >
              <option value="Tous">Tous</option>
              <option value="PEC accordé">PEC accordé</option>
              <option value="PEC en cours">PEC en cours</option>
              <option value="PEC retourné">PEC retourné</option>
              <option value="PEC annulé">PEC annulé</option>
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

        {/* Boutons d'action */}
        <div className="flex space-x-4">
          <button
            className="bg-blue-900 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
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

      {/* Affichage graphique des statistiques */}
      <div className="bg-white p-4 rounded-lg flex justify-center items-center">
        <div className="bg-white p-4 rounded-lg">
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
      </div>

      {/* Tableau récapitulatif par statut */}
      <div className="w-full">
        <h2 className="text-lg font-semibold mb-2">Tableau récapitulatif</h2>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th className="p-2">Statut</th>
                <th className="p-2">Montant total</th>
              </tr>
            </thead>
            <tbody>
              {selectedStatut !== "Tous" && stats[selectedStatut] ? (
                <tr key={selectedStatut} className="text-center bg-neutral-100 border-b border-gray-300">
                  <td className="p-2">{selectedStatut}</td>
                  <td className="p-2">{stats[selectedStatut].totalAmount.toFixed(2)} DH</td>
                </tr>
              ) : (
                Object.entries(stats).map(([statut, { totalAmount }]) => (
                  <tr key={statut} className="text-center bg-neutral-100 border-b border-gray-300">
                    <td className="p-2">{statut}</td>
                    <td className="p-2">{totalAmount.toFixed(2)} DH</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
