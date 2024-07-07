import React, { Component } from 'react';
import FileService from '../services/FileService';
import Tesseract from 'tesseract.js';
import AuthService from '../services/auth.service';
import '../components/UploadImageComponent.css';
import { BarcodeDetector } from 'barcode-detector';

class UploadImageComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            files: null,
            fileUploaded: false,
            uploaderName: '',
            results: [], // Tableau pour stocker les résultats de chaque fichier
            showRetryButton: false,
            uploaderNameError: '', // Ajout d'une clé pour gérer l'erreur de longueur du nom de l'uploader
            isLoadingGlobal: false, // État pour le chargement global
        };
    }

    // Méthode appelée lorsque l'utilisateur sélectionne un fichier
    onFileChange = (event) => {
        const files = event.target.files;
        const fileArray = Array.from(files).map(file => ({
            file,
            name: file.name, // Récupère le nom du fichier
        }));
        this.setState({
            files: fileArray
        });
    }

    // Méthode appelée lorsque l'utilisateur saisit le nom de l'uploader
    onUploaderNameChange = (event) => {
        const value = event.target.value;
        if (value.length <= 20) {
            this.setState({ uploaderName: value, uploaderNameError: '' });
        } else {
            this.setState({ uploaderNameError: 'Le uploaderName ne peut pas dépasser 20 caractères.' });
        }
    }

    // Méthode pour extraire le texte de l'image via OCR
    convertImageToText = async (file) => {
        try {
            const { data: { text } } = await Tesseract.recognize(file);
            return text;
        } catch (error) {
            console.error("Error during OCR:", error);
            return null;
        }
    }

    // Méthode pour extraire les données des codes-barres de l'image
    extractBarcodeData = async (file) => {
        try {
            const image = new Image();
            image.src = URL.createObjectURL(file);
            await new Promise((resolve, reject) => {
                image.onload = () => resolve();
                image.onerror = reject;
            });

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0, image.width, image.height);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

            const barcodeDetector = new BarcodeDetector();
            const barcodes = await barcodeDetector.detect(imageData);

            if (barcodes.length > 0) {
                return barcodes.map(barcode => barcode.rawValue).join(', ');
            } else {
                console.error("No data found in the image.");
                return null;
            }
        } catch (error) {
            console.error("Error extracting data:", error);
            return null;
        }
    }

    // Méthode appelée lorsque l'utilisateur soumet le formulaire d'envoi
    onUpload = async (event) => {
        event.preventDefault();
        const { files, uploaderName } = this.state;

        const formData = new FormData();

        for (const { file } of files) {
            formData.append('files', file);
        }
        formData.append('name', uploaderName);

        const user = AuthService.getCurrentUser();
        const uploaderId = user ? user.id : null;
        formData.append('uploader_Id', uploaderId);

        try {
            this.setState({ isLoadingGlobal: true }); // Démarre le chargement global

            const response = await FileService.uploadImage(formData);
            console.log(response.data);

            // Traitement des fichiers téléchargés
            const results = await Promise.all(this.state.files.map(async ({ file }) => {
                const ocrText = await this.convertImageToText(file);
                const barcodeData = await this.extractBarcodeData(file);
                return { ocrText, barcodeData };
            }));

            this.setState({
                fileUploaded: true,
                showRetryButton: true,
                results
            });
        } catch (error) {
            console.error("Error uploading files:", error);
        } finally {
            this.setState({ isLoadingGlobal: false }); // Arrête le chargement global
        }
    }

    // Méthode pour réinitialiser le formulaire
    retryUpload = () => {
        this.setState({
            files: null,
            fileUploaded: false,
            uploaderName: '',
            results: [],
            isLoadingGlobal: false, // État pour le chargement global
            showRetryButton: false,
            uploaderNameError: '', // Réinitialise également l'erreur du nom de l'uploader
        }, () => {
            window.scrollTo(0, 0);
        });
    }

    // Méthode de rendu de l'interface utilisateur
    render() {
        const { isLoadingGlobal, results, showRetryButton, uploaderNameError } = this.state;

        return (
            <div className='row'>
                <div className='card col-md-6 offset-md-3 mt-5'>
                    <h3 className='text-center'>Upload Image</h3>
                    <div className='card-body'>
                        <form onSubmit={this.onUpload}>
                            <div>
                                <label>Select a file:</label>
                                <input className='mx-2' type='file' name='file' onChange={this.onFileChange} multiple></input>
                            </div>

                            <div className="mt-3">
                                <label>Uploader Name:</label>
                                <input
                                    placeholder="Max 20 caractères"
                                    className='mx-2' type='text' name='uploaderName' value={this.state.uploaderName} onChange={this.onUploaderNameChange}></input>
                                {uploaderNameError && (
                                    <p className="text-danger">{uploaderNameError}</p>
                                )}
                            </div>
                            <button className='btn btn-success btn-sm mt-3' type='submit' disabled={!this.state.files || !this.state.uploaderName}>Upload</button>
                            {showRetryButton && (
                                <button onClick={this.retryUpload} className='btn btn-primary btn-sm mt-3 ml-3'>Retry Upload</button>
                            )}
                        </form>
                    </div>
                </div>
                {isLoadingGlobal && (
                    <div className="global-loader">
                        <p>Processing files...</p>
                        <div className="loader"></div>
                    </div>
                )}
                {results.length > 0 && results.map((result, index) => (
                    <div key={index} className="mt-3">
                        {result.ocrText && (
                            <div className="ocr-box">
                                <h3>Text Extracted by OCR - {this.state.files[index].name}</h3>
                                <p>{result.ocrText}</p>
                            </div>
                        )}
                        {result.barcodeData && (
                            <div className="barcode-data">
                                <h3>Data Extracted - {this.state.files[index].name}</h3>
                                <p>{result.barcodeData}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    }
}

export default UploadImageComponent;
