import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDossiersRemboursements } from "./store"; 
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
export default function SuiviDossierPage() {
  const dispatch = useDispatch();
  // Récupération des états depuis le store Redux
  const { 
    dossiersRemboursements, 
    loadingRemboursements, 
    errorRemboursements 
  } = useSelector((state) => state.dossierPaiement);
  // Déclaration des états locaux pour les filtres
  const [numeroCNSS, setNumeroCNSS] = useState("");
  const [numeroDR, setNumeroDR] = useState("");
  const [selectedSituation, setSelectedSituation] = useState("");
  const [dateDepot, setDateDepot] = useState("");
  const [filteredDossiers, setFilteredDossiers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const dossiersPerPage = 3;
  // Chargement initial des dossiers via Redux
  useEffect(() => {
    dispatch(fetchDossiersRemboursements()); 
  }, [dispatch]);
  // Synchronisation des données filtrées avec les données globales
  useEffect(() => {
    setFilteredDossiers(dossiersRemboursements);
  }, [dossiersRemboursements]);
  // Fonction utilitaire pour normaliser une situation (en minuscule)
  const normalizeSituation = (situation) => {
    return situation ? situation.toLowerCase() : "";
  };
  // Navigation vers la page suivante
  const nextPage = () => {
    if (currentPage < Math.ceil(filteredDossiers.length / dossiersPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };
  // Navigation vers la page précédente
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  // Fonction de recherche basée sur les critères sélectionnés
  const rechercher = () => {
    const resultatsFiltres = dossiersRemboursements.filter((dossier) => {
      const matchesCNSS = numeroCNSS === "" || dossier.N_CNSS.toString() === numeroCNSS;
      const matchesDR = numeroDR === "" || dossier.n_dr.toString() === numeroDR;
      const dossierSituation = dossier.Situation ? normalizeSituation(dossier.Situation) : "";
      const rechercheSituation = normalizeSituation(selectedSituation);
      const matchesSituation = selectedSituation === "Tous" || dossierSituation === rechercheSituation;
      const matchesDateDepot = dateDepot === "" || dossier.dateDepot === dateDepot;
      return matchesCNSS && matchesDR && matchesSituation && matchesDateDepot;
    });
    setFilteredDossiers(resultatsFiltres);
    setCurrentPage(1); // Réinitialiser la pagination à la première page
  };

  // Réinitialiser tous les champs de recherche
  const reinitialiser = () => {
    setNumeroCNSS("");
    setNumeroDR("");
    setSelectedSituation("");
    setDateDepot("");
    setFilteredDossiers(dossiersRemboursements);
  };

  // Calcul des indices pour la pagination
  const indexOfLastDossier = currentPage * dossiersPerPage;
  const indexOfFirstDossier = indexOfLastDossier - dossiersPerPage;
  const currentDossiers = filteredDossiers.slice(indexOfFirstDossier, indexOfLastDossier);

  // Rendu du composant principal
  return (
    <div className="flex !p-0 !flex-none">
      <div className="flex bg-white">
        <main className="p-8 bg-white">
          {/* Titre principal */}
          <h1 className="text-2xl font-bold text-blue-900 mb-4">
            Suivi des demandes de remboursement
          </h1>

          {/* Sous-titre */}
          <h6 className="text-sm font-bold text-[#4DB9BB] mb-4">
            Suivi des demandes de remboursement 2020 et postérieur
          </h6>

          {/* Formulaire de recherche */}
          <fieldset className="border-2 border-gray-300 p-5 bg-gray-50">
            <legend className="text-lg font-semibold text-gray-400">
              Critères de recherche
            </legend>

            {/* Ligne 1 des champs */}
            <div className="flex space-x-4 mb-4 items-center">
              {/* Champ Nº CNSS */}
              <div className="w-1/3 max-w-xs">
                <label className="block text-sm font-medium">Nº CNSS</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={numeroCNSS}
                  onChange={(e) => setNumeroCNSS(e.target.value)}
                />
              </div>

              {/* Champ Nº DR */}
              <div className="w-1/3 max-w-xs">
                <label className="block text-sm font-medium">Nº DR</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={numeroDR}
                  onChange={(e) => setNumeroDR(e.target.value)}
                />
              </div>

              {/* Affichage du nombre de dossiers filtrés */}
              <div className="w-1/3 max-w-xs">
                <label className="block text-sm font-medium">Nombre de dossiers</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  disabled
                  value={filteredDossiers.length}
                />
              </div>
            </div>

            {/* Ligne 2 des champs */}
            <div className="flex space-x-4 mb-4 items-center">
              {/* Champ Situation dossier */}
              <div className="w-1/3 max-w-xs">
                <label className="block text-sm font-medium mb-1">Situation dossier</label>
                <select
                  className="p-1 border border-gray-300 rounded-md w-full text-sm"
                  value={selectedSituation}
                  onChange={(e) => setSelectedSituation(e.target.value)}
                >
                  <option value="">Tous</option>
                  <option value="Payé">Payé</option>
                  <option value="PEC Retourné">PEC Retourné</option>
                  <option value="Annulé">Annulé</option>
                  <option value="En cours">En cours</option>
                </select>
              </div>

              {/* Champ Date de dépôt */}
              <div className="w-1/3 max-w-xs">
                <label className="block text-sm font-medium">Date de dépôt</label>
                <input
                  type="date"
                  className="p-2 border border-gray-300 rounded-md"
                  value={dateDepot}
                  onChange={(e) => setDateDepot(e.target.value)}
                />
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

          {/* Tableau d'affichage des dossiers */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">
              Liste des bénéficiaires
            </h2>

            {loadingRemboursements && <p>Chargement...</p>}
            {errorRemboursements && <p className="text-red-500">{errorRemboursements}</p>}

            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300">
                <thead>
                  <tr className="bg-blue-900 text-white">
                    <th className="p-2">NºCNSS</th>
                    <th className="p-2">Bénéficiaire</th>
                    <th className="p-2">Nº de dossier</th>
                    <th className="p-2">Date de réception</th>
                    <th className="p-2">Montant demandé (DH)</th>
                    <th className="p-2">Montant accordé (DH)</th>
                    <th className="p-2">Situation</th>
                    <th className="p-2">Date de situation</th>
                  </tr>
                </thead>
                <tbody>
                  {currentDossiers.length > 0 ? (
                    currentDossiers.map((dossier, index) => {
                      const derniereSituation = dossier.situations?.[0] || {};
                      const dateSituation = derniereSituation.pivot?.created_at
                        ? new Date(derniereSituation.pivot.created_at).toLocaleDateString()
                        : 'N/A';

                      return (
                        <tr
                          key={index}
                          className="text-center bg-neutral-100 border-b border-gray-300 hover:bg-gray-50"
                        >
                          <td className="p-2">{dossier.N_CNSS || 'N/A'}</td>
                          <td className="p-2">{dossier.nom_beneficiaire || 'N/A'}</td>
                          <td className="p-2">{dossier.n_dr || 'N/A'}</td>
                          <td className="p-2">{dossier.dateDepot}</td>
                          <td className="p-2">
                            {dossier.montant_demande && !isNaN(parseFloat(dossier.montant_demande))
                              ? parseFloat(dossier.montant_demande).toFixed(2)
                              : '0.00'}
                          </td>
                          <td className="p-2">
                            {dossier.montant_accorde && !isNaN(parseFloat(dossier.montant_accorde))
                              ? parseFloat(dossier.montant_accorde).toFixed(2)
                              : 'N/A'}
                          </td>
                          <td className="p-2">{dossier.situation || 'N/A'}</td>
                          <td className="p-2">{dossier.dateSituation}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center p-4">
                        {loadingRemboursements ? 'Chargement...' : 'Aucune donnée disponible'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-4">
              <button
                onClick={prevPage}
                className="px-4 py-2 bg-blue-900 text-white rounded-l"
                disabled={currentPage === 1}
              >
                <FaChevronLeft />
              </button>
              <span className="px-4 py-2 bg-white text-blue-900">{currentPage}</span>
              <button
                onClick={nextPage}
                className="px-4 py-2 bg-blue-900 text-white rounded-r"
                disabled={currentPage === Math.ceil(filteredDossiers.length / dossiersPerPage)}
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
