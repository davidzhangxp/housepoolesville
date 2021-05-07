/* eslint-disable react-hooks/rules-of-hooks */
import { Component } from "react";
import { Link } from "react-router-dom";
import {  db } from "../config/Config";
import { v4 as uuidv4 } from 'uuid';
import { ShowAlert } from "./ShowAlert";
import { getUserInfo } from "../localStorage";
import {Navbar} from './Navbar'


export class ProductDetail extends Component {

  constructor(props) {
    super(props);
    this.state = { data: null,msg:null}
  }

  componentDidMount() {
    const id = this.props.match.params.productId;
    const docRef = db.collection("product").doc(id);
    docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          let docdata = doc.data();
          this.setState({ data: docdata });
        } else {
          this.setState({ data: null });
          console.log("No such document!");
        }
      })
      .catch((error) => {
        this.setState({ data: null });
        console.log("Error getting document:", error);
      });

  }

  
  render() {
    const addToCart = ()=>{
      const {_id} = getUserInfo()
      if(!_id){
        this.props.history.push("/login");
        // window.location = '/login';
      }else{
      db.collection("basket").where("userId","==",_id ).where("productId","==",this.state.data.productId)
      .get()
      .then(snapshot =>{
        if (!snapshot.empty){
          const data = snapshot.docs.map(doc => doc.data());
          const docId = data[0].id
          const qty = data[0].productQty + 1
          db.collection('basket').doc(docId).update({productQty:qty})
          this.setState({msg:"product exist in your cart,add a new one to your cart"}) 
        }else{
          const basketId = uuidv4()
          db.collection('basket').doc(basketId).set({
            id:basketId,
            userId:_id,
            productId:this.state.data.productId,
            productQty:1
        })
        this.setState({msg:"add to your cart"})  
        }
      })
    }  
    }
    const msg = this.state.msg
    const dismissAlert = () => {
      this.setState({msg:null});
    };
    const product = this.state.data
    if(product == null){
      return (<div>product is empty</div>)
  } 

    return (
      <div className="content">
      <Navbar />
            <div className="back-to-result">
                <Link to="/"> Back</Link>
            </div>
            <div className="details">
                <div className="details-image">
                    <img src={product.productImg} alt={product.productName}/>
                </div>
                <div className="details-info">
                    <ul>
                        <li><h2>Name:{product.productName}</h2></li>

                        <li>
                            Price: <strong>${product.productPrice}</strong>
                        </li>
                        <li>
                            Description:
                            <div>
                            {product.description}
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="details-action">
                    <ul>
                        <li>Name:{product.productName}</li>
                        <li>Price:{product.productPrice}</li>
                        <li>
                        <button id="add-button" className="fw primary" onClick={addToCart}>Add to cart</button>
                        </li>
                        <li>
                        <Link to="/"><button className="fw primary" style={{backgroundColor:"green",color:"white"}}>Continue to shopping</button></Link>
                        </li>
                    </ul>
                </div>
            </div>
            {msg && <ShowAlert message={msg} action={dismissAlert} />}
        </div>
    );
  }
}

export default ProductDetail;