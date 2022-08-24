import React from "react";
import logo from "./FormLogo.png"

function App() {

  function loadRazorPay(src) {

    return new Promise((resolve) => {

      // here first i want the below script to be available when i click on pay button
      const script = document.createElement("script");
      script.src = src;
      document.body.appendChild(script);

      // here as loading the script will take some time so making the payment opeation as asyn and will execute only if script has been loaded succesfully
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
    });
  }

  async function displayRazorPay() {

    const res = await loadRazorPay(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("RazorPay SDK Failed To Load");
      return;
    }
    
    // api call to create an order
    const data = await fetch('http://localhost:5000/razorpay',{ method:'POST' }).then(t=>t.json())

    console.log(data) // now this data will go and open the actual dialog box to settle the amount

    var options = {
      key: "rzp_test_cD7GG3Q4Fp42fl",
      amount: data.amount.toString(), // Here money is always send in format of lowest currency that is send 1rs as 100paise 
      currency: data.currency,  
      name: "King's Restaurant And Bar",
      description: "Thank you for reservation",
      image: {logo},
      order_id: data.id, // this id comes from backend after creating a order
      handler: function (response) {
        alert(response.razorpay_payment_id);
        alert(response.razorpay_order_id);
        alert(response.razorpay_signature);
      },

      // Here this prefill is for logged in user to prefill these details in razorpay dialog box which comes from 
      prefill: {
        name: "Aman Bisht",
        email: "amanbisht123abc@gmail.com",
        contact: "9315933365",
      }
      
    };

    var paymentObj = new window.Razorpay(options);
    paymentObj.open();

  }

  // Here making track of when to use which api key
  if(document.domain = "localhost"){
    // use development key
  }
  else{
    // use production or live key 
  }

  return (
    <>
      <h1>WELCOME TO RAZOR PAY</h1>
      <a href="#" onClick={displayRazorPay}>
        Please Donate 5rs
      </a>
    </>
  );
}

export default App;

// Here this Key_Id always put in env variable to protect it 

// here in option object many properties like , Amount,Currency,Order id etc comes from backend 

// Here there are 2 way to validate payment one is using information present inside handler method of object options passed to new RazorPay() constructor and other is let razorpay to tell you that payment has been made which is best.

// a web-hook is a callback created inside razorpay system so whenever a payment is made to us then razaorpay is responsible for calling a certain api to our server 

// so in create webhook we are listening to event called payment.captured which is a event which get triggered when amount actually deducted from user bank account 