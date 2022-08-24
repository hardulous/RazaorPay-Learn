const app = require("express")();
const Razorpay = require("razorpay");
const shordId = require("shortid");
const cors = require('cors');

app.use([cors()])
// Here instantiate the razorpay instance
var razorObj = new Razorpay({
  key_id: "rzp_test_cD7GG3Q4Fp42fl",
  key_secret: "IXQLR7UyRIzjOLsPTY4hixvT",
});

// handling payment request to razorpay and will send the order id
app.post("/razorpay", async (req, res) => {

  try {

    // here all the info passed to .create method will come from frontend and get stored in database
    const payment_capture = 1;
    const amount = 5;

    console.log("I have came here")

    const options = {
      amount: (amount * 100).toString(),
      currency: "INR",
      receipt: shordId.generate(),
      payment_capture,
    };

    const response = await razorObj.orders.create(options);
    console.log(response);
    return res.status(200).json({
        id:response.id,
        currency:response.currency,
        amount:response.amount
    });

  } 
  catch (error) {
    return res.status(400).json("Error");
  }

});

app.listen(5000,()=>{
  console.log("Server is running");
})

// To use Razorpay API have to install package npm i razorpay

// in receipt we pass some randome string and these receipt is return back to us by razorpay when we are listning for response for a particular order
