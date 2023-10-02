var express = require('express');
var router = express.Router();

const shortid = require('shortid');
const Razorpay = require('razorpay');
const request = require('request');

const keys = require('../keys')

const razorInstance = new Razorpay({
  key_id : keys.razorIdkey,
  key_secret : keys.razorIdSecret
})
router.get("/order",(req,res)=>{
  try{
    const options ={
      amount : 10*100,
      currency : "INR",
      // receipt: "receipt#1",
      receipt: shortid.generate(),
      payment_capture: 1,

    };
    razorInstance.orders.create(options,async function(err,order){
      if(err){
        console.log("Error creating order", err);
        return res.status(500).json({
          message: "Something error!s"
        })
      }
      return res.status(200).json(order);
    });
  }
  catch(err){
    return res.status(500).json({
      message: "Something error!s"
    });
  }
});

router.post("/capture/:paymentId",(req,res)=>{
  try{
    return request(
      {
        method : "POST",
        url : `https://${keys.razorIdkey}:${keys.razorIdSecret}@api.razorpay.com/v1/payments/${req.params.paymentId}/capture`,
        form:{
          amount : 10 *100,
          currency: "INR"
        },
      },
      async function(err,response,body){
        if(err){
          return res.status(500).json({
            message: "Something error!s"
          })
        }
        return res.status(200).json(body)
      }
    );
  }
  catch(err){
    return res.status(500).json({
      message: err.message
    });
  }

  const secret = '12345678'

	console.log(req.body)

	const crypto = require('crypto')

	const shasum = crypto.createHmac('sha256', secret)
	shasum.update(JSON.stringify(req.body))
	const digest = shasum.digest('hex')

	console.log(digest, req.headers['x-razorpay-signature'])

	if (digest === req.headers['x-razorpay-signature']) {
		console.log('request is legit')
		// process it
		require('fs').writeFileSync('payment1.json', JSON.stringify(req.body, null, 4))
	} else {
		// pass it
	}
	res.json({ status: 'ok' })
})

module.exports = router;
