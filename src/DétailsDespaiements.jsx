import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDossiersPaiements } from "./store"; // Action Redux pour récupérer les paiements
import Asidebar from "./Asidebar";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

/**
 * Composant principal de gestion des paiements.
 * Permet la recherche, l'affichage et la pagination des dossiers de paiement.
 */
export default function DétailsDespaiements() {
  const dispatch = useDispatch();

  // Extraction des données du store Redux
  const { dossiersPaiements, loadingPaiements, errorPaiements } = useSelector(
    (state) => state.dossierPaiement
  );

  // États locaux liés aux champs de recherche et pagination
  const [numeroCNSS, setNumeroCNSS] = useState("");
  const [numeroDR, setNumeroDR] = useState("");
  const [selectedSituation, setSelectedSituation] = useState("payé");
  const [dateDepot, setDateDepot] = useState("");
  const [filteredDossiers, setFilteredDossiers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const dossiersPerPage = 3;

  // Définition des indices de pagination
  const indexOfLastDossier = currentPage * dossiersPerPage;
  const indexOfFirstDossier = indexOfLastDossier - dossiersPerPage;
  const currentDossiers = filteredDossiers.slice(indexOfFirstDossier, indexOfLastDossier);

  // Récupération des dossiers de paiements au montage
  useEffect(() => {
    dispatch(fetchDossiersPaiements());
  }, [dispatch]);

  // Synchronisation de la liste filtrée avec les données du store
  useEffect(() => {
    setFilteredDossiers(dossiersPaiements);
  }, [dossiersPaiements]);

  // Normalisation des textes pour éviter les erreurs de casse
  const normalizeSituation = (situation) =>
    situation ? situation.toLowerCase().trim() : "";

  /**
   * Filtrage des dossiers selon les critères saisis
   */
  const rechercher = () => {
    const resultatsFiltres = dossiersPaiements.filter((dossier) => {
      const matchesCNSS = numeroCNSS === "" || dossier.N_CNSS.toString() === numeroCNSS;
      const matchesDR = numeroDR === "" || dossier.N_DR.toString() === numeroDR;
      const matchesSituation =
        selectedSituation === "Tous" ||
        normalizeSituation(dossier.Situation) === normalizeSituation(selectedSituation);
      const matchesDateDepot = dateDepot === "" || dossier.Date_Depot === dateDepot;

      return matchesCNSS && matchesDR && matchesSituation && matchesDateDepot;
    });

    setFilteredDossiers(resultatsFiltres);
    setCurrentPage(1); // Réinitialisation de la pagination après recherche
  };

  // Navigation : page suivante
  const nextPage = () => {
    const maxPage = Math.ceil(filteredDossiers.length / dossiersPerPage);
    if (currentPage < maxPage) setCurrentPage(currentPage + 1);
  };

  // Navigation : page précédente
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Réinitialisation des critères de recherche
  const reinitialiser = () => {
    setNumeroCNSS("");
    setNumeroDR("");
    setSelectedSituation("payé");
    setDateDepot("");
    setFilteredDossiers(dossiersPaiements);
    setCurrentPage(1);
  };

  return (
    <div className="flex !p-0 !flex-none">
      <div className="flex bg-white">
        <main className="p-8 bg-white">

          {/* Titre principal */}
          <h1 className="text-2xl font-bold text-blue-900 mb-4">
            Suivi des paiements
          </h1>

          {/* Note explicative */}
          <h6 className="text-sm font-bold text-[#4DB9BB] mb-4">
            par défaut,seules l'année en cours et l'année précédente sont affichées
          </h6>

          {/* Formulaire de recherche */}
          <fieldset className="border-2 border-gray-300 p-5 bg-gray-50">
            <legend className="text-lg font-semibold text-gray-400">
              Critères de recherche
            </legend>

            {/* Ligne 1 : Nº CNSS - Nº DR - Total */}
            <div className="flex space-x-4 mb-4 items-center">
              <div className="w-1/3 max-w-xs">
                <label className="block text-sm font-medium">Nº CNSS</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={numeroCNSS}
                  onChange={(e) => setNumeroCNSS(e.target.value)}
                />
              </div>
              <div className="w-1/3 max-w-xs">
                <label className="block text-sm font-medium">Nº DR</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={numeroDR}
                  onChange={(e) => setNumeroDR(e.target.value)}
                />
              </div>
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

            {/* Ligne 2 : Situation - Date de dépôt */}
            <div className="flex space-x-4 mb-4 items-center">
              <div className="w-1/3 max-w-xs">
                <label className="block text-sm font-medium mb-1">Situation dossier</label>
                <select
                  className="p-1 border border-gray-300 rounded-md w-full text-sm"
                  value={selectedSituation}
                  onChange={(e) => setSelectedSituation(e.target.value)}
                >
                  <option value="payé">Payé</option>
                  <option value="validée">Validée</option>
                  <option value="refusée">Refusée</option>
                  <option value="Tous">Tous</option>
                </select>
              </div>
              <div className="w-1/3 max-w-xs">
                <label className="block text-sm font-medium">Date de dépot</label>
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

          {/* Tableau de résultats */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Liste des bénéficiaires</h2>

            {loadingPaiements && <p>Chargement...</p>}
            {errorPaiements && <p className="text-red-500">{errorPaiements}</p>}

            <table className="w-full border border-gray-300">
              <thead>
                <tr className="bg-blue-900 text-white">
                  <th className="p-2">NºCNSS</th>
                  <th className="p-2">Bénéficiaire</th>
                  <th className="p-2">Nº de DR</th>
                  <th className="p-2">Date de Dépot</th>
                  <th className="p-2">Montant payé DH</th>
                  <th className="p-2">Date soins</th>
                  <th className="p-2">Date de Paiement</th>
                  <th className="p-2">Réfacture</th>
                  <th className="p-2">Observation</th>
                </tr>
              </thead>
              <tbody>
                {currentDossiers.length > 0 ? (
                  currentDossiers.map((dossier, index) => (
                    <tr
                      key={index}
                      className="text-center bg-neutral-100 border-b border-gray-300"
                    >
                      <td className="p-2">{dossier.N_CNSS}</td>
                      <td className="p-2">{dossier.Bénéficiaire}</td>
                      <td className="p-2">{dossier.N_DR}</td>
                      <td className="p-2">{dossier.Date_Depot}</td>
                      <td className="p-2">{dossier.Montant_Paye} DH</td>
                      <td className="p-2">{dossier.Date_soins}</td>
                      <td className="p-2">{dossier.Date_Paiement}</td>
                      <td className="p-2">{dossier.Réfacture}</td>
                      <td className="p-2">{dossier.Observation}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="p-2 text-center">Aucun dossier trouvé</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Composant de pagination */}
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
        </main>
      </div>
    </div>
  );
}
