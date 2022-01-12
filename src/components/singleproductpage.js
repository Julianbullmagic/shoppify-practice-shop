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

export default function SingleProductPage(props){
  const {id} = useParams();
  const [reviews, setReviews] = useState([]);
  const [average,setAverage]=useState(5)
  const [product,setProduct]=useState({})
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
          await fetch("http://localhost:5000/getproductreviews/"+id)
                  .then(response => response.json())
                  .then(json =>{
                    console.log("reviews",json)
                    let numbers=json.map(item=>item.stars)
                    let av=numbers.reduce(getSum, 0);
                    console.log("SUM",av/json.length)
                    setAverage(av/json.length)
                    setReviews(json)
                  });
}

function getSum(total, num) {
  return total + Math.round(num);
}

async function handleSubmit(e){
  e.preventDefault()

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

      const options={
          method: "POST",
          body: JSON.stringify(newReview),
          headers: {
              "Content-type": "application/json; charset=UTF-8"}}


        await fetch("http://localhost:5000/createreview", options)
                .then(response => response.json()).then(json => console.log(json));
}

  return(
    <div>
    <NavBar numcartitems={numcartitems}/>
  <div style={{margin:"5vw"}}>
{product&&<div>
  <h2>{product.title}</h2>
  <h4>Insert more detailed description here</h4>
  {!product.availableForSale&&<h3>This item is out of stock</h3>}
  {product.variants&&<h3>Price=${product.variants[0].price}</h3>}

  {product.images&&<img style={{height:"auto"}} src={product.images[0].src}/>}
  {product.variants&&<button style={{display:"block"}} onClick={() =>addToCart(product.variants[0].id)}>Add to cart</button>}
</div>
}


  <h2>Leave Review and Rating</h2>
  <p>Stars</p>
  <input
  type="number"
  ref={starsRef} />
  <p>Review</p>
  <input
  type="text"
  ref={reviewRef} />
  <p>Enter you name</p>
  <input
  type="text"
  ref={nameRef} />
  <button onClick={(e)=>handleSubmit(e)}>Submit review</button>
  <h2>Average Rating</h2> <Stars
    stars={average}
    outOf={5}
    full={' #FFFF00'}
    empty={'#E1F1FF'}
    stroke={'#369'}
  />
  {reviews&&reviews.map(item=>{
    return(
      <div>
      <Stars
        stars={item.stars}
        outOf={5}
        full={' #FFFF00'}
        empty={'#E1F1FF'}
        stroke={'#369'}
      />
      <p>{item.review}</p>
      </div>
    )
  })}
</div>
</div>)
}
