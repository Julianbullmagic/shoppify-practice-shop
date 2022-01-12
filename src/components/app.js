import React from 'react'
import Client from 'shopify-buy';
import {Route,Routes,Link} from 'react-router-dom'
import Cart from './cart'
import NavBar from './navbar'

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
    ascending:false,
    descending:false,
    searching:false,
    range:false,
    searchTerm:'',
    numcartitems:0,
    bottomRange:0,
    topRange:1000000000000,
    chosencollection:''
  }
  this.getItems=this.getItems.bind(this);
  this.addToCart=this.addToCart.bind(this);
  this.getCheckout=this.getCheckout.bind(this)
  this.getCollectionProducts=this.getCollectionProducts.bind(this)
  this.updateSearch=this.updateSearch.bind(this)
  this.updateProducts=this.searchProducts.bind(this)
  this.updateBottomRange=this.updateBottomRange.bind(this)
  this.updateTopRange=this.updateTopRange.bind(this)
  this.filterPriceRange=this.filterPriceRange.bind(this)
  this.orderhl=this.orderhl.bind(this)
  this.orderlh=this.orderlh.bind(this)
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
    this.setState({checkout:checkout,numcartitems:checkout.lineItems.length})
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
  this.setState({checkout:checkout,numcartitems:checkout.lineItems.length})
});
}

async getCollectionProducts(collectionId,title){
  console.log(collectionId,title)
  client.collection.fetchWithProducts(collectionId, {productsFirst: 10}).then((collection) => {
  console.log("setting collection",collection.products);
  console.log(this.state.collections)

  this.setState({items:collection.products,chosencollection:title})
})
}

getAllProducts(collectionId){
  this.setState({items:this.state.allitems,
      ascending:false,
      descending:false,
      searching:false,
      range:false,
      chosencollection:''
    })
}

updateSearch(e){
  console.log(e.target.value)
  this.setState({searchTerm:e.target.value})
}

updateBottomRange(e){
  console.log("range",this.state.bottomRange,this.state.topRange)
  this.setState({bottomRange:e.target.value})
}
updateTopRange(e){
  console.log("range",this.state.bottomRange,this.state.topRange)
  this.setState({topRange:e.target.value})
}

filterPriceRange(){
  console.log("range",this.state.bottomRange,this.state.topRange)
let a=this.state.topRange
let b=this.state.bottomRange
console.log("items",this.state.items)
  let searched=this.state.items.filter(item=>Number(item.variants[0].price)<=a)
  searched=searched.filter(item=>Number(item.variants[0].price)>=b)

  console.log("within range",searched)
  this.setState({items:searched,range:true})
}

orderhl(){
let sorted=this.state.items.sort(function(a, b){return Number(a.variants[0].price) - Number(b.variants[0].price)});
this.setState({items:sorted,descending:true,ascending:false})
}

orderlh(){
  let sorted=this.state.items.sort(function(a, b){return Number(b.variants[0].price) - Number(a.variants[0].price)});
  this.setState({items:sorted,ascending:true,descending:false})
}

searchProducts(e){
  let term=this.state.searchTerm.toLowerCase()
  console.log(term)
  let searched=this.state.items.filter(item=>item.title.toLowerCase().includes(term))
  console.log(searched)
  this.setState({items:searched,searching:true})
}
  render () {
    return (
      <div>
      <NavBar numcartitems={this.state.numcartitems}/>
      <div style={{width:"90vw",marginLeft:"5vw",marginRight:"5vw",marginTop:"1vw"}}>

        <button onClick={() => this.getAllProducts()}>All Products All Categories</button>
        {this.state.collections&&this.state.collections.map(item=>{return(
           <button style={{margin:"0.5vw",opacity:(this.state.chosencollection==item.title)?"0.5":"1"}} onClick={() => this.getCollectionProducts(item.id,item.title)}>{item.title}</button>
        )})}

        <div style={{marginTop:"0.5vw",paddingTop:"0.5vw",borderTop:"solid",borderColor:"#525cb4"}}>
        <button style={{marginRight:"2vw",marginBottom:"1vw",display:"inline",opacity:this.state.searching?"0.5":"1"}}
         onClick={(e) => this.searchProducts(e)}>Search Products</button>
        <input style={{marginRight:"2vw",display:"inline",width:"70%",marginBottom:"1vw"}} onChange={(e) => this.updateSearch(e)}
         type="text" />
         <div>
         <button style={{display:"inline",marginRight:"1vw",opacity:this.state.range?"0.5":"1"}} onClick={this.filterPriceRange}>Set Price Range</button>
         <input style={{marginRight:"2vw",display:"inline",width:"8%",marginBottom:"1vw",marginRight:"1vw"}} onChange={(e) => this.updateBottomRange(e)}
          type="number" /><p style={{display:"inline",marginRight:"1vw"}}>to</p>
          <input style={{marginRight:"2vw",display:"inline",width:"8%",marginBottom:"1vw",marginRight:"1vw"}} onChange={(e) => this.updateTopRange(e)}
           type="number" />
           <button style={{display:"inline",marginBottom:"1vw",marginRight:"1vw",opacity:this.state.ascending?"0.5":"1"}}
            onClick={this.orderlh}>Price Descending</button>
           <button style={{display:"inline",marginBottom:"1vw",marginRight:"1vw",opacity:this.state.descending?"0.5":"1"}}
            onClick={this.orderhl}>Price Ascending</button>
           </div>
        </div>
      <div  style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",maxHeight:"80%",width:"90vw",overflow:"scroll",
      borderStyle:"solid",borderColor:"#525cb4",borderRadius:"10px"}}>
      {this.state.items&&this.state.items.map(item=>{return (
         <div style={{width:"26vw",height:"30vh",overflow:"hidden",margin:"1vw",position:"relative",borderStyle:"solid",
       borderColor:"#525cb4",borderRadius:"10px"}}>
         <div style={{opacity:"0.9",width:"100%",backgroundColor:"white",position:"absolute",display:"flex",justifyContent:"space-between"}}>
          <h2 style={{margin:"1vw",color:"#525cb4",display:"inline"}}>{item.title}</h2>
          <h2 style={{margin:"1vw",color:"#525cb4",display:"inline"}}>${item.variants[0].price}</h2>
          </div>
          <button style={{display:"block",position:"absolute",top:"65%",width:"90%",marginLeft:"1vw"}}><Link to={"/singleproductpage/"+item.id}>View Product Details</Link></button>
          <button style={{display:"block",position:"absolute",top:"80%",width:"90%",marginLeft:"1vw"}} onClick={() => this.addToCart(item.variants[0].id)}>Add to cart</button>
          {!item.availableForSale&&<h3>This item is out of stock</h3>}
          <img style={{width:"100%",height:"100%",objectFit:"cover"}} src={item.images[0].src}/>
          </div>
      )})}
      </div>
      </div>
      </div>
    )
  }
}
