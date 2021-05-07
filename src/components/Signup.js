import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import "../css/Home.css";
import { auth, db } from "../config/Config";
import { useAlert } from "react-alert";
import { ShowAlert } from "./ShowAlert";
import { setUserInfo } from "../localStorage";
import { Navbar } from "./Navbar";

export const Signup = () => {
  const alert = useAlert();
  const history = useHistory();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const signup = (e) => {
    e.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((res) => {
        //save to database
        db.collection("users").doc(res.user.uid).set({
          objectId: res.user.uid,
          userName: name,
          email: email,
          admin: false,
          verify: false,
        });
        //send verification email and alert
        res.user.sendEmailVerification({
          url: "http://localhost:3000/login",
        });
        setMsg("Verfication Email Sent! Verify your account before login");
      })
      .then((res) => {
        //save user to local storage
        setUserInfo({
          _id: res.user.uid,
          userName: name,
          email: email,
          admin: false,
          verify: false,
        });
      })
      .then(() => {
        setName("");
        setEmail("");
        setPassword("");
      })
      .catch((err) => {
        alert.error(err.message, { timeout: 5000, type: "error" });
      });
  };
  const backToLogin = () => {
    history.push("/login");
  };

  return (
    <div>
      <Navbar />
      <div className="form-container">
        <form id="signup-form" onSubmit={signup}>
          <ul className="form-items">
            <li>
              <h2>Register</h2>
            </li>
            <li>
              <label htmlFor="name">Name</label>
              <input
                type="name"
                name="name"
                id="name"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
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
              <button type="submit" className="primary">
                Register
              </button>
            </li>
            <li>
              <div>
                Already have an account?
                <Link to="/login" className="login_label">Login</Link>
              </div>
            </li>
          </ul>
        </form>
        {msg && <ShowAlert message={msg} action={backToLogin} />}
      </div>
    </div>
  );
};
