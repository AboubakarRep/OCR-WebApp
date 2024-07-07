import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from "../services/api";
import '../components/UploadImageComponent.css';
import './styles.css';

function ResetPassword({ tokenProp }) {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
    ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    // Vérifier si les mots de passe sont identiques
    if (formData.password!== formData.confirmPassword) {
      setMessage("Les mots de passe doivent correspondre.");
      setMessageType("error");
      return; // Arrêter la fonction ici si les mots de passe ne correspondent pas
    }

    setLoading(true);
    api.get(`/api/auth/users/rest/${token}/${formData.password}`)
    .then(response => {
        console.log(response.data);
        if (response.data === 0) {
          setMessage("Nous n'avons pas trouvé de compte pour ce token.");
          setMessageType("error");
        } else if (response.data === 1) {
          setMessage("Le token est expiré.");
          setMessageType("error");
        } else if (response.data === 2){
          setMessage("Réinitialisation du mot de passe réussie.");
          setMessageType("success");
        } else {
          setMessage("Une erreur s'est produite. Veuillez réessayer.");
          setMessageType("error");
        }
      })
    .catch(error => {
        console.error(error);
        setMessage("Une erreur s'est produite. Veuillez réessayer.");
        setMessageType("error");
      }).finally(() => {
        setLoading(false); // Désactiver le chargement une fois la requête terminée
      });
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Password :</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} />
          {submitted &&!formData.password && <div>Le mot de passe est requis.</div>}
        </div>
        <div>
          <label>Confirmer le mot de passe :</label>
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
          {submitted &&!formData.confirmPassword && <div>La confirmation du mot de passe est requise.</div>}
        </div>
        <button className="btn btn-primary btn-block" disabled={loading || (!formData.password ||!formData.confirmPassword)} type='submit'>
          {loading && (
            <span className="spinner-border spinner-border-sm"></span>
          )}
          Soumettre
        </button>
      </form>
      {message && <div className={`message message-${messageType}`}>{message}</div>}
    </div>
  );
}

export default ResetPassword;
