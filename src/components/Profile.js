import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import firebase from "firebase";
import { clearUser, getUserInfo } from "../localStorage";
import { db } from "../config/Config";
import * as moment from 'moment'
import { Navbar } from './Navbar'
import { Link } from "react-router-dom";


export const Profile = () => {
  const { _id, userName, email, admin } = getUserInfo();
  const [orders, setOrders] = useState([]);
  const [orderDetail, setOrderDetail] = useState(null);
  const alert = useAlert();
  
  const logout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        alert.success("logout");
        clearUser();
      })
      .catch((error) => {
        // An error happened.
        alert.error(error.message);
      });
  };
  useEffect(() => {
    db.collection("order")
      .where("userId", "==", _id)
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          const data = querySnapshot.docs.map((doc) => doc.data());
          setOrders(data);
        }
      });
  });
  const showDetail = (id) => {
    const orderDetail = orders.find((x) => x.orderID === id);
    setOrderDetail(orderDetail);
    
  };
const closeDetail = ()=>{
    setOrderDetail(null)
}
const dateFormatter = (date)=>{
  const newDate = moment(date).format("DD-MM-YYYY")
  return newDate
}

  return (
    <div className="profile-container">
    <Navbar />
      <div className="profile">
        <div className="profile-info">
          <div className="form-container">
            <ul className="form-items">
              <li>
                <h2>User Profile</h2>
              </li>
              <li>
                <label htmlFor="name">Name:{userName}</label>
              </li>
              <li>
                <label htmlFor="email">Email:{email}</label>
              </li>

              <li>
                <button type="button" id="signout-button" onClick={logout}>
                  Sign out
                </button>
              </li>      
              {admin && 
               <li>
              <Link to="/dashboard"><button type="button" id="signout-button" className="fw">
                  Admin Dashboard
                </button></Link>
              </li>
              }
            </ul>
          </div>
        </div>
        <div className="profile-orders">
          <h2>Order History</h2>
          <table>
            <thead>
              <tr>
                <th> ORDER ID</th>
                <th> DATE </th>
                <th> TOTAL</th>
                <th> DELIVERED</th>
                <th> ORDER DETAIL</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="6">NO ORDER FOUND</td>
                </tr>
              ) : (
                orders.sort((a, b) => (a.date < b.date ? 1 : -1)).map((order) => (
                  <tr key={order.orderID}>
                    <td
                      onClick={() => showDetail(order.orderID)}
                      className="order_detail"
                    >
                      {order.orderID}
                    </td>
                    <td>{order.date ? dateFormatter(order.date) : "not paid yet"}</td>
                    <td>${order.totalPrice}</td>
                    <td>{order.deliveredAt || "No"}</td>
                    <td
                      onClick={() => showDetail(order.orderID)}
                      className="order_detail"
                    >
                      DETAIL
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {orderDetail && (
        <div className="show_order_detail">
          <div className="order-cart-list">
            <ul className="cart-list-container">
              <li>
                <h3>shopping cart</h3>
                <div>Price</div>
              </li>
              {orderDetail.orderItems.map((item) => (
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
            <div className="close_btn_style">
              <button  className="close_btn" onClick={closeDetail}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
