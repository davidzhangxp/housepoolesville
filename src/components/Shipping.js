import React, { useState } from "react";
import { setShipping } from "../localStorage";
import { ShowAlert } from "./ShowAlert";

export const Shipping = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [pickup, setPickup] = useState(false);
  const [msg, setMsg] = useState("");
  const saveShippingInfo = (e) => {
    e.preventDefault();
    if (
      pickup ||
      (address !== "" && firstName !== "" && city !== "" && postalCode !== "")
    ) {
      setShipping({
        firstName: firstName,
        lastName: lastName,
        address: address,
        city: city,
        postalCode: postalCode,
        country: country,
        pickup: pickup,
      });
      console.log(pickup);
      window.location = "/payment"
    } else {
      setMsg("Please choose pickup or fill in your address information");
    }
  };
  const dismissAlert = () => {
    setMsg("");
  };

  return (
    <div>
      <div className="form-container">
        <form id="shipping-form" onSubmit={saveShippingInfo}>

          <ul className="form-items">
          <div>
          <input
            type="radio"
            name="delivery-method"
            id="shipping"
            onChange={() => setPickup(false)}
            value="shipping"
          />
          <label htmlFor="shipping">Shipping</label>
        </div>
        <div>
          <input
            type="radio"
            name="delivery-method"
            id="pickup"
            onChange={() => setPickup(true)}
            value="pickup"
          />
          <label htmlFor="pickup">Pickup</label>
        </div>
        {!pickup && <div>
            <li>
              <h2>Shipping Address</h2>
            </li>
            <li>
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
              />
            </li>
            <li>
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
              />
            </li>
            <li>
              <label htmlFor="address">Address</label>
              <input
                type="text"
                name="address"
                id="address"
                onChange={(e) => setAddress(e.target.value)}
                value={address}
              />
            </li>
            <li>
              <label htmlFor="city">City</label>
              <input
                type="text"
                name="city"
                id="city"
                onChange={(e) => setCity(e.target.value)}
                value={city}
              />
            </li>
            <li>
              <label htmlFor="postalCode">PostalCode</label>
              <input
                type="text"
                name="postalCode"
                id="postalCode"
                onChange={(e) => setPostalCode(e.target.value)}
                value={postalCode}
              />
            </li>
            <li>
              <label htmlFor="country">Country</label>
              <input
                type="text"
                name="country"
                id="country"
                onChange={(e) => setCountry(e.target.value)}
                value={country}
              />
            </li>
            </div>
        }
            <li>
              <button type="submit" className="primary">
                Continue
              </button>
            </li>
          </ul>
        </form>
      </div>
      {msg && <ShowAlert message={msg} action={dismissAlert} />}
    </div>
  );
};
