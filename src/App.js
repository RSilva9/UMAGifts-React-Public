import BoxCarousel from './components/BoxCarousel.js';
import MainCarousel from './components/Carousel.js';
import NavAndBrand from './components/NavBar.js';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import NavigationButtons from './components/NavigationButtons.js';
import EnviosBrand from './components/EnviosBrand.js';
import Footer from './components/Footer.js';
import FilteredBoxes from './components/FilteredBoxes.js';
import CustomBoxAccordion from './components/CustomBoxAccordion.js';
import ProductAccordion from './components/ProductAccordion.js';
import UserNav from './components/UserNav.js';
import Login from './components/Login.js'
import Cart from './components/Cart.js'
import AdminProducts from './components/AdminProducts.js'
import AdminOrders from './components/AdminOrders.js';
import AdminUsers from './components/AdminUsers.js';
import AdminPanel from './components/AdminPanel.js';
import WhatsappButton from './components/WhatsappButton.js';
import HelpButton from './components/HelpButton.js';
import RelaxButton from './components/RelaxButton.js';
import RelaxSite from './components/RelaxSite.js';
import { ContextProvider } from './components/siteContext.js';
import { useState, useEffect } from 'react';

function App() {
  const [showRelax, setShowRelax] = useState(false)
  const [showComponent, setShowComponent] = useState(null)

  const timeoutDuration = 500

  useEffect(()=>{
    setShowRelax(false)
  }, [window.location.href])

  useEffect(() => {
    let timeout
    if (showRelax == true) {
      timeout = setTimeout(() => {
        setShowComponent(
          <div>
            <NavAndBrand style={"relax"}/>
            <RelaxSite />
          </div>
        )
      }, timeoutDuration)
    } else {
      timeout = setTimeout(() => {
        setShowComponent(
          <div>
            <NavAndBrand />
            <UserNav />
            <FilteredBoxes />
          </div>
        );
      }, timeoutDuration)
    }

    return () => clearTimeout(timeout)
  }, [showRelax, showComponent])

  return(
    <ContextProvider>
      <BrowserRouter>
        <Routes>
        <Route path='/' element={
          <main>
            <NavAndBrand />
            <UserNav />
            <WhatsappButton />
            <MainCarousel />
            <h1 id="mainh1">Regalos empresariales, vinos, espumantes y productos gourmet.</h1>
            <BoxCarousel />
            <NavigationButtons />
            <EnviosBrand />
          </main>
        }/>
        <Route path='/box-prearmadas' element={
          <main>
            <RelaxButton handleShowRelaxChange={setShowRelax} />
            {showComponent}
          </main>
        }/>
        <Route path='/arma-tu-box' element={
          <main>
            <NavAndBrand />
            <UserNav />
            <HelpButton />
            <CustomBoxAccordion />
          </main>
        }/>
        <Route path='/productos' element={
          <main>
            <NavAndBrand />
            <UserNav />
            <ProductAccordion />
          </main>
        }/>
        <Route path='/cuenta' element={
          <main>
            <NavAndBrand />
            <Login />
          </main>
        }/>
        <Route path='/carrito' element={
          <main>
            <NavAndBrand />
            <UserNav />
            <Cart />
          </main>
        }/>
        <Route path='/admin' element={
          <main>
            <NavAndBrand />
            <UserNav />
            <AdminPanel />
          </main>
        }/>
        <Route path='/admin/products' element={
          <main>
            <NavAndBrand />
            <UserNav />
            <AdminProducts />
          </main>
        }/>
        <Route path='/admin/orders' element={
          <main>
            <NavAndBrand />
            <UserNav />
            <AdminOrders />
          </main>
        }/>
        <Route path='/admin/users' element={
          <main>
            <NavAndBrand />
            <UserNav />
            <AdminUsers />
          </main>
        }/>
        </Routes>
        <Footer />
      </BrowserRouter>
    </ContextProvider>
  )

}

export default App;
