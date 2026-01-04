import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteSouscompte2, updateSouscompte2 } from './redux/MySlicer';

const GéstionSousCompte1 = () => {
  // Récupération des sous-comptes depuis le store Redux
  const souscomptes = useSelector((state) => state.souscompte2.souscomptes);

  // Initialisation du dispatch Redux
  const dispatch = useDispatch();

  // États locaux pour la gestion de l’édition
  const [editId, setEditId] = useState(null);
  const [newNom, setNewNom] = useState('');
  const [newPrenom, setNewPrenom] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Gérer l'initialisation de l'édition d'un sous-compte
  const handleEdit = (sc) => {
    setEditId(sc.id);
    setNewNom(sc.nom);
    setNewPrenom(sc.prenom);
    setNewPassword(sc.password);
  };

  // Appliquer la mise à jour du sous-compte
  const handleUpdate = () => {
    dispatch(updateSouscompte2({
      id: editId,
      nom: newNom,
      prenom: newPrenom,
      password: newPassword
    }));
    setEditId(null); // Réinitialiser l'édition après la mise à jour
  };

  // Supprimer un sous-compte avec confirmation
  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer ce sous-compte?");
    if (confirmDelete) {
      dispatch(deleteSouscompte2(id));
      alert("Sous-compte supprimé avec succès.");
    }
  };

  return (
    <div className="flex">
      {/* Contenu principal */}
      <div className="flex-1 p-6 mt-30">
        <div className="flex justify-center items-center h-full bg-stone-100-shadow">
          <div className="bg-gray-100 shadow-md rounded-lg w-full max-w-4xl p-8">
            <main>
              {/* Titre principal */}
              <h1 className="text-2xl font-bold text-blue-900 mb-4">GESTION SOUS COMPTES</h1>
              <h6 className="text-sm font-bold text-[#4DB9BB] mb-4">Vos sous comptes</h6>

              {/* Tableau des sous-comptes */}
              <div className="mt-6">
                <h2 className="text-lg font-semibold mb-2">Liste des Sous comptes</h2>

                <table className="w-full border border-gray-300 rounded-lg">
                  <thead className="bg-blue-900 text-white">
                    <tr>
                      <th className="px-4 py-2 text-left">Login</th>
                      <th className="px-4 py-2 text-left">Nom</th>
                      <th className="px-4 py-2 text-left">Prenom</th>
                      <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="text-gray-700">
                    {souscomptes.map((sc) => (
                      <tr key={sc.id} className="hover:bg-gray-200">
                        {/* Affichage dynamique du login */}
                        <td className="px-4 py-2">
                          {editId === sc.id ? `${newNom}.${newPrenom}` : `${sc.nom}.${sc.prenom}`}
                        </td>

                        {/* Champ modifiable pour le nom */}
                        <td className="px-4 py-2">
                          {editId === sc.id ? (
                            <input
                              className="border p-1 rounded"
                              value={newNom}
                              onChange={(e) => setNewNom(e.target.value)}
                            />
                          ) : sc.nom}
                        </td>

                        {/* Champ modifiable pour le prénom */}
                        <td className="px-4 py-2">
                          {editId === sc.id ? (
                            <input
                              className="border p-1 rounded"
                              value={newPrenom}
                              onChange={(e) => setNewPrenom(e.target.value)}
                            />
                          ) : sc.prenom}
                        </td>

                        {/* Boutons d'action : Modifier / Supprimer / Enregistrer */}
                        <td className="px-4 py-2 flex space-x-2">
                          {editId === sc.id ? (
                            <button
                              className="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded"
                              onClick={handleUpdate}
                            >
                              Enregistrer
                            </button>
                          ) : (
                            <>
                              <button
                                className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded"
                                onClick={() => handleEdit(sc)}
                              >
                                Modifier
                              </button>
                              <button
                                className="bg-red-500 hover:bg-red-700 text-white p-2 rounded"
                                onClick={() => handleDelete(sc.id)}
                              >
                                Supprimer
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GéstionSousCompte1;
