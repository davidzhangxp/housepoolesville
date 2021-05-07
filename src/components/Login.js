import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../css/Home.css";
import { auth, db } from "../config/Config";
import { useAlert } from "react-alert";
import { setUserInfo } from "../localStorage";
import { Navbar } from "./Navbar";
import { ShowAlert } from "./ShowAlert";
import firebase from 'firebase/app'
import 'firebase/auth'
import facebook_button from '../images/facebook_button.png'
import google_login_button from '../images/google_signin_button.png'


export const Login = () => {

  const alert = useAlert();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const login = (e) => {
    e.preventDefault();
    auth
    .signInWithEmailAndPassword(email, password)
    .then((res) => {
      if (res.user.emailVerified) {
        db.collection("users").doc(res.user.uid).get()
        .then((doc) => {
          if (doc.exists){
            console.log(doc.data())
            if(doc.data().verify === true){
              setUserInfo({
                _id:doc.data().objectId,
                userName: doc.data().userName,
                email: doc.data().email,
                admin: doc.data().admin,
                verify:true})
            }else{
              db.collection("users").doc(res.user.uid).update({verify:true})
              setUserInfo({
                _id:doc.data().objectId,
                userName: doc.data().userName,
                email: doc.data().email,
                admin: doc.data().admin,
                verify:true})
            }
          }
        })
        
        .then(()=>{
          setEmail("")
          setPassword("")
          window.location='/'
        }
        )
        .catch((err) =>{

        })
        
      } else {
        setMsg("You didn't Verify your email,Already sent you email.");
        res.user.sendEmailVerification();
      }
    })

    .catch((err) => {
      alert.error(err.message);
    });
  };

  const loginWithGoogle = (e) => {
    e.preventDefault();
    var provider = new firebase.auth.GoogleAuthProvider();
    auth
    .signInWithPopup(provider)
      .then((result) => {
        var user = result.user;
        db.collection("users").doc(user.uid).get()
        .then((doc)=>{
          if(doc.exists){
            setUserInfo({
              _id: user.uid,
              userName: user.displayName || "",
              email: user.email || "",
              admin: false,
              verify: true,
            });
          }else{
            db.collection("users").doc(user.uid).set({
              objectId: user.uid,
              userName: user.displayName || "",
              email: user.email || "",
              admin: false,
              verify: true,
            });
            setUserInfo({
              _id: user.uid,
              userName: user.displayName || "",
              email: user.email || "",
              admin: false,
              verify: true,
            });
          }
        })
        .then(()=>{
          window.location='/';
        })
        .catch((error) => {
          alert.error(error.message);
          console.log(error.message)
        });
      })
      .catch((error) => {
        alert.error(error.message);
        console.log(error.message)
      });
  };
  const loginWithFacebook = (e) => {
    e.preventDefault();
    var provider = new firebase.auth.FacebookAuthProvider();
    auth
    .signInWithPopup(provider)
      .then((result) => {
        var user = result.user;
        db.collection("users").doc(user.uid).get()
        .then((doc)=>{
          if (doc.exists){
            setUserInfo({
              _id: user.uid,
              userName: user.displayName || "",
              email: user.email || "",
              admin: false,
              verify: true,
            });
          }else{
            db.collection("users").doc(user.uid).set({
              objectId: user.uid,
              userName: user.displayName || "",
              email: user.email || "",
              admin: false,
              verify: true,
            });
            setUserInfo({
              _id: user.uid,
              userName: user.displayName || "",
              email: user.email || "",
              admin: false,
              verify: true,
            });
          }
        })
        .catch((error)=>{
          alert.error(error.message);
        })
      })
      .then(()=>{
        window.location='/'
      })
      .catch((error) => {
        alert.error(error.message);
        console.log(error.message)
      });
  };

  const dismissAlert = () => {
    setMsg("");
  };

  return (
    <div>
      <Navbar />
      <div className="group-container">
        <div className="form-container-login">
          <form id="signin-form" onSubmit={login}>
            <ul className="form-items-login">
              <li>
                <h2>Sign-In</h2>
              </li>
              <li>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </li>
              <li>
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
              </li>
              <li>
                <Link to="/forgot_password" id="forgot_password_label">
                  Forgot Password?
                </Link>
              </li>
              <li>
                <button type="submit" className="primary">
                  SignIn
                </button>
              </li>
            </ul>
          </form>
          <div className="other-signin-button">
            <form id="signInWithGoogle" onSubmit={loginWithGoogle}>
              <button><img src={google_login_button} alt="" /></button>
            </form>
            <form id="signInWithFacebook" onSubmit={loginWithFacebook}>
              <button><img src={facebook_button} alt="" /></button>
            </form>
          </div>
          <div className="signin-footlabel">
            New User?
            <Link to="/signup" className="login_label">
              Create Account
            </Link>
          </div>
        </div>
        {msg && <ShowAlert message={msg} action={dismissAlert} />}
      </div>
    </div>
  );
};
