import React, { useContext } from "react";
import { useState, useEffect } from "react";
import { Context } from "./Context";

function Adopt() {
  const { cart, order } = useContext(Context);
  const [Cart, setCart] = cart;
  const [Pets, setPets] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const [Results, setResults] = useState([]);
  const [Animal, setAnimal] = useState("all");
  const [Type, setType] = useState("all");

  useEffect(() => {
    fetch("http://localhost:8080/adopt")
      .then((response) => response.json())
      .then((pets) => {
        setPets(pets);
      });
  });

  // Use separate effect for Results of sort so it is not ovverriden by updates to Products.
  useEffect(() => {
    if (initialized === false) {
      fetch("http://localhost:8080/adopt")
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

  function addToCart(pet) {

    for (let i in Cart) {
      const product = Cart[i];
      if(product.id == pet.id){
        removeFromCart(pet);
        let button = document.getElementById(pet.id);
        button.style.backgroundColor = "white";
        button.innerHTML = "Reserve"
        return;
      }
      else if(product.title == null){
        alert("You may only reserve one pet at a time!");
        return;
      }
    }

      let copy = [...Cart, pet];
      console.log(copy);
      setCart(copy);
      let button = document.getElementById(pet.id);
      button.style.backgroundColor = "green";
      button.innerHTML = "Reserved"
  }

  const isReserved = (pet) => {
    for (let i in Cart) {
      const product = Cart[i];
      if(product.id == pet.id){
        return (
          <button id={pet.id} style={{ backgroundColor: "green"}} className="reservedButton" onClick={() => addToCart(pet)}>Reserved</button>
      );
      }
    }
    if(pet.isReserved == false){
        return (
            <button id={pet.id} className="reservedButton" onClick={() => addToCart(pet)}>Reserve</button>
        );
    }
    else{
        return (
            <button id={pet.id} className="reservedButton" style={{ backgroundColor: "red"}}>Reserved</button>
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
    console.log(Cart);
  }

  function handleSearch() {
    var value = document.getElementById("search").value;
    const results = Pets.filter((p) => {
      if (Animal === "all" && Type === "all") {
        return p.name.toLowerCase().includes(value.toLowerCase());
      } else if (Animal === "all" && Type !== "all") {
        return (
          p.name.toLowerCase().includes(value.toLowerCase()) &&
          p.type.toLowerCase() === Type
        );
      } else if (Animal !== "all" && Type === "all") {
        return (
          p.name.toLowerCase().includes(value.toLowerCase()) &&
          p.animal.toLowerCase() === Animal
        );
      } else {
        return (
          p.name.toLowerCase().includes(value.toLowerCase()) &&
          p.animal.toLowerCase() === Animal &&
          p.type.toLowerCase() === Type
        );
      }
    });
    console.log(results);
    setResults(results);
  }

  return (
    <div>
      <div
        id="main"
        className="p-4 p-md-5 mb-4 rounded text-body-emphasis bg-body-secondary"
      >
        <h1 className="display-4">Pet Adoption</h1>
        <p className="lead my-3">
          Looking to adopt a pet? Here are the current friends available for adoption. Click reserve to
          schedule a time to meet them!
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
          style={{ width: 250 + "px", marginLeft: 25 + "px", paddingBottom: 25 + "px" }}
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

        <hr style={{ marginTop: 25 + "px", width: 90 + "%", margin: "auto" }} />

        <div style={{ backgroundColor: "#d9d9d9", paddingTop: 40 + "px" }}>
          <div className="container">
            <div
              className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3"
              style={{ paddingBottom: 20 + "px" }}
            >
              {Results.map((pet) => (
                <div key={pet.id} className="col">
                  <div className="card shadow-sm">
                    <img
                      src={pet.image}
                      className="card-img-top"
                      alt="Item Image"
                    ></img>
                    <div className="card-body">
                      <p className="card-text" style={{ fontSize: 15 + "px" }}>
                        {" "}
                        <strong style={{ fontSize: 20 + "px" }}>
                          {pet.name}
                        </strong>
                        <br />{pet.description}
                      </p>
                      <hr />
                      <div>
                        {isReserved(pet)}
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

export default Adopt;
