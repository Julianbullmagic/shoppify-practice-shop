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
    checkoutnum:0
  }
}


  render () {

console.log("num cart items",this.props.numcartitems)
    return (
      <div className="nav">
      <h1 className="navh1"><a href={"/"}>All Shoes</a></h1>
      <img style={{width:"8vw",marginLeft:"1vw"}} src={require("./shoelogo.png")}/>
      <img style={{width:"5vw",marginLeft:"40vw"}} src={require("./carticon.png")}/>
      <h2 className="navh2"><a href={"/cart"}>Cart</a></h2>
      {(this.props.numcartitems>0)&&<h3 style={{color:"red",marginLeft:"1vw"}}>{this.props.numcartitems} items in cart</h3>}

      </div>
    )
  }
}
