import axios from "axios"
import api from './api';
import TokenService from "./token.service";

const BASE_URL = "http://localhost:8081/file"

class FileService {
    getAllImages() {
        // return axios.get(BASE_URL , { headers: authHeader() });
        return api.get('/file');
    }

    uploadImage(fileFormData){
         return axios.post(BASE_URL+'/upload', fileFormData);
        // return api.post('/file/upload', fileFormData);

    }

    getAllFilesByUploaderId() {
        const user = TokenService.getUser();
        const uploaderId = user ? user.id : null;  // Retourne l'ID du user ou null s'il n'y a pas d'utilisateur
        // const currentUser = JSON.parse(localStorage.getItem('user')); // Obtenez l'utilisateur connecté depuis le stockage local
        // const uploaderId = currentUser.id; // Récupérez l'ID de l'utilisateur connecté
        // return axios.get(`${BASE_URL}/uploader/${uploaderId}`, { headers: authHeader() });
        return api.get(`/file/uploader/${uploaderId}`);
    }

    deleteImage(imageId) {
        return api.delete(`/file/${imageId}`);
    }
}

const fileServiceInstance = new FileService();
export default fileServiceInstance;
