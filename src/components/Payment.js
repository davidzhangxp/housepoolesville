import React, { Component } from "react";
import { Link } from "react-router-dom";
import { getCartItems, setShipping, getShipping, setOrder } from "../localStorage";
import { Navbar } from "./Navbar";
import StripeContainer from './StripeContainer.js'


export class Payment extends Component {
  state = { paymentMethod: false };
  componentDidMount(){
    setShipping({
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      postalCode: "",
      country: "USA",
      pickup: true,
    });
  }

  render() {
    const orderItems = getCartItems();
    const shipping = getShipping();
    const itemsPrice = orderItems.reduce(
      (a, c) => a + c.productPrice * c.productQty,
      0
    );
    const shippingPrice = shipping.pickup ? 0 : (itemsPrice > 100 ? 0 : 10 );
    const taxPrice = Math.round(0.15 * itemsPrice * 100) / 100;
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    const createOrder = () => {

      setOrder({
        orderItems:orderItems,
        shipping:shipping,
        itemsPrice:itemsPrice,
        shippingPrice:shippingPrice,
        taxPrice:taxPrice,
        totalPrice:totalPrice,
        paymentMethod:this.state.paymentMethod,
      })
      this.setState({paymentMethod:true})

    };

    return (
      <div>
      <Navbar/>
        <div className="back-to-result">
          <Link to="/cart"> Back to Cart </Link>
        </div>
        <div className="order">
          <div className="order-info">
            <div>
            {shipping.pickup ? <div><h2>Pickup: @Address: 19611 Fisher Ave, Poolesville, MD 20837</h2></div> : 
              <div>
              <h2>Shipping</h2>
                {shipping.address},{shipping.city},{shipping.postalCode}
                {shipping.country}
              </div>}
              
            </div>

            <div className="cart-list">
              <ul className="cart-list-container">
                <li>
                  <h3>shopping cart</h3>
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
                    <div className="cart-price">${item.productPrice * item.productQty}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="order-action">
            <ul>
              <li>
                <h2>Order Summary</h2>
              </li>
              <li>
                <div>Items Price:</div>
                <div>${itemsPrice}</div>
              </li>
              <li>
                <div>Shipping price:</div>
                <div>${shippingPrice}</div>
              </li>
              <li>
                <div>Tax</div>
                <div>${taxPrice}</div>
              </li>
              <li className="total">
                <div>Order Total</div>
                <div>${totalPrice}</div>
              </li>
              <li>
              <button className="fw" style={{ backgroundColor: "green", color: "white" }} onClick={createOrder}>Pay Order</button>
              </li>
            </ul>
          </div>
        </div>
        {this.state.paymentMethod && <StripeContainer />}
      </div>
    );
  }
}

export default Payment;
