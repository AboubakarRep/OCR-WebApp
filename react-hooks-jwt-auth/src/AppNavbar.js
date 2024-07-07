import React, { useState } from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaHome, FaUpload, FaImage, FaUser, FaSignOutAlt, FaBars, FaCog } from 'react-icons/fa';
import { FiSettings } from "react-icons/fi";

import "./App.css";

const AppNavbar = ({ currentUser, logOut, showMyImages, ShowMyImagesById, showModeratorBoard, showAdminBoard }) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedNavItem, setSelectedNavItem] = useState({ title: "Home", icon: <FaHome /> });

  const handleNavItemSelect = (title, icon) => {
    setSelectedNavItem({ title, icon });
    setExpanded(false);
  };

  const handleLogout = () => {
    console.log("Logging out...");
    logOut(); // Assurez-vous que cette fonction fonctionne correctement
    setExpanded(false);
  };

  return (
    <Navbar expand="lg" bg="dark" variant="dark" expanded={expanded}>
      <Navbar.Brand as={Link} to={"/"}>
        OCR App
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded(!expanded)}>
        <FaBars />
      </Navbar.Toggle>
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <NavDropdown title={<>{selectedNavItem.icon} {selectedNavItem.title}</>} id="basic-nav-dropdown">
            <NavDropdown.Item as={Link} to={"/home"} onClick={() => handleNavItemSelect("Home", <FaHome />)}>Home</NavDropdown.Item>
            <NavDropdown.Item as={Link} to={"/upload"} onClick={() => handleNavItemSelect("UploadImage", <FaUpload />)}><FaUpload /> UploadImage</NavDropdown.Item>
            {showMyImages && <NavDropdown.Item as={Link} to={"/my-images"} onClick={() => handleNavItemSelect("My Images", <FaImage />)}><FaImage /> My Images</NavDropdown.Item>}
            {ShowMyImagesById && <NavDropdown.Item as={Link} to={"/my-imagesbyid"} onClick={() => handleNavItemSelect("My UploadImages", <FaImage />)}><FaImage /> My UploadImages</NavDropdown.Item>}
            {showModeratorBoard && <NavDropdown.Item as={Link} to={"/mod"} onClick={() => handleNavItemSelect("Moderator Board", <FaCog />)}>Moderator Board</NavDropdown.Item>}
            {showAdminBoard && <NavDropdown.Item as={Link} to={"/admin"} onClick={() => handleNavItemSelect("Admin Board", <FiSettings />)}>Admin Board</NavDropdown.Item>}
            {currentUser && <NavDropdown.Item as={Link} to={"/user"} onClick={() => handleNavItemSelect("User", <FaUser />)}><FaUser /> User</NavDropdown.Item>}
          </NavDropdown>
        </Nav>
        {currentUser ? (
          <Nav className="mr-4">
            <NavDropdown title={<>{<FaUser />} {currentUser.username}</>} id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to={"/profile"} onClick={() => setExpanded(false)}>Profile</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/login" onClick={handleLogout}><FaSignOutAlt /> Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        ) : (
          <Nav>
            <Nav.Link as={Link} to={"/login"} onClick={() => setExpanded(false)}><FaUser /> Login</Nav.Link>
            <Nav.Link as={Link} to={"/register"} onClick={() => setExpanded(false)}><FaSignOutAlt /> Sign Up</Nav.Link>
          </Nav>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default AppNavbar;
