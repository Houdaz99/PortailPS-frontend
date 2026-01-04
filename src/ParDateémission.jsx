import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDossiersPaiements } from "./store"; // Importation de l'action de récupération des données
import Asidebar from "./Asidebar"; // Composant de la barre latérale

export default function ParDateEmission() {
  // Initialisation des hooks
  const dispatch = useDispatch();
  const { dossiersPaiements } = useSelector((state) => state.dossierPaiement);

  const [selectedDate, setSelectedDate] = useState("");
  const [totalMontant, setTotalMontant] = useState(0);
  const [filteredPaiements, setFilteredPaiements] = useState([]);
  const [groupedPaiements, setGroupedPaiements] = useState({});

  /**
   * Effet exécuté au montage pour déclencher la récupération
   * des dossiers de paiements depuis le store Redux.
   */
  useEffect(() => {
    dispatch(fetchDossiersPaiements());
  }, [dispatch]);

  /**
   * Effet qui se déclenche à chaque mise à jour des paiements.
   * Il permet de :
   * - Regrouper les paiements par année
   * - Calculer le montant total payé
   */
  useEffect(() => {
    const grouped = dossiersPaiements.reduce((acc, paiement) => {
      const year = new Date(paiement.Date_Paiement).getFullYear();
      if (!acc[year]) acc[year] = { paiements: [], total: 0 };
      acc[year].paiements.push(paiement);
      acc[year].total += parseFloat(paiement.Montant_Paye);
      return acc;
    }, {});
    setGroupedPaiements(grouped);

    const sommeInitiale = dossiersPaiements.reduce(
      (acc, paiement) => acc + parseFloat(paiement.Montant_Paye),
      0
    );
    setTotalMontant(sommeInitiale);
  }, [dossiersPaiements]);

  /**
   * Fonction de recherche basée sur l'année sélectionnée.
   * Elle filtre les paiements et calcule le total associé.
   */
  const rechercher = () => {
    if (!selectedDate) {
      alert("Veuillez sélectionner une année !");
      return;
    }

    const selectedYear = new Date(selectedDate).getFullYear();
    const paiementsFiltres = dossiersPaiements.filter(
      (paiement) =>
        new Date(paiement.Date_Paiement).getFullYear() === selectedYear
    );

    const totalPourAnnee = paiementsFiltres.reduce(
      (acc, paiement) => acc + parseFloat(paiement.Montant_Paye),
      0
    );

    setTotalMontant(totalPourAnnee);
    setFilteredPaiements(paiementsFiltres);
  };

  /**
   * Réinitialisation des filtres et retour à l’affichage global.
   */
  const reinitialiser = () => {
    setSelectedDate("");
    setFilteredPaiements([]);
    const total = dossiersPaiements.reduce(
      (acc, paiement) => acc + parseFloat(paiement.Montant_Paye),
      0
    );
    setTotalMontant(total);
  };

  return (
    <div className="flex !p-0 !flex-none">
      {/* Contenu principal */}
      <div className="flex bg-white w-full">
        <main className="p-8 bg-white w-full">
          {/* En-tête */}
          <h1 className="text-2xl font-bold text-blue-900 mb-4">
            Suivi des détails des paiements
          </h1>
          <h6 className="text-sm font-bold text-[#4DB9BB] mb-4">
            Par défaut, toutes les années sont affichées. Utilisez la recherche pour filtrer.
          </h6>

          {/* Formulaire de critères de recherche */}
          <fieldset className="mb-8 p-6 bg-gray-50 border-2 border-gray-300 rounded-lg max-w-[800px] mx-auto">
            <legend className="text-lg font-semibold text-gray-400 px-2">
              Critères de recherche
            </legend>

            {/* Sélection de l'année */}
            <div className="flex space-x-4 mb-4 items-center">
              <div className="w-1/3 max-w-xs">
                <label className="block text-sm font-medium">
                  Année de dépôt
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                >
                  <option value="">Sélectionner une année</option>
                  {Object.keys(groupedPaiements).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex justify-end space-x-4">
              <button
                className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={rechercher}
              >
                Rechercher
              </button>
              <button
                className="bg-blue-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                onClick={reinitialiser}
              >
                Réinitialiser
              </button>
            </div>
          </fieldset>

          {/* Tableau des paiements */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Liste des bénéficiaires</h2>
            <table className="w-full border border-gray-300">
              <thead>
                <tr className="bg-blue-900 text-white">
                  <th className="p-2">Montant global viré</th>
                  <th className="p-2">Date d'émission</th>
                </tr>
              </thead>
              <tbody>
                {/* Affichage groupé par année */}
                {Object.keys(groupedPaiements).map((year) => (
                  <tr key={year} className="text-center border-b border-gray-300">
                    <td className="p-2 font-bold text-green-600">
                      {groupedPaiements[year].total.toFixed(2)} MAD
                    </td>
                    <td className="p-2">{year}</td>
                  </tr>
                ))}

                {/* Affichage filtré par recherche */}
                {filteredPaiements.map((paiement, index) => (
                  <tr key={index} className="text-center border-b border-gray-300">
                    <td className="p-2 font-bold text-green-600">
                      {parseFloat(paiement.Montant_Paye).toFixed(2)} MAD
                    </td>
                    <td className="p-2">
                      {new Date(paiement.Date_Paiement).toLocaleDateString()}
                    </td>
                  </tr>
                ))}

                {/* Ligne de total général (optionnelle) */}
                {/* 
                <tr className="text-center font-bold bg-gray-100">
                  <td className="p-2 text-green-700">{totalMontant.toFixed(2)} MAD</td>
                  <td className="p-2">Total</td>
                </tr>
                */}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
