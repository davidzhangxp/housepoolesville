import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import "../css/Home.css";
import { clearCartItems, getOrder, getUserInfo, setPaidOrder } from "../localStorage";
import { db,SERVER_URL } from "../config/Config";
import { v4 as uuidv4 } from "uuid";

export default function PaymentForm() {
  const [success, setSuccess] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const { _id, userName, email } = getUserInfo();
  const {
    orderItems,
    shipping,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = getOrder();
  const deleteBasketFromFirestore = () => {
    db.collection("basket")
      .where("userId", "==", _id)
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          const data = querySnapshot.docs.map((doc) => doc.data());
          data.forEach((basket) => {
            db.collection("basket").doc(basket.id).delete();
          });
        }
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });
    if (!error) {
      try {
        const { id } = paymentMethod;
        const response = await axios.post(SERVER_URL, {
          amount: Math.round(totalPrice * 100),
          id: id,
        });
        if (response.data.success) {
          setSuccess(true);
          console.log("success payment");
          const orderId = uuidv4();
          const order = {
            userId: _id,
            userName: userName || email,
            orderItems: orderItems,
            shipping: shipping,
            itemsPrice: itemsPrice,
            shippingPrice: shippingPrice,
            taxPrice: taxPrice,
            totalPrice: totalPrice,
            isPaid: true,
            orderID: orderId,
            date: Date(),
            shippingout:false,
            delivered:false
          }
          db.collection("order").doc(orderId).set(order);
          setPaidOrder(order);
          clearCartItems();
          deleteBasketFromFirestore();
          window.location = '/order'
        }
      } catch (error) {
        console.log("error", error);
      }
    } else {
      console.log(error.message);
    }
  };

  return (
    <div className="stripe-container">
    <div className="stripe-note">Please insert your creadit card number, expire date and CVC</div>
      <div>

        {!success ? (
          <form onSubmit={handleSubmit}>
          <div  className="FormGroup">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#424770",
                    "::placeholder": {
                      color: "#aab7c4",
                    },
                  },
                  invalid: {
                    color: "#9e2146",
                  },
                },
                hidePostalCode:true
              }}
            />

            <button className="stripe_btn" type="submit" disabled={!stripe}>
              Pay
            </button>
            </div>
            
          </form>
        ) : (
          <div>
            <h2>Congrats! you just paid for this order</h2>
          </div>
        )}
      </div>
      </div>
  );
}
