import React from "react";
import { getPaidOrder } from "../localStorage";
import { Navbar } from "./Navbar";

export default function Order() {
  const { userName, orderID, orderItems, shipping, totalPrice } = getPaidOrder();

  return (
    <div>
      <Navbar />
      <div>
        <h2>Congrats {userName}! Here is your Order Information</h2>
        <h3>Order Number: {orderID}</h3>
        <div className="order">
          <div className="order-info">
            <div>
              {shipping.pickup ? (
                <div>
                  <h2>Pickup at: 19611 Fisher Ave, Poolesville, MD 20837</h2>
                </div>
              ) : (
                <div>
                  <h2>Shipping</h2>
                  {shipping.address},{shipping.city},{shipping.postalCode}
                  {shipping.country}
                </div>
              )}
            </div>

            <div className="cart-list">
              <ul className="cart-list-container">
                <li>
                  <h3>Order List:</h3>
                  <div>Price</div>
                </li>
                {orderItems.map((item) => (
                  <li key={item.productId}>
                    <div className="cart-image">
                      <img src={item.productImg} alt={item.productName} />
                    </div>
                    <div className="cart-name">
                      <div>{item.productName}</div>
                      <div>Qty: {item.productQty}</div>
                    </div>
                    <div className="cart-price">
                      ${item.productPrice * item.productQty}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="total">
                <div>Order Total : ${totalPrice}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
