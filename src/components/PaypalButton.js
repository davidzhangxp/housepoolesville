import ReactDOM from "react-dom";
import scriptLoader from "react-async-script-loader";
import { Component } from "react";
import React from "react";
import { db,PAYPAL_CLIENT_ID } from "../config/Config";
import { clearCartItems, getOrder, getUserInfo } from "../localStorage";
import { Link } from "react-router-dom";

 const CLIENT = {
   sandbox:PAYPAL_CLIENT_ID,
   production:
     "your_production_key"
 };
 const {_id} = getUserInfo();
 const CLIENT_ID = CLIENT.sandbox;
 const {orderItems,shipping,itemsPrice,shippingPrice,taxPrice,totalPrice} = getOrder();
 const deleteBasketFromFirestore = ()=>{

    db.collection("basket")
      .where("userId", "==", _id)
      .get()
      .then((querySnapshot) =>{
          if (!querySnapshot.empty){
            const data = querySnapshot.docs.map((doc) => doc.data());
            data.forEach(basket=>{
                db.collection("basket").doc(basket.id).delete();
            })
          }
      })
 }

let PayPalButton = null;
class PaypalButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showButtons: false,
      loading: true,
      paid: false,
      orderID:"",
    };

    window.React = React;
    window.ReactDOM = ReactDOM;
  }

  componentDidMount() {
    const { isScriptLoaded, isScriptLoadSucceed } = this.props;

    if (isScriptLoaded && isScriptLoadSucceed) {
      PayPalButton = window.paypal.Buttons.driver("react", { React, ReactDOM });
      this.setState({ loading: false, showButtons: true });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { isScriptLoaded, isScriptLoadSucceed } = nextProps;

    const scriptJustLoaded =
      !this.state.showButtons && !this.props.isScriptLoaded && isScriptLoaded;

    if (scriptJustLoaded) {
      if (isScriptLoadSucceed) {
        PayPalButton = window.paypal.Buttons.driver("react", {
          React,
          ReactDOM
        });
        this.setState({ loading: false, showButtons: true });
      }
    }
  }
  createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          description: "David purchase",
          amount: {
            currency_code: "USD",
            value: totalPrice
          }
        }
      ]
    });
  };

  onApprove = (data, actions) => {
    actions.order.capture().then(details => {
      const paymentData = {
        payerID: data.payerID,
        orderID: data.orderID
      };
      console.log("Payment Approved: ", paymentData);
      this.setState({ showButtons: false, paid: true ,orderID: data.orderID});

      db.collection('order').doc(data.orderID).set({
        userId:_id,
        orderItems:orderItems,
        shipping:shipping,
        itemsPrice:itemsPrice,
        shippingPrice:shippingPrice,
        taxPrice:taxPrice,
        totalPrice:totalPrice,
        isPaid:true,
        payerID: data.payerID,
        orderID: data.orderID,
        date:Date()
      })
      clearCartItems()
      deleteBasketFromFirestore()
    });
  };

  render() {
    const { showButtons, paid } = this.state;

    return (
      <div className="main">
        

        {showButtons && (
          <div>
            <div>
              <h2>Total checkout Amount ${totalPrice}</h2>
            </div>

            <PayPalButton
              createOrder={(data, actions) => this.createOrder(data, actions)}
              onApprove={(data, actions) => this.onApprove(data, actions)}
            />
          </div>
        )}

        {paid && (
          <div className="main">
          <div className="back-to-result">
                <Link to="/"> Continue to shopping </Link>
            </div>
            <h2>
              Congrats! you just paid for this order. Order Number is {this.state.orderID}
            </h2>
            <h3>
            {shipping.pickup ? <div>You choose pick up at 108 Emma Rd, Bethesda MD , 20818</div> 
              : <div>We will shipping to this address: {shipping.address},{shipping.city},{shipping.postalCode}</div>}
            </h3>
            <div className="cart-list">
              <ul className="cart-list-container">
                <li>
                  <h3>Shopping list</h3>
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
        )}
      </div>
    );
  }
}


 export default scriptLoader(`https://www.paypal.com/sdk/js?client-id=${CLIENT_ID}`)(PaypalButton);
