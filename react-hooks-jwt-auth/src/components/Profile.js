import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import AuthService from "../services/auth.service";

// Styles futuristes
const Container = styled.div`
  max-width: 600px;
  margin: 50px auto;
  padding: 40px;
  background: linear-gradient(135deg, #1f1f1f, #000);
  border: 1px solid #333;
  border-radius: 10px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  color: #ddd;
  font-family: 'Roboto', sans-serif;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 20px;

  h3 {
    font-size: 32px;
    margin-bottom: 10px;
    color: #fff;
  }
`;

const ProfileItem = styled(motion.div)`
  margin-bottom: 30px;
  cursor: pointer;
  overflow: hidden;
  position: relative;

  strong {
    font-size: 22px;
    font-weight: bold;
    display: block;
    margin-bottom: 10px;
    color: #fff;
  }

  p {
    font-size: 18px;
    margin: 0;
    color: #ddd;
    transition: color 0.3s ease;
  }

  &:hover {
    p {
      color: #fff;
    }

    &:before {
      transform: scaleX(1);
    }
  }

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.1);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.5s cubic-bezier(0.25, 1, 0.5, 1);
    z-index: -1;
  }
  /* Désactiver le curseur de type pointer */
  cursor: default;
`;

const ProfileList = styled.ul`
  padding: 0;
  list-style-type: none;
  margin-top: 20px;
  font-size: 16px;

  li {
    color: #aaa;
    margin-bottom: 5px;
    transition: color 0.3s ease;

    &:hover {
      color: #fff;
    }
  }
`;

const Profile = () => {
  const currentUser = AuthService.getCurrentUser();

  if (!currentUser) {
    return <div>Chargement en cours...</div>;
  }

  return (
    <Container>
      <Header>
        <h3>
          <strong>{currentUser.username}</strong> Profile
        </h3>
      </Header>
      <ProfileItem
        whileHover={{ scale: 1.05 }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <strong>Token:</strong>
        <p>
          {`${currentUser.accessToken.substring(0, 20)} ... ${currentUser.accessToken.substr(
            currentUser.accessToken.length - 20
          )}`}
        </p>
      </ProfileItem>
      <ProfileItem
        whileHover={{ scale: 1.05 }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <strong>Id:</strong>
        <p>{currentUser.id}</p>
      </ProfileItem>
      <ProfileItem
        whileHover={{ scale: 1.05 }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <strong>Email:</strong>
        <p>{currentUser.email}</p>
      </ProfileItem>
      <ProfileItem
        whileHover={{ scale: 1.05 }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <strong>Authorities:</strong>
        <ProfileList>
          {currentUser.roles &&
            currentUser.roles.map((role, index) => (
              <li key={index}>{role}</li>
            ))}
        </ProfileList>
      </ProfileItem>
    </Container>
  );
};

export default Profile;
