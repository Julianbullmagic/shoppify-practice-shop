import React from 'react'
import Client from 'shopify-buy';
import {Link} from 'react-router-dom'

const client = Client.buildClient({
  domain: 'shoeshoeshoe3218.myshopify.com',
  storefrontAccessToken: '1c85f492e0af12f1faf7a619b1baa3a4'
});

export default class Cart extends React.Component {

  constructor(props) {
  super(props);
  this.state={
    checkout:{},
      address1: '',
      address2: '',
      city: '',
      company: '',
      country: '',
      firstName: '',
      lastName: '',
      phone: '',
      province: '',
      zip: ''
  }
  this.removeFromCart=this.removeFromCart.bind(this)
  this.updateCart=this.updateCart.bind(this)
  this.handleChange=this.handleChange.bind(this)
  this.handleSubmit=this.handleSubmit.bind(this)
  this.addAddress=this.addAddress.bind(this)
}


componentDidMount(){
  this.getCheckout()
}

async getCheckout(){
  let checkout=sessionStorage.getItem('checkout')
console.log("check on page refresh",checkout)
  if(checkout){
    client.checkout.fetch(checkout).then((checkout) => {
    console.log("checkout on page refresh",checkout);
    this.setState({checkout:checkout})

    if(checkout.shippingAddress){
      this.setState({
        address1: checkout.shippingAddress.address1,
        address2: checkout.shippingAddress.address2,
        city: checkout.shippingAddress.city,
        company: checkout.shippingAddress.company,
        country: checkout.shippingAddress.country,
        firstName: checkout.shippingAddress.firstName,
        lastName: checkout.shippingAddress.lastName,
        phone: checkout.shippingAddress.phone,
        province: checkout.shippingAddress.phone,
        zip: checkout.shippingAddress.zip
      })
    }
  });
}
}

async removeFromCart(itemId){
  console.log(itemId,this.state.checkout.id)
  const lineItemIdsToRemove = [itemId];

// Remove an item from the checkout
client.checkout.removeLineItems(this.state.checkout.id, lineItemIdsToRemove).then((checkout) => {
  console.log("line items after removing one",checkout.lineItems);
  this.setState({checkout:checkout})
});
}

async updateCart(itemId,quantity,plusorminus){
  let lineItemsToUpdate

if(quantity-1==0){
  this.removeFromCart(itemId)
}else{
  if(plusorminus){
    lineItemsToUpdate = [
      {id: itemId, quantity: quantity+1}
    ];
  }else{
    lineItemsToUpdate = [
      {id: itemId, quantity: quantity-1}
    ];
  }

  client.checkout.updateLineItems(this.state.checkout.id, lineItemsToUpdate).then((checkout) => {
    console.log(checkout.lineItems);
    this.setState({checkout:checkout})
  });
}
}


async addAddress(){

let address={
      address1:this.state.address1,
      address2:this.state.address2,
      city:this.state.city,
      company:this.state.company,
      country:this.state.country,
      firstName:this.state.firstName,
      lastName:this.state.lastName,
      phone:this.state.phone,
      province:this.state.province,
      zip:this.state.zip
    }
    console.log("address before update",this.state.checkout.id,address)

client.checkout.updateShippingAddress(this.state.checkout.id,address).then(checkout => {
  console.log("shipping address",checkout)
this.setState({checkout:checkout})
});
}

handleChange(event) {
console.log(event.target.value)
this.setState({[event.target.name]: event.target.value})

}

handleSubmit(event) {
console.log(this.state)
this.addAddress()
  event.preventDefault();
}


  render () {
    return (
      <div>
      <br/>
        <br/>
        <h1 className="cartheader">Cart</h1>

        {this.state.checkout.lineItems&&this.state.checkout.lineItems.map(item=>{return (
            <div>
            <h2>{item.title}</h2>
            <h3>Quantity: {item.quantity}</h3>
            <button onClick={(e) => this.removeFromCart(item.id)}>Remove</button>
            <h4>Update Quantity</h4>
            <button onClick={() => this.updateCart(item.id,item.quantity,true)}>+</button>
            <button onClick={() => this.updateCart(item.id,item.quantity,false)}>-</button>

            </div>
    )})}
    <form className="cart" onSubmit={this.handleSubmit}>
  <label>
    <input type="text" value={this.state.address1} placeholder={this.state.address1} name="address1"  onChange={(value) => this.handleChange(value)} />
    Address1
  </label>
  <label>
    <input type="text" value={this.state.address2} placeholder={this.state.address2} name="address2"  onChange={(value) => this.handleChange(value)} />
    Address2
  </label>
  <label>
    <input type="text" value={this.state.city} placeholder={this.state.city} name="city"  onChange={(value) => this.handleChange(value)}  />
City
  </label>
  <label>
    <input type="text" value={this.state.company} placeholder={this.state.company} name="company"  onChange={(value) => this.handleChange(value)}  />
    Company
  </label>
  <label>
    <input type="text" value={this.state.country} placeholder={this.state.country} name="country"  onChange={(value) => this.handleChange(value)}  />
    Country
  </label>
  <label>
    <input type="text" value={this.state.firstName} placeholder={this.state.firstName} name="firstName"  onChange={(value) => this.handleChange(value)}  />
    First Name
  </label>
  <label>
    <input type="text" value={this.state.lastName} placeholder={this.state.lastName} name="lastName"  onChange={(value) => this.handleChange(value)}  />
    Last Name
  </label>
  <label>
    <input type="text" value={this.state.phone} placeholder={this.state.phone} name="phone"  onChange={(value) => this.handleChange(value)}  />
    Phone
  </label>
  <label>
    <input type="text" value={this.state.province} placeholder={this.state.province} name="province"  onChange={(value) => this.handleChange(value)}  />
    Province
  </label>
  <label>
    <input type="text" value={this.state.zip} placeholder={this.state.zip} name="zip"  onChange={(value) => this.handleChange(value)}  />
    Zip
  </label>

  <input type="submit" value="Submit" />
  {this.state.checkout.webUrl&&<button><a style={{textDecoration:"none",color:"black"}} href={this.state.checkout.webUrl}>Complete order, provide payment details</a></button>}
</form>
      </div>
    )
  }
}
