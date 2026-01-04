import React, { useState, useEffect } from "react";

// Composant principal pour la gestion des assurés
export default function Assuré() {
  // États pour stocker les données des assurés et les filtres de recherche
  const [assures, setAssures] = useState([]);
  const [searchParams, setSearchParams] = useState({
    n_cnss: "",
    cnie: "",
    nom: "",
    prenom: "",
    datenaissance: "",
  });
  const [filteredAssures, setFilteredAssures] = useState([]);
  const [selectedAssure, setSelectedAssure] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Chargement initial des données depuis l’API
  useEffect(() => {
    fetch("http://localhost:8000/api/assure")
      .then((response) => response.json())
      .then((data) => {
        setAssures(data);
        setFilteredAssures(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Mise à jour des champs de recherche
  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  // Exécution de la recherche basée sur les critères saisis
  const handleSearchClick = () => {
    const filtered = assures.filter((assure) => {
      return (
        (searchParams.n_cnss === "" || assure.n_cnss.includes(searchParams.n_cnss)) &&
        (searchParams.cnie === "" || assure.cnie.toLowerCase().includes(searchParams.cnie.toLowerCase())) &&
        (searchParams.nom === "" || assure.nom.toLowerCase().includes(searchParams.nom.toLowerCase())) &&
        (searchParams.prenom === "" || assure.prenom.toLowerCase().includes(searchParams.prenom.toLowerCase())) &&
        (searchParams.datenaissance === "" || assure.datenaissance.includes(searchParams.datenaissance))
      );
    });
    setFilteredAssures(filtered);

    // Si un seul assuré correspond, le sélectionner automatiquement
    if (filtered.length === 1) {
      setSelectedAssure(filtered[0]);
    } else {
      setSelectedAssure(null);
    }
  };

  // Réinitialisation des champs de recherche
  const handleReset = () => {
    setSearchParams({
      n_cnss: "",
      cnie: "",
      nom: "",
      prenom: "",
      datenaissance: "",
    });
    setFilteredAssures(assures);
    setSelectedAssure(null);
  };

  // Mise à jour automatique des champs à partir de l’assuré sélectionné
  useEffect(() => {
    if (selectedAssure) {
      setSearchParams({
        n_cnss: selectedAssure.n_cnss || "",
        cnie: selectedAssure.cnie || "",
        nom: selectedAssure.nom || "",
        prenom: selectedAssure.prenom || "",
        datenaissance: selectedAssure.datenaissance || "",
      });
    }
  }, [selectedAssure]);

  // Détermination de la tranche de données à afficher (pagination)
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentData = filteredAssures.slice(indexOfFirstRow, indexOfLastRow);

  // Changement de page
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(filteredAssures.length / rowsPerPage);

  // Rendu du composant
  return (
    <>
      <div className="flex !p-0 !flex-none">
        <div className="flex bg-white">
          <main className="p-8 bg-white mt-8">
            {/* Titre principal */}
            <h1 className="text-2xl font-bold text-blue-900 mb-4 underline:mt-5">
              Droits Assurés
            </h1>

            {/* Description d'information */}
            <h6 className="text-sm font-bold text-[#4DB9BB] mb-4">
              L'envoi de la prise en charge, en cas de fermeture des droits, à
              l'assuré de droit de bénéficier au tiers payant en cas de
              régularisation de sa situation administrative.
            </h6>

            {/* Formulaire de recherche */}
            <fieldset className="border-2 border-gray-300 p-6 bg-gray-50">
              <legend className="text-lg font-semibold text-gray-500">
                Critères de recherche
              </legend>

              <div className="flex space-x-6 mb-6 items-center">
                {/* Recherche par Nº CNSS */}
                <div className="w-1/3 max-w-xs">
                  <label className="block text-sm font-medium text-gray-600">
                    Nº CNSS
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      name="n_cnss"
                      value={searchParams.n_cnss}
                      onChange={handleSearchChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      className="bg-blue-900 text-white py-2 px-4 rounded-md"
                      onClick={handleSearchClick}
                    >
                      OK
                    </button>
                  </div>
                </div>

                {/* Recherche par CNIE */}
                <div className="w-1/3 max-w-xs">
                  <label className="block text-sm font-medium text-gray-600">
                    CNIE
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      name="cnie"
                      value={searchParams.cnie}
                      onChange={handleSearchChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      className="bg-blue-900 text-white py-2 px-4 rounded-md"
                      onClick={handleSearchClick}
                    >
                      OK
                    </button>
                  </div>
                </div>

                {/* Bouton de réinitialisation */}
                <div className="w-1/3 max-w-xs">
                  <button
                    className="bg-blue-900 hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-md transition duration-300"
                    onClick={handleReset}
                  >
                    Réinitialiser
                  </button>
                </div>
              </div>

              {/* Champs Nom, Prénom, Date de naissance */}
              <div className="flex space-x-6 mb-6">
                <div className="w-1/3 max-w-xs">
                  <label className="block text-sm font-medium text-gray-600">
                    Nom
                  </label>
                  <input
                    type="text"
                    name="nom"
                    value={searchParams.nom}
                    onChange={handleSearchChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    readOnly
                  />
                </div>

                <div className="w-1/3 max-w-xs">
                  <label className="block text-sm font-medium text-gray-600">
                    Prénom
                  </label>
                  <input
                    type="text"
                    name="prenom"
                    value={searchParams.prenom}
                    onChange={handleSearchChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    readOnly
                  />
                </div>

                <div className="w-1/3 max-w-xs">
                  <label className="block text-sm font-medium text-gray-600">
                    Date de naissance
                  </label>
                  <input
                    type="text"
                    name="datenaissance"
                    value={searchParams.datenaissance}
                    onChange={handleSearchChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    readOnly
                  />
                </div>
              </div>
            </fieldset>

            {/* Tableau des bénéficiaires */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">
                Liste des bénéficiaires
              </h2>
              <table className="w-full border border-gray-300">
                <thead>
                  <tr className="bg-blue-900 text-white">
                    <th className="p-2">Lien de parenté</th>
                    <th className="p-2">Nom et prénom</th>
                    <th className="p-2">Date de naissance</th>
                    <th className="p-2">CNIE</th>
                    <th className="p-2">Nº CNSS</th>
                    <th className="p-2">Droit</th>
                    <th className="p-2">Date début</th>
                    <th className="p-2">Date fin</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.length > 0 ? (
                    currentData.map((assure, index) => (
                      <tr key={index} className="text-center border-b border-gray-300">
                        <td className="p-2">{assure.lien_parente}</td>
                        <td className="p-2">{assure.nom} {assure.prenom}</td>
                        <td className="p-2">{assure.date_naissance}</td>
                        <td className="p-2">{assure.cnie}</td>
                        <td className="p-2">{assure.n_cnss}</td>
                        <td className="p-2">
                          <span className={`font-bold text-sm ${assure.droit === "ouvert" ? "text-green-500" : "text-red-500"}`}>
                            {assure.droit.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-2">{assure.date_debut}</td>
                        <td className="p-2">{assure.date_fin}</td>
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
                  className={`py-2 px-4 ${currentPage === index + 1 ? 'bg-blue-600' : 'bg-blue-800'} text-white`}
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
