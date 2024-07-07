// import React from 'react';
// import FacebookLogin from 'react-facebook-login';

// const FacebookLoginButton = ({ onLoginSuccess, onLoginFailure }) => {
//   const appId = '1126235951762211'; // Remplacez par votre véritable ID d'application Facebook

//   const responseFacebook = (response) => {
//     if (response.accessToken) {
//       console.log('Facebook login success:', response);
//       // Gérez la connexion réussie, par exemple, définissez l'état de l'utilisateur, stockez les jetons, etc.
//       onLoginSuccess(response);
//     } else {
//       console.error('Facebook login failure:', response);
//       // Gérez l'échec de la connexion, par exemple, affichez un message d'erreur
//       onLoginFailure(response);
//     }
//   };                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                

//   return (
//     <FacebookLogin
//       appId={appId}
//       autoLoad={false}
//       fields="name,email,picture"
//       callback={responseFacebook}
//     />
//   );
// };

// export default FacebookLoginButton;
