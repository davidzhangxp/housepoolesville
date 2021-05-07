import React, { useState } from "react";
import { Navbar } from "./Navbar";
import { ShowAlert } from "./ShowAlert";
import "../css/Home.css";
import { useHistory } from "react-router";
import { auth } from "../config/Config";

export const ForgotPassword = () => {
    const history = useHistory();
    const [email, setEmail] = useState("");
    const [msg, setMsg] = useState("");
    const backToLogin = () => {
        history.push("/login");
      };
    const forgotPassword=(e)=>{
        e.preventDefault();
        auth.sendPasswordResetEmail(email).then(()=>{
            setMsg("Send you reset password email")
        }).catch(error =>alert.error(error.message))
      }
  return (
    <div>
      <Navbar />

      <div className="form-container">
        <form id="signin-form" onSubmit={forgotPassword}>
          <ul className="form-items">
            <li>
              <h2>Forgot Password</h2>
            </li>
            <li>
            <h4>Please fill in your email, we will send you reset email.</h4>
            </li>
            <li>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                name="email"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </li>
 
            <li>
              <button type="submit" className="primary">
                Reset Password
              </button>
            </li>
      
          </ul>
        </form>
      </div>
      {msg && <ShowAlert message={msg} action={backToLogin} />}
    </div>
  );
};
