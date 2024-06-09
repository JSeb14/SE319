import React, { useContext } from "react";
import { useState, useEffect } from "react";
import { Context } from "./Context";

function Shop() {
  const {cart, order} = useContext(Context);;
  const [Cart, setCart] = cart;
  const [Products, setProducts] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const [Results, setResults] = useState([]);
  const [Animal, setAnimal] = useState("all");
  const [Type, setType] = useState("all");

  useEffect(() => {
    fetch("http://localhost:8080/shop")
      .then((response) => response.json())
      .then((products) => {
        setProducts(products);
      });
  });

  // Use separate effect for Results of sort so it is not ovverriden by updates to Products.
  useEffect(() => {
    if (initialized === false) {
      fetch("http://localhost:8080/shop")
        .then((response) => response.json())
        .then((results) => {
          setResults(results);
          setInitialized(true);
        });
    }
  });

  useEffect(() => {
    handleSearch();
  }, [Animal, Type]);

  function addToCart(product) {
    if (product.stock != 0) {
      let copy = [...Cart, product];
      setCart(copy);
    } else {
      alert(
        `Product: ${product.title}\n` +
          `is currently out of stock. We are sorry for the inconvenience!`
      );
    }
  }

  function removeFromCart(product) {
    let cartCopy = [];
    let removeIndex = -1;
    for (let i = 0; i < Cart.length; i++) {
      if (Cart[i].id === product.id) {
        removeIndex = i;
        break;
      }
    }

    let copyInd = 0;
    for (let i = 0; i < Cart.length; i++) {
      if (i != removeIndex) {
        cartCopy[copyInd] = Cart[i];
        copyInd++;
      }
    }
    setCart(cartCopy);
  }

  function handleSearch() {
    var value = document.getElementById("search").value;
    const results = Products.filter((p) => {
      if (Animal === "all" && Type === "all") {
        return p.title.toLowerCase().includes(value.toLowerCase());
      } else if (Animal === "all" && Type !== "all") {
        return (
          p.title.toLowerCase().includes(value.toLowerCase()) &&
          p.type.toLowerCase() === Type
        );
      } else if (Animal !== "all" && Type === "all") {
        return (
          p.title.toLowerCase().includes(value.toLowerCase()) &&
          p.animal.toLowerCase() === Animal
        );
      } else {
        return (
          p.title.toLowerCase().includes(value.toLowerCase()) &&
          p.animal.toLowerCase() === Animal &&
          p.type.toLowerCase() === Type
        );
      }
    });
    setResults(results);
  }

  function quantity(productId) {
    let amount = Cart.filter((item) => item.id === productId);
    return amount.length;
  }

  const getStars = (product) => {
    const rating = product.rate.rating;
    const count = product.rate.count;
    if (rating >= 4.5) {
      return (
        <div>
          <img src="images/star.svg" alt="star"/>
          <img src="images/star.svg" alt="star"/>
          <img src="images/star.svg" alt="star"/>
          <img src="images/star.svg" alt="star"/>
          <img src="images/star.svg" alt="star"/> ({count})
        </div>
      );
    } else if (rating >= 3.5) {
      return (
        <div>
          <img src="images/star.svg" alt="star"/>
          <img src="images/star.svg" alt="star"/>
          <img src="images/star.svg" alt="star"/>
          <img src="images/star.svg" alt="star"/> ({count})
        </div>
      );
    } else if (rating >= 2.5) {
      return (
        <div>
          <img src="images/star.svg" alt="star"/>
          <img src="images/star.svg" alt="star"/>
          <img src="images/star.svg" alt="star"/> ({count})
        </div>
      );
    } else if (rating >= 1.5) {
      return (
        <div>
          <img src="images/star.svg" alt="star"/>
          <img src="images/star.svg" alt="star"/> ({count})
        </div>
      );
    } else if (rating >= 0.5) {
      return (
        <div>
          <img src="images/star.svg" alt="star"/> ({count})
        </div>
      );
    } else {
      return <div>Zero Stars ({count})</div>;
    }
  };

  return (
    <div>
      <div
        id="main"
        className="p-4 p-md-5 mb-4 rounded text-body-emphasis bg-body-secondary"
      >
        <h1 className="display-4">Browse Our Pet Supplies</h1>
        <p className="lead my-3">
          Looking for some treats for your pet? Or perhaps some new toys for your
          recent adoption? We have you covered! Take a look at our wide
          selection down below!
        </p>
      </div>

      <div
        style={{ textAlign: "center", fontSize: 20 + "px" }}
        className="row g-3"
      >
        <div
          style={{ width: 250 + "px", marginLeft: 50 + "px" }}
          className="col-md-5"
        >
          <label htmlFor="search" className="form-label">
            Search
          </label>
          <input
            type="text"
            className="form-control"
            id="search"
            placeholder="Search"
            onChange={handleSearch}
          />
        </div>

        <div
          style={{ width: 250 + "px", marginLeft: 25 + "px" }}
          className="col-md-5"
        >
          <label htmlFor="animal" className="form-label">
            Sort by Animals
          </label>
          <select
            onChange={(e) => {
              setAnimal(e.target.value);
            }}
            className="form-select"
            id="animal"
          >
            <option value="all">All</option>
            <option value="cat">For Cats</option>
            <option value="dog">For Dogs</option>
          </select>
          <div className="invalid-feedback">Please make a valid selection.</div>
        </div>

        <div
          style={{
            width: 250 + "px",
            marginLeft: 25 + "px",
            paddingBottom: 25 + "px",
          }}
          className="col-md-5"
        >
          <label htmlFor="product" className="form-label">
            Sort by Product
          </label>
          <select
            onChange={(e) => {
              setType(e.target.value);
            }}
            className="form-select"
            id="type"
          >
            <option value="all">All</option>
            <option value="food">Food and Treats</option>
            <option value="toy">Toys</option>
          </select>
          <div className="invalid-feedback">Please make a valid selection.</div>
        </div>
        <hr style={{ marginTop: 25 + "px", width: 90 + "%", margin: "auto" }} />

        <div style={{ backgroundColor: "#d9d9d9", paddingTop: 40 + "px" }}>
          <div className="container">
            <div
              className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3"
              style={{ paddingBottom: 20 + "px" }}
            >
              {Results.map((product) => (
                <div key={product.id} className="col">
                  <div className="card shadow-sm">
                    <img
                      src={product.image}
                      className="card-img-top"
                      alt="Item Image"
                    ></img>
                    <div className="card-body">
                      <p className="card-text" style={{ fontSize: 15 + "px" }}>
                        {" "}
                        <strong style={{ fontSize: 20 + "px" }}>
                          {product.title}
                        </strong>
                        <br />({product.animal}/{product.type})
                      </p>
                      <p className="card-text">{product.price}</p>
                      {getStars(product)}
                      <hr />
                      <div>
                        <button onClick={() => removeFromCart(product)}>
                          <img
                            src="images/remove.svg"
                            width="100%"
                            height="auto"
                            alt="remove"
                          />
                        </button>
                        <span style={{ margin: 15 + "px" }}>
                          {quantity(product.id)}
                        </span>
                        <button onClick={() => addToCart(product)}>
                          <img
                            src="images/add.svg"
                            width="100%"
                            height="auto"
                            alt="add"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Shop;
