import React, { Component, createContext } from 'react'
import { db } from '../config/Config'

export const ProductsContext = createContext()

export class ProductsContextProvider extends Component {

    constructor(props) {
        super(props);
        this.state = {
            products:[]
        }
        
      }
    componentDidMount(){
        
        const prevProducts = this.state.products
        db.collection('product').onSnapshot(snapshot =>{
            let changes = snapshot.docChanges()
            changes.forEach(change =>{
                if(change.type === 'added'){
                    prevProducts.push({
                        productId:change.doc.id,
                        productName:change.doc.data().productName,
                        productPrice:change.doc.data().productPrice,
                        productImg:change.doc.data().productImg,
                        description:change.doc.data().description,
                        category:change.doc.data().category
                    })
                }
                this.setState({
                    products:prevProducts
                })
                
            })  
        })

    }

    render() {
        return (
            <ProductsContext.Provider value={{products:[...this.state.products]}}>
            {this.props.children}
            </ProductsContext.Provider>
        )
    }
}

export default ProductsContextProvider
