import "./App.css";
import React, { useState, useEffect } from "react";
import { Context } from "./Context";
import { useContext } from "react";
import Home from "./Home";
import Shop from "./Shop";
import Adopt from "./Adopt";
import Checkout from "./Checkout";
import Authors from "./Authors"

function App() {
  const [View, setView] = useState(0);
  const { cart, order } = useContext(Context);
  const [Cart, setCart] = cart;

  function toHome() {
    setView(0);
  }

  function toAdopt() {
    setView(1);
  }

  function toShop() {
    setView(2);
  }

  function toCart() {
    setView(3);
  }

  function toAuthors() {
    setView(4);
  }

  return (
    <div className="App">
      <header>
        <div className="px-3 py-2 border-bottom">
          <div className="container">
            <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
              <a
                style={{ paddingLeft: 15 + "px" }}
                href="./index.html"
                className="d-flex align-items-center my-2 my-lg-0 me-lg-auto text-white text-decoration-none"
              >
                <img
                  src="images/shop.svg"
                  className="bi d-block mx-auto mb-1"
                  width="75px"
                  height="75px"
                ></img>
                <span style={{ fontSize: 40 + "px" }}>Scooter's Pet Shop</span>
              </a>

              <ul
                style={{ paddingRight: 50 + "px" }}
                className="nav col-12 col-lg-auto my-2 justify-content-center my-md-0 text-small"
              >
                <li>
                  <button onClick={toHome} className="nav-link text-secondary">
                    <img
                      src="./images/home.svg"
                      className="bi d-block mx-auto mb-1"
                      width="30"
                      height="30"
                    ></img>
                    <span id="home" className="hover">
                      Home
                    </span>
                  </button>
                </li>
                <li>
                  <button onClick={toAdopt} className="nav-link text-white">
                    <img
                      src="./images/adopt.svg"
                      className="bi d-block mx-auto mb-1"
                      width="30"
                      height="30"
                    ></img>
                    <span className="hover">Adopt</span>
                  </button>
                </li>
                <li>
                  <button onClick={toShop} className="nav-link text-white">
                    <img
                      src="./images/storefront.svg"
                      className="bi d-block mx-auto mb-1"
                      width="30"
                      height="30"
                    ></img>
                    <span className="hover">Shop</span>
                  </button>
                </li>
                <li>
                  <button onClick={toCart} className="nav-link text-white">
                    <img
                      src="./images/cart.svg"
                      className="bi d-block mx-auto mb-1"
                      width="30"
                      height="30"
                    ></img>
                    <span className="hover">
                      Cart{" "}
                      <span style={{ fontSize: 18 + "px" }}>
                        ({Cart.length})
                      </span>
                    </span>
                  </button>
                </li>
                <li>
                  <button onClick={toAuthors} className="nav-link text-white">
                    <img
                      src="./images/info.svg"
                      className="bi d-block mx-auto mb-1"
                      width="30"
                      height="30"
                    ></img>
                    <span className="hover">Authors</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>

      <div>
        {View === 0 && <Home />}
        {View === 1 && <Adopt />}
        {View === 2 && <Shop />}
        {View === 3 && <Checkout />}
        {View === 4 && <Authors />}
      </div>
      <footer
        id="footer"
        className="d-flex flex-wrap justify-content-between align-items-center border-top"
      >
        <p
          style={{ paddingLeft: 20 + "px" }}
          className="col-md-4 mb-0 text-body-secondary"
        >
          <strong>&copy; 2024 Scooter's Pet Shop, Inc</strong>
        </p>
        <p className="col-md-4 mb-0 text-body-secondary">
          Phone: #123-456-7890 &nbsp; &nbsp; Address: 1234 The Rd. Ames, IA
        </p>
      </footer>
    </div>
  );
}

export default App;
