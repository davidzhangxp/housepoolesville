import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as moment from "moment";
import { db } from "../config/Config";
import { Navbar } from "./Navbar";

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [orderDetail, setOrderDetail] = useState(null);

  useEffect(() => {
    db.collection("order")
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          const data = querySnapshot.docs.map((doc) => doc.data());
          setOrders(data);
        }
      });
  });

  const dateFormatter = (date) => {
    const newDate = moment(date).format("DD-MM-YYYY");
    return newDate;
  };
  const showDetail = (id) => {
    const orderDetail = orders.find((x) => x.orderID === id);
    setOrderDetail(orderDetail);
  };
  const closeDetail = () => {
    setOrderDetail(null);
  };
  const updateShippingStatus = (e) => {
      const orderId = e.target.value
      const order = orders.find((x)=>x.orderID === orderId)
      db.collection("order").doc(orderId).update({shippingout:!order.shippingout})


  };

  return (
    <div>
    <Navbar/>
      <div className="back-to-result">
        <Link to="/"> Back to Home </Link>
      </div>
      <h2>Management Dashboard</h2>
      <div className="addproduct">
        <Link to="/addproducts">
          <button style={{backgroundColor: "red", color: "white" }}>Add New Product</button>
        </Link>
      </div>
      <div>
        <div className="profile-orders">
          <h2>Order List</h2>
          <table>
            <thead>
              <tr>
                <th> ORDER ID</th>
                <th> USER NAME</th>
                <th> DATE </th>
                <th> TOTAL</th>
                <th> PICKUP</th>
                <th> SHIPPING OUT</th>

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
                    <td>{order.userName || "nobody"}</td>
                    <td>
                      {order.date ? dateFormatter(order.date) : "not paid yet"}
                    </td>
                    <td>${order.totalPrice}</td>
                    <td>
                      {order.shipping.pickup ? "Pickup" : "Need Shipping"}
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        name="delivery-method"
                        id={order.orderID}
                        onChange={updateShippingStatus}
                        value={order.orderID}
                        checked={order.shippingout}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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
                <button className="close_btn" onClick={closeDetail}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
