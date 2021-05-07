import React, { useContext} from "react";
import { Link } from "react-router-dom";
// import { CartContext } from "../global/CartContext";
import { ProductsContext } from "../global/ProductsContext";
import { v4 as uuidv4 } from "uuid";
import { db } from "../config/Config";
import { useAlert } from "react-alert";
import { getUserInfo} from "../localStorage";
import dining from "../images/dining.jpg";

export const Products = () => {
  const alert = useAlert();
  const { products} = useContext(ProductsContext);
  const { _id } = getUserInfo();
var allCategories = []

 var productDic = []
 products.forEach((product) =>{
   allCategories.push(product.category)
 })
const categories = allCategories.filter((val, id, array) => {
  return array.indexOf(val) === id;
})
categories.forEach((key) => {
  const preproducts = products.filter((x) => x.category === key);
  productDic[key] = preproducts
});

 
  // const { dispatch } = useContext(CartContext);
  const addToCart = (e) => {
    let productId = e.target.value;
    if (!_id) {
      window.location = "/login";
    } else {
      db.collection("basket")
        .where("userId", "==", _id)
        .where("productId", "==", productId)
        .get()
        .then((snapshot) => {
          if (!snapshot.empty) {
            const data = snapshot.docs.map((doc) => doc.data());
            const docId = data[0].id;
            const qty = data[0].productQty + 1;
            db.collection("basket").doc(docId).update({ productQty: qty });
            alert.success("product add to your cart");
          } else {
            const basketId = uuidv4();
            db.collection("basket").doc(basketId).set({
              id: basketId,
              userId: _id,
              productId: productId,
              productQty: 1,
            });
            alert.success("product add to your cart");
          }
        });
    }

  };
  return (
    <div>
      <div className="product-container">
        <div className="head-container">
          <div>
            <img src={dining} alt="" />
          </div>
        </div>
        {categories &&
          categories.sort().map((category) => (
            <div key={category}>
              <h2>{category}</h2>
              <ul className="products">
                {productDic[category] &&
                  productDic[category]
                    .sort((a, b) => (a.productId > b.productId ? 1 : -1))
                    .map((product) => (
                      <li key={product.productId}>
                        <div className="product">
                          <Link
                            to={{ pathname: `/products/${product.productId}` }}
                          >
                            <img
                              src={product.productImg}
                              alt={product.ProductName}
                            />
                          </Link>

                          <div className="product-info">
                            <div className="product-name">
                              {product.productName}
                            </div>
                            <div className="product-price">
                              ${product.productPrice}
                            </div>
                          </div>

                          <div>
                            <button
                              className="fw"
                              value={product.productId}
                              onClick={addToCart}
                            >
                              Add To Cart
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
              </ul>
              <hr></hr>
            </div>
          ))}
      </div>
    </div>
  );
};
