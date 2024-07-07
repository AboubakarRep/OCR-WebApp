import React, { Component } from 'react';
import FileService from '../services/FileService';
import api from "../services/api";
import '../components/UploadImageComponent.css';

class MyImagesComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            imageList: [],
            searchQuery: ""
        };
    }

    componentDidMount() {
        this.loadImages();
    }

    loadImages = () => {
        FileService.getAllImages().then((response) => {
            this.setState({ imageList: response.data });
        });
    }

    handleDownload = (fileDownloadUri) => {
        api.get(fileDownloadUri, { responseType: 'blob' })
          .then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                const fileName = fileDownloadUri.substring(fileDownloadUri.lastIndexOf('/') + 1);
                
                link.href = url;
                link.setAttribute('download', fileName);
                document.body.appendChild(link);
                link.click();
            })
          .catch(error => {
                console.error('Error downloading file: ', error);
            });
    }

    handleDelete = (imageId) => {
        if (!window.confirm("Voulez-vous vraiment supprimer cette image?")) {
            return;
        }

        FileService.deleteImage(imageId)
         .then(response => {
                this.loadImages();
            })
         .catch(error => {
                console.error('Erreur lors de la suppression du fichier: ', error);
            });
    }

    handleSearchChange = (event) => {
        this.setState({ searchQuery: event.target.value });
    }

    render() {
        const { imageList, searchQuery } = this.state;

        const filteredImages = imageList.filter(image =>
            image.uploaderName.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return (
            <div>
                <h2 className='mt-3 text-center mb-5'>My Images</h2>
                
                <div className='mb-3'>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search images..."
                        value={searchQuery}
                        onChange={this.handleSearchChange}
                    />
                </div>

                <div className='row justify-content-center'>
                    {
                        filteredImages.map(
                            image => (
                                <div key={image.id} className='px-0 m-2 border bg-light col-3'>
                                    <div className='hovereffect'>
                                        <img src={image.fileUri} width="283" height="150" alt="no"></img>
                                        <div className='overlay '>
                                            <button
                                                className='info text-primary bg-light border border-dark button-effect1'
                                                onClick={() => this.handleDownload(image.fileDownloadUri)}
                                            >
                                                Download
                                            </button>
                                            <br />
                                            <br />
                                            <a 
                                            className='info text-primary bg-light border border-dark button-effect1'
                                             href={image.fileUri} target="_blank" rel='noopener noreferrer'>View</a>
                                             <br />
                                             <br />
                                            <button
                                                className='info text-danger bg-light border border-dark button-effect3'
                                                onClick={() => this.handleDelete(image.id)}
                                            >
                                                Delete
                                            </button>
                                            <br /> 
                                            <button 
                                            className='info text-danger bg-light border border-dark button-effect3'
                                            >Uploader: {image.uploaderName}</button>

                                        </div>
                                    </div>
                                </div>
                            )
                        )
                    }
                </div>
            </div>
        );
    }
}

export default MyImagesComponent;
