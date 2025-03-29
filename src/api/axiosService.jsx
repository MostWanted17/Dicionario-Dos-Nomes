import api from '../config/axiosConfig';

// Função POST - Criar novo recurso
export const postData = async (endpoint, data, headers = null) => {
  try {
    // Se o parâmetro 'headers' for fornecido, ele irá substituir o cabeçalho padrão
    const response = await api.post(endpoint, data, {
      headers: headers || api.defaults.headers, // Se não passar nenhum cabeçalho, usa os padrões
    });
    return response.data;
  } catch (error) {
    return { success: false, message: error };
  }
};