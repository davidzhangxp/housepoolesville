
const express = require('express');
const cors = require('cors')
const stripe = require('stripe')("sk_test_51GqnIjIyLvtqdiJDrVDrowROBqPbSo1h9QtN0CBBpU3vpbLdFIStjo1hC3nXPG8EDXZdRgjJhvVZfktHJE6vCF1Q00KwKeSr39");
const bodyParser = require('body-parser');
const path = require('path')
const app = express();


app.use(cors())
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname,'build')))
app.get('/*', function(req, res){
    res.sendFile(path.join(__dirname,'build','index.html'))
})
app.post("/payment", cors(), async(req,res)=>{
    let {amount,id} = req.body
    try {
        const payment = await stripe.paymentIntents.create({
            amount:amount,
            currency:"USD",
            description:"DAVID STORE",
            payment_method:id,
            confirm:true,
        })
        console.log("pament",payment)
        res.json({
            message:"payment successful",
            success:true
        })
    } catch (error) {
        console.log(error);
        res.json({
            message:"error",
            succuss:false
        })
    }
})
app.get("/api/products",(req,res)=>{
    res.send()
})



app.listen(8083,()=>{
    console.log("sever at http://192.168.1.172:8083")
})