import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`

body{
  color:#525cb4;
}

.nav{
  width:100vw;
  height:12vh;
  transform:translate(-2%,-12%);
  background-color:#00CD00;
  vertical-align: middle;
  display:flex;
  align-items:center;
  justify-content:center;
  box-shadow: 5px 5px 5px 2px #00CD00;
}

.navh1{
  transform:translateX(-50%)
  color:white;
  display:inline;
  vertical-align: middle;
}

.navh2{
  display:inline;
  color:white;
  margin-left:1vw;
  vertical-align: middle;
  text-decoration:none;
}
a{
  text-decoration:none;
color:white;
}
button {
  align-items: center;
  appearance: none;
  background-image: radial-gradient(100% 100% at 100% 0, #5adaff 0, #5468ff 100%);
  border: 0;
  border-radius: 6px;
  box-shadow: rgba(45, 35, 66, .4) 0 2px 4px,rgba(45, 35, 66, .3) 0 7px 13px -3px,rgba(58, 65, 111, .5) 0 -3px 0 inset;
  box-sizing: border-box;
  color: #fff;
  cursor: pointer;
  display: inline-flex;
  font-family: "JetBrains Mono",monospace;
  height: 4vh;
  justify-content: center;
  line-height: 1;
  list-style: none;
  overflow: hidden;
  padding-left:2vw;
  padding-right: 2vw;
  position: relative;
  text-align: left;
  text-decoration: none;
  transition: box-shadow .15s,transform .15s;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  white-space: nowrap;
  will-change: box-shadow,transform;
  font-size: 18px;
}

button:focus {
  box-shadow: #3c4fe0 0 0 0 1.5px inset, rgba(45, 35, 66, .4) 0 2px 4px, rgba(45, 35, 66, .3) 0 7px 13px -3px, #3c4fe0 0 -3px 0 inset;
}

button:hover {
  box-shadow: rgba(45, 35, 66, .4) 0 4px 8px, rgba(45, 35, 66, .3) 0 7px 13px -3px, #3c4fe0 0 -3px 0 inset;
  transform: translateY(-2px);
}

button:active {
  box-shadow: #3c4fe0 0 3px 7px inset;
  transform: translateY(2px);
}

input{
box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
border-color:rgba(0, 0, 0, 0.35);
margin-right:2vw;
border-radius:10px;
}

.cartheader{
  margin-left:4vw;
}

label{
  display:block;
  margin-bottom:2vw;
}

.cart{
  margin:4vw;
}

input{
  width:80%;
}

`;

export default GlobalStyle
