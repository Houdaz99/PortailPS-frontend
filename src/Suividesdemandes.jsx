import React, { useState, useEffect } from "react";

// Composant principal pour le suivi des demandes de prise en charge (PEC)
export default function Suividesdemandes() {
  // États de gestion des données et des paramètres de recherche
  const [suiviData, setSuiviData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useState({
    cnss: "",
    dossier: "",
    nombreDossiers: "",
    periodeEnvoi: "",
  });

  const rowsPerPage = 5;

  // Récupération des données depuis l’API lors du premier rendu du composant
  useEffect(() => {
    fetch("http://localhost:8000/api/pec")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched data: ", data);
        setSuiviData(data);
        setFilteredData(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Mise à jour des champs de recherche
  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  // Filtrage des données selon les critères de recherche
  const handleSearchClick = () => {
    const filtered = suiviData.filter((item) => {
      return (
        (searchParams.cnss === "" || (item.N_CNSS && item.N_CNSS.includes(searchParams.cnss))) &&
        (searchParams.dossier === "" || (item.N_PEC && item.N_PEC.includes(searchParams.dossier))) &&
        (searchParams.periodeEnvoi === "" ||
          (item.date_reception &&
            item.date_reception.slice(0, 10) === searchParams.periodeEnvoi))
      );
    });

    setFilteredData(filtered);
    setSearchParams((prev) => ({
      ...prev,
      nombreDossiers: filtered.length.toString(),
    }));
  };

  // Réinitialisation des champs de recherche et affichage de toutes les données
  const handleReset = () => {
    setSearchParams({
      cnss: "",
      dossier: "",
      nombreDossiers: "",
      periodeEnvoi: "",
    });
    setFilteredData(suiviData);
  };

  // Gestion de la pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentData = filteredData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Rendu JSX
  return (
    <>
      <div className="flex !p-0 !flex-none">
        <div className="flex bg-white">
          <main className="p-8 bg-white mt-8">

            {/* En-têtes et titre */}
            <h1 className="text-2xl font-bold text-blue-900 mb-4">
              Suivi des demandes de prise en charge (PEC)
            </h1>
            <h6 className="text-sm font-bold text-[#4DB9BB] mb-4">
              suivi des demandes de prise en charge (PEC) 2020 et postérieur
            </h6>

            {/* Formulaire de recherche */}
            <fieldset className="border-2 border-gray-300 p-5 bg-gray-50">
              <legend className="text-lg font-semibold text-gray-400">
                Critères de recherche
              </legend>

              {/* Ligne 1 : CNSS - Dossier - Nombre de dossiers */}
              <div className="flex space-x-4 mb-4 items-center">
                <div className="w-1/3 max-w-xs">
                  <label className="block text-sm font-medium">Nº CNSS</label>
                  <input
                    type="text"
                    name="cnss"
                    value={searchParams.cnss}
                    onChange={handleSearchChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="w-1/3 max-w-xs">
                  <label className="block text-sm font-medium">Nº de dossier</label>
                  <input
                    type="text"
                    name="dossier"
                    value={searchParams.dossier}
                    onChange={handleSearchChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="w-1/3 max-w-xs">
                  <label className="block text-sm font-medium">Nombre de dossiers</label>
                  <input
                    type="text"
                    name="nombreDossiers"
                    value={searchParams.nombreDossiers}
                    onChange={handleSearchChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    readOnly
                  />
                </div>
              </div>

              {/* Ligne 2 : Date d’envoi */}
              <div className="flex space-x-4 mb-4">
                <label className="block text-sm font-medium">Période d'envoi</label>
                <div className="w-1/3 max-w-xs">
                  <input
                    type="date"
                    name="periodeEnvoi"
                    value={searchParams.periodeEnvoi}
                    onChange={handleSearchChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              {/* Boutons de recherche et de réinitialisation */}
              <div className="flex justify-end space-x-4">
                <button
                  className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={handleSearchClick}
                >
                  Rechercher
                </button>
                <button
                  className="bg-blue-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                  onClick={handleReset}
                >
                  Réinitialiser
                </button>
              </div>
            </fieldset>

            {/* Table des bénéficiaires */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Liste des bénéficiaires</h2>
              <table className="w-full border border-gray-300">
                <thead>
                  <tr className="bg-blue-900 text-white">
                    <th className="p-2">NºCNSS</th>
                    <th className="p-2">Bénéficiaire</th>
                    <th className="p-2">Nº de la PEC</th>
                    <th className="p-2">Date de réception</th>
                    <th className="p-2">Montant demandé DH</th>
                    <th className="p-2">Montant accordé DH</th>
                    <th className="p-2">Statut</th>
                    <th className="p-2">Date situation</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.length > 0 ? (
                    currentData.map((item, index) => (
                      <tr key={index} className="text-center border-b border-gray-300">
                        <td className="p-2">{item.N_CNSS}</td>
                        <td className="p-2">{item.beneficiaire}</td>
                        <td className="p-2">{item.N_PEC}</td>
                        <td className="p-2">{item.date_reception}</td>
                        <td className="p-2">{item.montant_demande}</td>
                        <td className="p-2">{item.montant_accorde}</td>
                        <td className="p-2">
                          <span
                            className={`font-bold text-sm ${
                              item.statut === "PEC accordé"
                                ? "text-green-500"
                                : item.statut === "PEC en cours"
                                ? "text-yellow-500"
                                : item.statut === "PEC retourné" || item.statut === "PEC annulé"
                                ? "text-red-500"
                                : ""
                            }`}
                          >
                            {item.statut}
                          </span>
                        </td>
                        <td className="p-2">{item.dateSituation}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="p-4 text-center text-gray-500">
                        Aucune donnée disponible
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Contrôles de pagination */}
            <div className="flex justify-center mt-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="bg-blue-800 text-white py-2 px-4 rounded-l"
              >
                Précédent
              </button>

              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={`py-2 px-4 ${
                    currentPage === index + 1 ? "bg-blue-600" : "bg-blue-800"
                  } text-white`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="bg-blue-800 text-white py-2 px-4 rounded-r"
              >
                Suivant
              </button>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
