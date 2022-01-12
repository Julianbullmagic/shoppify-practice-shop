import { nanoid } from 'nanoid'
import {useParams} from "react-router-dom";
import React, {useEffect,useState,useRef} from 'react';
import Stars from 'simple-rating-stars';
import Client from 'shopify-buy';
import NavBar from './navbar'


const client = Client.buildClient({
  domain: 'shoeshoeshoe3218.myshopify.com',
  storefrontAccessToken: '1c85f492e0af12f1faf7a619b1baa3a4'
});

let url

if(process.env.NODE_ENV=="production"){
  url="https://all-shoes.herokuapp.com/"
}

if(process.env.NODE_ENV=="development"){
 url="http://localhost:5000"
}

export default function SingleProductPage(props){
  const {id} = useParams();
  const [reviews, setReviews] = useState([]);
  const [average,setAverage]=useState(5)
  const [product,setProduct]=useState({})
  const [error,setError]=useState(false)
  const [submitted,setSubmitted]=useState(false)
  const [toggleform,setToggleform]=useState(false)
  const [numcartitems,setNumcartitems]=useState(0)
  const nameRef = useRef('');
  const reviewRef = useRef('');
  const starsRef = useRef(5);


useEffect(()=>{
console.log("id",id)
getReviews()
getProduct()
getCheckout()
},[])

 function toggleForm(){
setToggleform(!toggleform)
}

async function getProduct(){
  client.product.fetch(id).then((product) => {
  console.log(product);
  setProduct(product)
});
}

async function getCheckout(){
  let checkout=sessionStorage.getItem('checkout')
console.log("check on page refresh",checkout)
  if(checkout){
    client.checkout.fetch(checkout).then((checkout) => {
    console.log("checkout on page refresh",checkout);
    setNumcartitems(checkout.lineItems.length)
  });
}
}

async function addToCart(id){
  let checkout=sessionStorage.getItem('checkout')
console.log("check",checkout)
  if(!checkout){
    await client.checkout.create().then((checkout) => {
    // Do something with the checkout
    console.log(checkout);
    sessionStorage.setItem('checkout',checkout.id)
  });
}
  console.log("chekcout",checkout)

const lineItemsToAdd = [
  {
    variantId: id,
    quantity: 1,
  }
];
await client.checkout.addLineItems(checkout, lineItemsToAdd).then((checkout) => {
  console.log(checkout.lineItems);
setNumcartitems(checkout.lineItems.length)
});
}

async function getReviews(){
          await fetch(url+"/getproductreviews/"+id)
                  .then(response => response.json())
                  .then(json =>{
                    console.log("reviews",json)
                    let numbers=json.map(item=>Number(item.stars))
                    let av=numbers.reduce(getSum, 0);
                    console.log("SUM",av/json.length)
                    setAverage(Math.round(av/json.length))
                    setReviews(json)
                  });
}

function getSum(total, num) {
  return total + num
}

async function handleSubmit(e){
  e.preventDefault()

  if(starsRef.current.value>=5||starsRef.current.value<=0){
setError(true)
}

if(starsRef.current.value<=5&&starsRef.current.value>=0){
  setError(false)

  var d = new Date();
  var n = d.getTime();
  var reviewId=nanoid()

  const newReview={
    id:reviewId,
    productid:id,
    review: reviewRef.current.value,
    stars:starsRef.current.value,
    name:nameRef.current.value,
    timecreated:n
  }

  console.log("newReview",newReview)
  let newreviews=JSON.parse(JSON.stringify(reviews))
  console.log("length",newreviews.length)
  newreviews.push(newReview)
  console.log("length",newreviews.length)
  let numbers=newreviews.map(item=>Number(item.stars))
  console.log("numbers",numbers)
  let av=numbers.reduce(getSum, 0);
  console.log("SUM",av/newreviews.length)
  setAverage(Math.round(av/newreviews.length))
  setReviews(newreviews)

  const options={
      method: "POST",
      body: JSON.stringify(newReview),
      headers: {
          "Content-type": "application/json; charset=UTF-8"}}


    await fetch(url+"/createreview", options)
            .then(response => response.json()).then(json => console.log(json));
            setToggleform(false)
            setSubmitted(true)
}


}

  return(
    <div>
    <NavBar numcartitems={numcartitems}/>
  <div style={{margin:"5vw"}}>
{product&&<div style={{display:"flex",justifyContent:"space-between"}}>
  <div>
  <h2>{product.title}</h2>
  <h4>Insert more detailed description here</h4>
  {!product.availableForSale&&<h3>This item is out of stock</h3>}
  {product.variants&&<h3>Price=${product.variants[0].price}</h3>}
  {product.variants&&<button style={{display:"block"}} onClick={() =>addToCart(product.variants[0].id)}>Add to cart</button>}
</div>
<div>
  {product.images&&<img style={{height:"auto",maxWidth:"40vw"}} src={product.images[0].src}/>}
</div>
</div>
}
<div style={{margin:"10vw",padding:"1vw",borderStyle:"solid",borderColor:"#525cb4",borderRadius:"10px",textAlign:"left",
color:"#525cb4",width:"60vw",transition:"height 2s",height:toggleform?"75vh":"4vh",overflow:"hidden"}}>
<button style={{display:"inline"}} onClick={(e)=>toggleForm(e)}>Leave A Review</button>
{submitted&&<p style={{display:"inline",marginLeft:"1vw"}}>Thankyou for submitting your review</p>}
<div style={{display:toggleform?"block":"none"}}>
  <h2 style={{transform:"translateY(-60%)"}}>Leave Review and Rating</h2>
  <p style={{transform:"translateY(-100%)"}}>Review</p>
  <textarea
  style={{transform:"translateY(-10%)",overflow:"scroll",width:"100%",height:"40vh",borderRadius:"10px",borderStyle:"solid",borderColor:"#525cb4"}}
  ref={reviewRef} />
  <div style={{display:"flex",transform:"translateY(-20%)"}}>
  <div style={{width:"30%"}}>
  <p style={{display:"inline"}}>Stars</p>
  <input
  style={{width:"70%",margin:"1vw",display:"inline"}}
  type="number"
  ref={starsRef} />
  </div>
  <div style={{width:"70%",margin:"1vw",display:"inline"}}>
  <p style={{display:"inline",marginRight:"1vw"}}>Enter you name</p>
  <input
  style={{width:"68%",display:"inline"}}
  type="text"
  ref={nameRef} />
  </div>
  </div>
  <button style={{display:"inline"}} onClick={(e)=>handleSubmit(e)}>Submit review</button>
  {error&&<p style={{color:"red",display:"inline",marginLeft:"1vw"}}>rating must be between 0 and 5</p>}
  </div>
  </div>
  {reviews&&<div style={{marginBottom:"1vw"}}><h2>Average Rating</h2> <Stars
    stars={average}
    outOf={5}
    full={' #FFFF00'}
    empty={'#E1F1FF'}
    stroke={'#369'}
  /></div>}
  {reviews&&reviews.map(item=>{
    return(
      <div style={{borderRadius:"10px",borderStyle:"solid",borderColor:"#525cb4",padding:"1vw",marginBottom:"1vw"}}>
      <Stars
        stars={item.stars}
        outOf={5}
        full={' #FFFF00'}
        empty={'#E1F1FF'}
        style={{display:"inline"}}
        stroke={'#369'}
      />
      <p style={{display:"inline",transform:"translateY('20%')"}}><strong>Name:</strong>{item.name}</p>
      <p><strong>Review:</strong>{item.review}</p>
      </div>
    )
  })}
</div>
</div>)
}
