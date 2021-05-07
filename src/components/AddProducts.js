import React, { useState } from "react";
import { storage, db } from "../config/Config";
import "../css/Product.css";
import { v4 as uuidv4 } from "uuid";
import { Navbar } from "./Navbar";

export const AddProducts = () => {
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState(0);
  const [productImg, setProductImg] = useState(null);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const types = ["image/png", "image/jpeg"];
  const productImgHandler = (e) => {
    let selectedFile = e.target.files[0];
    if (selectedFile && types.includes(selectedFile.type)) {
      setProductImg(selectedFile);
      setError("");
    } else {
      setProductImg(null);
      setError("Please select a valid image type");
    }
  };

  const addProduct = (e) => {
    e.preventDefault();
    console.log(productImg, productName, productPrice);
    // const uploadTask = storage.ref(`product-images/${productImg.name}`).put(productImg)
    const uploadTask = storage
      .ref("product-images")
      .child(productImg.name)
      .put(productImg);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(progress);
      },
      (error) => {
        setError(error.message);
      },
      () => {
        storage
          .ref("product-images")
          .child(productImg.name)
          .getDownloadURL()
          .then((url) => {
            var productId = uuidv4();
            db.collection("product")
              .doc(productId)
              .set({
                productId: productId,
                productName: productName,
                productPrice: Number(productPrice),
                category: category,
                description: description,
                productImg: url,
              })
              .then(() => {
                setError("");
                setProductImg("");
                setProductName("");
                setProductPrice(0);
                setCategory("");
                setDescription("");
                document.getElementById("file").value = "";
              })
              .catch((err) => {
                setError(err.message);
              });
          });
      }
    );
  };
  return (
    <div>
      <Navbar />
      <div className="form-container">
        <h1>AddProduct</h1>
        <form className="product-form" onSubmit={addProduct}>
          <ul className="form-items">
            <li>
              <label htmlFor="name">Name:</label>
              <input
                name="name"
                type="text"
                required
                onChange={(e) => setProductName(e.target.value)}
                value={productName}
              />
            </li>
            <li>
              <label htmlFor="category">Category:</label>
              <input
                name="category"
                type="text"
                required
                onChange={(e) => setCategory(e.target.value)}
                value={category}
              />
            </li>
            <li>
              <label htmlFor="product_price">Price:</label>
              <input
                type="number"
                required
                onChange={(e) => setProductPrice(e.target.value)}
                value={productPrice}
              />
            </li>
            <li>
              <label htmlFor="description">Description:</label>
              <input
                name="description"
                type="text"
                required
                onChange={(e) => setDescription(e.target.value)}
                value={description}
              />
            </li>
            <li>
              <label htmlFor="product_image">Image:</label>
              <input
                type="file"
                required
                onChange={productImgHandler}
                id="file"
              />
            </li>
            <li>
              <button type="submit" className="primary">
                submit
              </button>
            </li>
          </ul>
          {error && <span>{error}</span>}
        </form>
      </div>
    </div>
  );
};
