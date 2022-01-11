import React from 'react'
import Client from 'shopify-buy';
import {Link} from 'react-router-dom'

const client = Client.buildClient({
  domain: 'shoeshoeshoe3218.myshopify.com',
  storefrontAccessToken: '1c85f492e0af12f1faf7a619b1baa3a4'
});




export default class NavBar extends React.Component {


  constructor(props) {
  super(props);
  this.state={
    items:[],
    checkout:{},
    checkoutnum:0
  }
  this.getCheckout=this.getCheckout.bind(this)
  window.addEventListener("storage", function () {
  console.log("ssss")
  }, false);
}


componentDidMount(){
this.getCheckout()
}

async getCheckout(){
  let checkout=sessionStorage.getItem('checkout')
console.log("checkoutid in navebar",checkout)
  if(checkout){
    client.checkout.fetch(checkout).then((checkout) => {
    console.log("checkout on navbar",checkout.lineItems);
    this.setState({checkout:checkout})
  });
}
}
  render () {
    let length=0
    if(this.state.checkout.lineItems){
    length=this.state.checkout.lineItems.length
    }

    return (
      <div className="nav">
      <h1 className="navh1"><a href={"/"}>All Shoes</a></h1>
      <h2 className="navh2"><a href={"/cart"}>Cart</a></h2>
      {this.state.checkout&&<h3 style={{color:"red",marginLeft:"1vw"}}>{length} items in cart</h3>}

      </div>
    )
  }
}
