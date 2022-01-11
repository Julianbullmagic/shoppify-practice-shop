import ReactDOM from 'react-dom'
import App from './components/app'
import { AppContainer } from 'react-hot-loader'
import {BrowserRouter,Route,Routes} from 'react-router-dom'
import Cart from './components/cart'
import SingleProductPage from './components/singleproductpage'
import GlobalStyle from './globalstyles';
import NavBar from './components/navbar'
import React from 'react';
export const UserContext = React.createContext();


const render = Component => {

  const handleParentFun = (value) =>{
    console.log("Call to Parent Component!",value);
    setCart(value)
  }

  ReactDOM.render(
    <div>
    <GlobalStyle />
    <NavBar/>
    <BrowserRouter>
    <Routes>

      <Route path='/' element={<App />}/>

      <Route path='/cart' element={<Cart />} />
      <Route path='/singleproductpage/:id' element={<SingleProductPage />} />

      </Routes>

    </BrowserRouter>
    </div>,
    document.getElementById('main')
  )
}

render(App)
if (module.hot) {
  module.hot.accept('./components/app', () => { render(App) })
}
