import api from '../config/axiosConfig';
import CryptoES from 'crypto-es';

const SECRET_KEY = 'Xk7#pL9!qR2$sV5&wY8*zC1@mD4%fG6';

export const postData = async (endpoint, data, headers = null) => {
  try {
    if (typeof data !== 'object' || !data.nome) {
      throw new Error('O parâmetro data deve ser um objeto com o campo nome.');
    }

    // Encriptar só o valor da string nome
    const encrypted = CryptoES.AES.encrypt(data.nome, SECRET_KEY).toString();

    const response = await api.post(endpoint, { payload: encrypted }, {
      headers: headers || api.defaults.headers,
    });

    return response.data;
  } catch (error) {
    return { success: false, message: error.toString() };
  }
};
