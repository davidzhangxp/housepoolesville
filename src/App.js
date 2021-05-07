
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Home } from "./components/Home";
import { AddProducts } from "./components/AddProducts";
import { Login } from "./components/Login";
import { Signup } from "./components/Signup";
import { ForgotPassword } from "./components/ForgotPassword";
import ProductsContextProvider from "./global/ProductsContext";
import { CartContextProvider } from "./global/CartContext";
import {auth,db} from "./config/Config"
import React, { Component } from "react";
import { Cart } from "./components/Cart";
import { ProductDetail } from "./components/ProductDetail";
import { Profile } from "./components/Profile";
import { Shipping } from "./components/Shipping";
import Payment from "./components/Payment";
import Order from "./components/Order";
import Dashboard from "./components/Dashboard";


export class App extends Component {
  state = {
    user: null
  }
  componentDidMount() {
    auth.onAuthStateChanged(user =>{
      if (user){
        db.collection('users').doc(user.uid).get()
        .then((snapshot)=>{
          this.setState({user:snapshot.data()})
        })
      }else{this.setState({user:null})}
    })
  }
  render() {
    return (
      <ProductsContextProvider>
        <CartContextProvider>
          <BrowserRouter>
            <Switch>
              <Route exact path="/" component={()=><Home/>} />
              <Route path="/addproducts" component={AddProducts} />
              <Route path="/login" component={Login} />
              <Route path="/signup" component={Signup} />
              <Route path="/forgot_password" component={ForgotPassword} />
              <Route path="/cart" component={Cart}/>
              <Route path="/profile" component={Profile}/>
              <Route path="/products/:productId" component={ProductDetail}/>
              <Route path="/shipping" component={Shipping}/>
              <Route path="/payment" component={Payment}/>
              <Route path="/order" component={Order}/>
              <Route path="/dashboard" component={Dashboard}/>
            </Switch>
          </BrowserRouter>
        </CartContextProvider>
      </ProductsContextProvider>
    );
  }
}

export default App;
