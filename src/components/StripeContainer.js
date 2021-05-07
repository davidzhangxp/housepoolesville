import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "./PaymentForm";
import "../css/Home.css";

const PUBLIC_KEY =
  "pk_test_51GqnIjIyLvtqdiJDW5dtc4LuX2r9R0DVUwZDRHJ15msFfjCrlXa68ZYjrbFWLFsPPneI1I5Kr817Gr74SQGczT0m00gBseYDVo";
const stripePromise = loadStripe(PUBLIC_KEY);

export default function StripeContainer() {
    return (
        <Elements stripe={stripePromise}>
          <PaymentForm />
        </Elements>
      );
}
