import React, { useContext } from "react";
import { useState, useEffect } from "react";
import { Context } from "./Context";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import {
  List,
  ListItem,
  Card,
  Typography,
} from "@material-tailwind/react";
import { Rating } from "react-simple-star-rating";

function Checkout() {
  const [View, setView] = useState(0);
  const { cart, order } = useContext(Context);
  const [Cart, setCart] = cart;
  const [Order, setOrder] = order;
  const [SelectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    console.log(Cart);
    getSelectedItems(Cart);
  }, [Cart]);

  useEffect(() => {
    console.log(SelectedItems);
  }, [SelectedItems]);

  function quantity(items, productId) {
    let amount = items.filter((item) => item.id === productId);
    return amount.length;
  }

  //Get each item in cart, but do not duplicated repeats. Only display each item once.
  function getSelectedItems() {
    const items = [];
    const item = {};

    for (let i in Cart) {
      const product = Cart[i]["id"];
      item[product] = Cart[i];
    }

    for (let i in item) {
      items.push(item[i]);
    }

    setSelectedItems(items);
  }

  const getPrice = (cart) => {
    let subtotal = 0;
    for (let i = 0; i < cart.length; i++) {
      if (cart[i].name == null) {
        let price = Number(String(cart[i].price).substring(1));
        subtotal += price;
      }
    }

    const tax = Number(subtotal * 0.06).toFixed(2);
    let total = Number(subtotal) + Number(tax);
    total = total.toFixed(2);

    if (cart.length > 0) {
      return (
        <div style={{ paddingTop: 30 + "px" }}>
          <h3>Subtotal: ${subtotal}</h3>
          <h3>Tax: ${tax}</h3>
          <h3>Total: ${total}</h3>
        </div>
      );
    }
  };

  function displayCart(items, entity) {
    if (entity.title != null) {
      return (
        <div>
          <p className="card-text">{entity.price} each</p>
          <span style={{ margin: 15 + "px" }}>
            Quantity: {quantity(items, entity.id)}
          </span>
        </div>
      );
    } else {
      return <span>Place on hold</span>;
    }
  }

  const Confirm = () => {
    const [Validated, setValidated] = useState(false);
    const [FormData, setFormData] = useState({
      name: "",
      email: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      card: "",
    });

    function handleSubmit(event) {
      event.preventDefault();
      const form = event.target;
      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
        setValidated(true);
      } else {
        confirmOrder(event);
      }
    }

    function confirmOrder(event) {
      const form = event.target;
      const name = form.name.value;
      const email = form.email.value;
      const address = form.address.value;
      const city = form.city.value;
      const state = form.state.value;
      const zip = form.zip.value;
      const card = form.card.value;

      const json = {
        name: name,
        email: email,
        address: address,
        city: city,
        state: state,
        zip: zip,
        card: card,
        items: Cart,
      };

      setOrder(json);

      // Post order
      fetch("http://localhost:8080/order", {
        method: "POST",
        body: JSON.stringify(json),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });

      // Update product stock (ignore animal in cart)
      for (let i in SelectedItems) {
        if (SelectedItems[i].title != null) {
          const item = SelectedItems[i];
          const stock = Number(item.stock);
          const newStock = stock - quantity(Cart, item.id);

          fetch("http://localhost:8080/shop/" + item.id, {
            method: "PUT",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              id: item.id,
              type: item.type,
              animal: item.animal,
              title: item.title,
              price: item.price,
              image: item.image,
              stock: String(newStock),
              rate: item.rate,
            }),
          });
        }
      }

      // Update product stock (ignore animal in cart)
      for (let i in SelectedItems) {
        if (SelectedItems[i].title == null) {
          const item = SelectedItems[i];
          console.log(item);

          fetch("http://localhost:8080/adopt/" + item.id, {
            method: "PUT",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              id: item.id,
              animal: item.animal,
              name: item.name,
              age: item.age,
              description: item.description,
              image: item.image,
              isReserved: true,
            }),
          });
        }
      }

      setCart([]);

      form.name.value = "";
      form.email.value = "";
      form.address.value = "";
      form.city.value = "";
      form.state.value = "";
      form.zip.value = "";
      form.card.value = "";

      //alert(`Your order has been placed. Thanks for your support!`);
      setView(1);
    }

    const change = (event) => {
      const { name, value } = event.target;
      setFormData({
        ...FormData,
        [name]: value,
      });
    };

    function getCheckout() {
      // Only display checkout form if cart is not empty.
      if (Cart.length > 0) {
        return (
          <div>
            <hr style={{ width: 90 + "%", margin: "auto" }} />
            <Container style={{ marginTop: 15 + "px" }}>
              <h1 style={{ textAlign: "center" }} className="font">
                Checkout
              </h1>
              <Form noValidate validated={Validated} onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="name">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={FormData.name}
                    onChange={change}
                    pattern="^[a-zA-Z ]+$"
                    minLength={2}
                    required
                    isInvalid={Validated && !/^[a-zA-Z ]+$/.test(FormData.name)}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter a name (letters only)
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="text"
                    name="email"
                    value={FormData.email}
                    onChange={change}
                    placeholder="123@gmail.com"
                    pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                    required
                    isInvalid={
                      Validated &&
                      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(FormData.email)
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter a valid email address
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="address">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="1234 Happy Rd"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter an address
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="city">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    name="city"
                    placeholder="City"
                    value={FormData.city}
                    onChange={change}
                    pattern="^[a-zA-Z]+$"
                    minLength={2}
                    required
                    isInvalid={Validated && !/^[a-zA-Z]+$/.test(FormData.city)}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter a city (letters only)
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="state">
                  <Form.Label>State</Form.Label>
                  <Form.Control
                    type="text"
                    name="state"
                    placeholder="State"
                    value={FormData.state}
                    onChange={change}
                    pattern="^[a-zA-Z]+$"
                    required
                    isInvalid={Validated && !/^[a-zA-Z]+$/.test(FormData.state)}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter a state name (letters only)
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="zip">
                  <Form.Label>Zip Code</Form.Label>
                  <Form.Control
                    type="text"
                    name="zip"
                    placeholder="12345"
                    value={FormData.zip}
                    onChange={change}
                    pattern="[0-9]{5}"
                    required
                    isInvalid={Validated && !/^[0-9]{5}$/.test(FormData.zip)}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter a five digit zip code (numerical inputs only)
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="card">
                  <Form.Label>Card Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="card"
                    placeholder="**** **** **** ****"
                    value={FormData.card}
                    onChange={change}
                    pattern="[0-9]{16}"
                    required
                    isInvalid={Validated && !/^[0-9]{16}$/.test(FormData.card)}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter a valid card number (16 numerical digit only)
                  </Form.Control.Feedback>
                </Form.Group>
                <Button type="submit">Place Order</Button>
              </Form>
            </Container>
          </div>
        );
      } else {
        return (
          <p style={{ textAlign: "center", fontSize: 20 + "px" }}>
            There are currently no items in your cart.
          </p>
        );
      }
    }

    return (
      <div>
        <div
          style={{
            paddingTop: 10 + "px",
            paddingBottom: 15 + "px",
            textAlign: "center",
            fontSize: 20 + "px",
          }}
        >
          <h1 className="font">Your Cart</h1>
          <hr style={{ width: 90 + "%", margin: "auto" }} />
          <div
            className="container"
            style={{ marginTop: 25 + "px", marginBottom: 10 + "px" }}
          >
            <div
              id="col"
              className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3"
            >
              {SelectedItems.map((product) => (
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
                          {product.name}
                        </strong>
                        <br />
                      </p>
                      <div>{displayCart(Cart, product)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>{getPrice(Cart)}</div>
        </div>
        {getCheckout()}
      </div>
    );
  };

  const Review = () => {
    const [ratings, setRatings] = useState({});
    const [submitted, setSubmitted] = useState([]);
    const [purchases, setPurchases] = useState([]); // Local copy of purchased items so cart can be reset prior
    const [items, setItems] = useState([]); // Local copy of purchased items without duplicates

    useEffect(() => {
      setPurchases(Order.items);
    }, [Order]);

    useEffect(() => {
      getItems();
    }, [purchases]);

    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

    const handleRating = (productId, rating) => {
      setRatings((prevRatings) => ({
        ...prevRatings,
        [productId]: rating,
      }));
    };

    function getItems() {
      const items = [];
      const item = {};

      for (let i in purchases) {
        const product = purchases[i]["id"];
        item[product] = purchases[i];
      }

      for (let i in item) {
        items.push(item[i]);
      }

      setItems(items);
    }

    const submit = (product) => {
      if (!submitted.includes(product.id)) {
        let inputRating = ratings[product.id];
        if (inputRating !== undefined) {
          inputRating += 1;
          const rating = Number(product.rate.rating);
          let count = Number(product.rate.count);
          let newRating = Number(
            (rating * count + inputRating) / ++count
          ).toFixed(2);

          fetch("http://localhost:8080/shop/" + product.id, {
            method: "PUT",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              id: product.id,
              type: product.type,
              animal: product.animal,
              title: product.title,
              price: product.price,
              image: product.image,
              stock: product.stock,
              rate: {
                rating: String(newRating),
                count: String(count),
              },
            }),
          });
          setSubmitted([...submitted, product.id]);
        }
      } else {
        alert(`You have already left a review for this product.`);
      }
    };

    const filterOutAnimal = () => {
      let copy = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].title != null) {
          copy.push(items[i]);
        }
      }
      return copy;
    };

    function getCard() {
      let card = String(Order.card).substring(12);
      return "************" + card;
    }

    return (
      <div
        style={{
          paddingTop: 10 + "px",
          paddingBottom: 15 + "px",
          textAlign: "center",
          fontSize: 20 + "px",
        }}
      >
        <div
          id="main"
          className="p-4 p-md-5 mb-4 rounded text-body-emphasis bg-body-secondary"
        >
          <h1 className="display-4">Thank You For Your Purchase!</h1>
          <p className="lead my-3">
            Your support goes a long way in supporting our small business. We
            strive to provide excellence in the products we sell. If you
            experience any difficulties with your purchase, please do not
            hesitate to contact us!
          </p>
        </div>
        <h1 className="font">Your Order Details</h1>
        <div
          className="container"
          style={{ marginTop: 25 + "px", marginBottom: 20 + "px" }}
        >
          <div
            id="col"
            className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3"
          >
            {items.map((product) => (
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
                        {product.name}
                      </strong>
                      <br />
                    </p>
                    <div>{displayCart(purchases, product)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div>
            <div id="authors">
              <div style={{ width: 100 + "%", float: "inline-end" }}>
                <h3
                  style={{ marginTop: 20 + "px", marginBottom: 20 + "px" }}
                  className="font"
                >
                  Billing Information
                </h3>
                <div
                  className="author"
                  style={{ float: "left", marginLeft: 2.5 + "%" }}
                >
                  <div>
                    <h4>Shipping Address</h4>
                    {Order.address}
                    <br /> {Order.city} {", "} {Order.state} {Order.zip}
                  </div>
                </div>

                <div
                  className="author"
                  style={{ float: "right", marginRight: 2.5 + "%" }}
                >
                  <div>
                    <h4>Payment</h4>
                    Name: {Order.name} <br />
                    Card Number: {getCard()}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {getPrice(purchases)}
        </div>
        <hr
          style={{ width: 90 + "%", margin: "auto", marginBottom: 15 + "px" }}
        />
        <div>
          <h1 className="display-6">
            Would you Like to Leave Any Product Ratings?
          </h1>
          <p>
            Leaving a rating for any of our products helps us greatly understand
            the needs of our customers. It helps us decide which items to keep
            in our shop. So, any feedback provided would be greatly appreciated!
          </p>
        </div>
        <Card className="w-96">
          <List>
            {filterOutAnimal().map((product) => (
              <ListItem key={product.id}>
                <div>
                  <Typography variant="h6" color="blue-gray">
                    {product.title}
                  </Typography>
                  <div className="App">
                    <Rating
                      onClick={(newValue) => handleRating(product.id, newValue)}
                      initialValue={0}
                    />
                    <Button
                      style={{ margin: 5 + "px" }}
                      onClick={() => submit(product)}
                    >
                      Submit
                    </Button>
                  </div>
                </div>
              </ListItem>
            ))}
          </List>
        </Card>
        <Button
          onClick={() => {
            setView(0);
          }}
        >
          Back
        </Button>
      </div>
    );
  };

  return (
    <div>
      {View === 0 && <Confirm />}
      {View === 1 && <Review />}
    </div>
  );
}

export default Checkout;
