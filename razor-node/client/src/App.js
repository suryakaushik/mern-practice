import React, { useState } from 'react'
import logo from './logo.svg'
import './App.css'

function loadScript(src) {
	return new Promise((resolve) => {
		const script = document.createElement('script')
		script.src = src
		script.onload = () => {
			resolve(true)
		}
		script.onerror = () => {
			resolve(false)
		}
		document.body.appendChild(script)
	})
}

const __DEV__ = document.domain === 'localhost'

function App() {
	const [name, setName] = useState('Mehul')

	async function displayRazorpay() {
		const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')

		if (!res) {
			alert('Razorpay SDK failed to load. Are you online?')
			return
		}

		const data = await fetch('http://localhost:1337/razorpay', { method: 'POST' }).then((t) =>
			t.json()
		);

		console.log(data)

		const options = {
			key: __DEV__ ? 'rzp_test_uGoq5ABJztRAhk' : 'PRODUCTION_KEY',
			currency: data.currency,
			amount: data.amount.toString(),
			order_id: data.id,
			name: 'Donation',
			description: 'Thank you for nothing. Please give us some money',
			image: 'http://localhost:1337/logo.svg',
			handler: function (response) {
				alert(response.razorpay_payment_id)
				alert(response.razorpay_order_id)
				alert(response.razorpay_signature)
			},
			prefill: {
				name,
				email: 'sdfdsjfh2@ndsfdf.com',
				phone_number: '9899999999'
			}
		}
		const paymentObject = new window.Razorpay(options)
		paymentObject.open()
	}

	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<p>
					Edit <code>src/App.js</code> and save to reload.
				</p>
				<a
					className="App-link"
					onClick={displayRazorpay}
					target="_blank"
					rel="noopener noreferrer"
				>
					Donate $5
				</a>
			</header>
		</div>
	)
}

export default App;




// NOTE: We can also ADD THE BELOW SRIPT TAG TO index.html
{/* <script src="https://checkout.razorpay.com/v1/checkout.js"></script> */}

// import React, { Component } from 'react'
// import Axios from 'axios'
// export class App extends Component {
//   constructor(props) {
//     super(props)
  
//     this.state = {
       
//     }
//    // this.razorPayHandler = this.razorPayHandler(this);

//   }

//   async razorPayPaymentHandler() {
//     const API_URL = `http://localhost:5000/razorpay/`
//     const orderUrl = `${API_URL}order`;
//     const response = await Axios.get(orderUrl);
//     const { data } = response;
//     console.log("App -> razorPayPaymentHandler -> data", data)
    
//     const options = {
//       key: '',
//       name: "avdojo",
//       description: "avodojo",
//       order_id: data.id,
//       handler: async (response) => {
//         try {
//          const paymentId = response.razorpay_payment_id;
//          const url = `${API_URL}capture/${paymentId}`;
//          const captureResponse = await Axios.post(url, {})
//          const successObj = JSON.parse(captureResponse.data)
//          const captured = successObj.captured;
//          console.log("App -> razorPayPaymentHandler -> captured", successObj)
//          if(captured){
//              console.log('success')
//          }
         
//         } catch (err) {
//           console.log(err);
//         }
//       },
//       theme: {
//         color: "#686CFD",
//       },
//     };
//     const rzp1 = new window.Razorpay(options);
//     rzp1.open();
//   }
  
//   render() {
//     return (
//       <div>
//         <button 
//         onClick={this.razorPayPaymentHandler}
//         className="btn btn-primary">
//           Pay Now
//         </button>
//       </div>
//     )
//   }
// }

// export default App;
