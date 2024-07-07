import React, { useState } from 'react';
import api from "../services/api";
import '../components/styles.css';
import '../components/UploadImageComponent.css';
function ForgetPasswordComponent() {
  const [formData, setFormData] = useState({
    email: '',
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
    setLoading(true);
    console.log("Email:", formData.email); // Affiche l'e-mail dans la console
    console.log("Password:", formData.password);
    api.get(`/api/auth/users/verif/${formData.email}`)
    .then(response => {
      console.log(response.data);
      if (response.data === 1) {
        setMessage("Un lien de réinitialisation a été envoyé à votre adresse e-mail.");
        setMessageType("success");
      } else if (response.data === 0) {
        setMessage("Aucun compte trouvé pour cette adresse e-mail.");
        setMessageType("error");
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
    <div className="forget-password-container">
      <h4>Mot de Passe Oublié</h4>
      <form onSubmit={handleSubmit}>
        <div>
          <label>E-mail :</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
          {submitted && !formData.email && <div>Email is required</div>}
        </div>
        <button className="btn btn-primary btn-block" disabled={loading} type='submit'>
              {loading && (
                <span className="spinner-border spinner-border-sm"></span>
              )}
              Submit
            </button>
      </form>
      {message && <div className={`message message-${messageType}`}>{message}</div>} {/* Affiche le message ici */} 
      </div>
  );
}

export default ForgetPasswordComponent;
