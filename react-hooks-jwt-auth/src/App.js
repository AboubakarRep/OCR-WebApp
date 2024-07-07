import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import AppNavbar from "./AppNavbar";
import AuthService from "./services/auth.service";
import MyImagesComponent from "./components/MyImagesComponent";
import UploadImageComponent from "./components/UploadImageComponent";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Profile from "./components/Profile";
import BoardUser from "./components/BoardUser";
import BoardModerator from "./components/BoardModerator";
import BoardAdmin from "./components/BoardAdmin";
import MyImagesByIdComponent from "./components/MyImagesByIdComponent";
import EventBus from "./common/EventBus";
import ResetPassword from "./components/ResetPassword";
import GoogleLoginComponent from "./components/GoogleLoginComponent";
// import FacebookLoginButton from './components/FacebookLoginButton';
import ForgetPasswordComponent from "./components/ForgetPasswordComponent";

const App = () => {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [showMyImages, setShowMyImages] = useState(false);
  const [ShowMyImagesById, setShowMyImagesById] = useState(false);
  const [showModeratorBoard, setShowModeratorBoard] = useState(false);
  const [showAdminBoard, setShowAdminBoard] = useState(false);

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
      setShowModeratorBoard(user.roles.includes("ROLE_MODERATOR"));
      setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
      setShowMyImages(user.roles.includes("ROLE_ADMIN"));
      setShowMyImagesById(user.roles.includes("ROLE_USER")|| user.roles.includes("ROLE_ADMIN"));
    }

    EventBus.on("logout", () => {
      logOut();
    });

    return () => {
      EventBus.remove("logout");
    };
  }, []);

  const logOut = () => {
    AuthService.logout();
    setCurrentUser(undefined);
    setShowModeratorBoard(false);
    setShowAdminBoard(false);
    setShowMyImages(false);
    setShowMyImagesById(false);
  };

  return (
    <div>
      <AppNavbar
        currentUser={currentUser}
        logOut={logOut}
        showMyImages={showMyImages}
        ShowMyImagesById={ShowMyImagesById}
        showModeratorBoard={showModeratorBoard}
        showAdminBoard={showAdminBoard}
      />
      <div className="container mt-3">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/home" element={<Home/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/user" element={<BoardUser/>} />
          <Route path="/mod" element={<BoardModerator/>} />
          <Route path="/admin" element={<BoardAdmin/>} />
          <Route path='/upload' element={<UploadImageComponent />}></Route>
          <Route path='/my-images' element={<MyImagesComponent />}></Route>
          <Route path='/my-imagesbyid' element={<MyImagesByIdComponent/>}></Route>
          <Route path='/forgetPassword' element={<ForgetPasswordComponent/>}></Route>
          <Route path="/resetpwd" element={<ResetPassword />}></Route>
          <Route path="/google" element={< GoogleLoginComponent />}></Route>
          {/* <Route path="/facebook" element={< FacebookLoginButton />}></Route> */}

        </Routes>
      </div>
    </div>
  );
};

export default App;
