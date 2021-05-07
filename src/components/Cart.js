import React, { Component } from "react";
import { db } from "../config/Config";
import { FaPlus, FaMinus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getUserInfo, setCartItems } from "../localStorage";
import { Navbar } from "./Navbar";

export class Cart extends Component {
  state = { products: [], baskets: [] };

  componentDidMount() {
    const { _id } = getUserInfo();
    if (!_id) {
      window.location = "/login";
    } else {
      db.collection("basket")
        .where("userId", "==", _id)
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.empty) {
            return <div>No products in your cart</div>;
          } else {
            const data = querySnapshot.docs.map((doc) => doc.data());
            this.setState({ baskets: data });
            const preProducts = [...this.state.products];
            const baskets = this.state.baskets;
            baskets.forEach((basket) => {
              db.collection("product")
                .doc(basket.productId)
                .get()
                .then((change) => {
                  preProducts.push({
                    productId: basket.productId,
                    productName: change.data().productName,
                    productPrice: change.data().productPrice,
                    productImg: change.data().productImg,
                    description: change.data().description,
                    category: change.data().category,
                    productQty: basket.productQty,
                  });
                  this.setState({ products: preProducts });
                });
            });
          }
        });
    }
  }

  render() {
    const deleteBtn = (e) => {
      let productDeleteId = e.target.value;
      const basket = this.state.baskets.find(
        (x) => x.productId === productDeleteId
      );
      db.collection("basket").doc(basket.id).delete();
      const basketdata = this.state.products.filter(
        (x) => x.productId !== productDeleteId
      );
      this.setState({ products: basketdata });
    };
    const addProductQty = (id) => {
      const product = this.state.products.find((x) => x.productId === id);
      const basket = this.state.baskets.find((x) => x.productId === id);
      basket.productQty += 1;
      db.collection("basket")
        .doc(basket.id)
        .update({ productQty: basket.productQty });
      product.productQty += 1;
      const productLeft = this.state.products.filter((x) => x.productId !== id);
      this.setState({ products: [product, ...productLeft] });
    };
    const minusProductQty = (id) => {
      const product = this.state.products.find((x) => x.productId === id);
      const basket = this.state.baskets.find((x) => x.productId === id);
      basket.productQty -= 1;
      if (basket.productQty > 0) {
        db.collection("basket")
          .doc(basket.id)
          .update({ productQty: basket.productQty });
        product.productQty -= 1;
        const productLeft = this.state.products.filter(
          (x) => x.productId !== id
        );
        this.setState({ products: [product, ...productLeft] });
      } else {
        const basket = this.state.baskets.find((x) => x.productId === id);
        db.collection("basket").doc(basket.id).delete();
        const basketdata = this.state.products.filter(
          (x) => x.productId !== id
        );
        this.setState({ products: basketdata });
      }
    };
    const cartItems = this.state.products;
    setCartItems(cartItems);
    if (cartItems.length === 0) {
      return (
        <div>
          <div className="back-to-result">
            <Link to="/"> Back to Home </Link>
          </div>
          <h3>product is empty</h3>
        </div>
      );
    }
    return (
      <div>
        <Navbar />
        <div className="back-to-result">
          <Link to="/"> Back to Home </Link>
        </div>
        <div className="cart">
          <div className="cart-list">
            <ul className="cart-list-container">
              <li>
                <h3>Shopping Cart</h3>
                <div>Price</div>
              </li>
              {cartItems
                .sort((a, b) => (a.productId > b.productId ? 1 : -1))
                .map((item) => (
                  <li key={item.productId}>
                    <div className="cart-image">
                      <img src={item.productImg} alt={item.productName} />
                    </div>
                    <div className="cart-name">
                      <div>{item.productName}</div>
                      <div className="cart-detail">
                        Qty:
                        <FaMinus
                          onClick={() => minusProductQty(item.productId)}
                        />
                        {item.productQty}
                        <FaPlus onClick={() => addProductQty(item.productId)} />
                        <button
                          type="button"
                          className="delete-button"
                          value={item.productId}
                          onClick={deleteBtn}
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="cart-price">
                      ${item.productPrice * item.productQty}
                    </div>
                  </li>
                ))}
            </ul>
          </div>
          <div className="cart-action">
            <h3>
              Subtotal items: {cartItems.reduce((a, c) => a + c.productQty, 0)}
              
            </h3>
            <h3>
            Total Price: $
            {cartItems.reduce((a, c) => a + c.productPrice * c.productQty, 0)}
            </h3>
            <Link to="/payment">
              <button className="primary fw" id="checkout-button">
                Processed to checkout
              </button>
            </Link>
            <Link to="/">
              <button
                className="fw primary"
                style={{ backgroundColor: "green", color: "white" }}
              >
                Continue to shopping
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default Cart;
