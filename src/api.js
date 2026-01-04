export const API_URL = '/api/login';
// Fonction pour effectuer une requête GET avec le token
export const fetchWithToken = async (url, options = {}) => {
  const token = sessionStorage.getItem('token'); // Récupération du token
  const headers = {
    ...options.headers,
    'Authorization': token ? `Bearer ${token}` : '', // Ajouter le token dans l'en-tête
  };

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });

  return response.json();
};

// Exemple d'utilisation dans un composant
export const getUserProfile = async () => {
  try {
    const profile = await fetchWithToken('/profile');
    return profile;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};
