/* eslint-disable default-case */


export const CartReducer = (state,action) => {
    const {shoppingCart,totalPrice,totalQty} = state

    let product;
    // let index;
    let updatePrice;
    let updateQty;
    switch (action.type) {

        case "ADD_TO_CART":

            const check = shoppingCart.find(product => product.ProductId === action.id);
            
            if(check){
                console.log("product is already in your cart",state)

                return state;
            }else{
                product = action.product;
                product['qty']=1
                product['TotalProductPrice'] = product.ProductPrice * product.qty
                updateQty = totalQty + 1
                updatePrice = totalPrice + product.ProductPrice
                console.log("add new product in your cart")
                return {
                    shoppingCart:[product,...shoppingCart],
                    totalPrice:updatePrice,
                    totalQty:updateQty
                }
            }
            
    }

}
