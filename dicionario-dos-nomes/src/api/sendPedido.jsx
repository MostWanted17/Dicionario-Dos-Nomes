import { postData } from './axiosService';

export const pedido = async (nome) => {
  try {
    const response = await postData('/sendEmail.php', { nome });
    return response;
  } catch (error) {
    return { success: false, message: 'Erro ao conectar com o servidor.' };
  }
};