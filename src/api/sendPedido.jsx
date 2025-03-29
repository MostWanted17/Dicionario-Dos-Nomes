
import { postData } from './axiosService'; // Importando a função de GET do axiosService

export const pedido = async (nome) => {
  try {
    const pedido = { nome };
    const response = await postData('/sendEmail.php', pedido);

    if (response.success) {
      return { success: true, message: response.message };
    } else {
      return { success: false, message: response.message };
    }
  } catch (error) {
    return { success: false, message: 'Erro ao conectar com o servidor.' };
  }
};