import React from 'react'
import Client from 'shopify-buy';
import {Route,Routes,Link} from 'react-router-dom'
import Cart from './cart'

const client = Client.buildClient({
  domain: 'shoeshoeshoe3218.myshopify.com',
  storefrontAccessToken: '1c85f492e0af12f1faf7a619b1baa3a4'
});




export default class App extends React.Component {


  constructor(props) {
  super(props);
  this.state={
    items:[],
    allitems:[],
    collections:[],
    checkout:{},
    searchTerm:''
  }
  this.getItems=this.getItems.bind(this);
  this.addToCart=this.addToCart.bind(this);
  this.getCheckout=this.getCheckout.bind(this)
  this.getCollectionProducts=this.getCollectionProducts.bind(this)
  this.updateSearch=this.updateSearch.bind(this)
  this.updateProducts=this.searchProducts.bind(this)
}


componentDidMount(){
this.getItems()
this.getCheckout()
}

async getCheckout(){
  let checkout=sessionStorage.getItem('checkout')
console.log("check on page refresh",checkout)
  if(checkout){
    client.checkout.fetch(checkout).then((checkout) => {
    console.log("checkout on page refresh",checkout);
    this.setState({checkout:checkout})
  });
}
}

async getItems(){
    await client.product.fetchAll().then((products) => {
      let pro=products
      console.log(pro);
      this.setState({items:pro,allitems:pro})
    });

    client.collection.fetchAllWithProducts().then((collections) => {
      console.log("collections",collections);
      console.log(collections[0].products);
      this.setState({collections:collections})
    });
}

async addToCart(id){
  let checkout=sessionStorage.getItem('checkout')
console.log("check",checkout)
  if(!checkout){
    await client.checkout.create().then((checkout) => {
    // Do something with the checkout
    console.log(checkout);
    sessionStorage.setItem('checkout',checkout.id)
    this.setState({checkout:checkout})
  });
}
  console.log(id,this.state.checkout.id)
  console.log("chekcout",checkout)

const lineItemsToAdd = [
  {
    variantId: id,
    quantity: 1,
  }
];
await client.checkout.addLineItems(checkout, lineItemsToAdd).then((checkout) => {
  console.log(checkout.lineItems);
  this.setState({checkout:checkout})
});
}

async getCollectionProducts(collectionId){
  console.log(collectionId)
  client.collection.fetchWithProducts(collectionId, {productsFirst: 10}).then((collection) => {
  console.log(collection);
  console.log(collection.products);
  this.setState({items:collection.products})
})
}

getAllProducts(collectionId){
  this.setState({items:this.state.allitems})
}

updateSearch(e){
  console.log(e.target.value)
  this.setState({searchTerm:e.target.value})
}

searchProducts(e){
  let term=this.state.searchTerm.toLowerCase()
  console.log(term)
  let searched=this.state.items.filter(item=>item.title.toLowerCase().includes(term))
  console.log(searched)
  this.setState({items:searched})
}
  render () {
    return (
      <div style={{width:"90vw",margin:"5vw",zIndex:"100"}}>

        <h2 style={{color:"#525cb4"}}>All Categories </h2><button onClick={() => this.getAllProducts()}>All Products</button>
        {this.state.collections&&this.state.collections.map(item=>{return(
           <button style={{margin:"1vw"}} onClick={() => this.getCollectionProducts(item.id)}>{item.title}</button>
        )})}
        <div style={{marginTop:"2vw"}}>
        <input style={{marginRight:"2vw"}} onChange={(e) => this.updateSearch(e)} type="text" />
        <button onClick={(e) => this.searchProducts(e)}>Search Products</button>
        </div>
      <div  style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",maxHeight:"80%",width:"90vw",overflow:"scroll"}}>
      {this.state.items&&this.state.items.map(item=>{return (
         <div style={{width:"26vw",height:"30vh",overflow:"hidden",margin:"1vw",position:"relative"}}>
         <div style={{opacity:"0.9",width:"100%",backgroundColor:"white",position:"absolute"}}>
          <h2 style={{margin:"1vw",color:"#525cb4"}}>{item.title}</h2>
          <h2 style={{margin:"1vw",color:"#525cb4"}}>{item.price}</h2>
          </div>
          <button style={{display:"block",position:"absolute",top:"65%",width:"90%",marginLeft:"1vw"}}><Link to={"/singleproductpage/"+item.id}>View Product Details</Link></button>
          <button style={{display:"block",position:"absolute",top:"80%",width:"90%",marginLeft:"1vw"}} onClick={() => this.addToCart(item.variants[0].id)}>Add to cart</button>
          {!item.availableForSale&&<h3>This item is out of stock</h3>}
          <img style={{width:"100%",height:"100%",objectFit:"cover"}} src={item.images[0].src}/>
          </div>
      )})}
      </div>
      </div>
    )
  }
}
