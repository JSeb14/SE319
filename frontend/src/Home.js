function Home() {
  return (
    <div>
      <div
        id="main"
        className="p-4 p-md-5 mb-4 rounded text-body-emphasis bg-body-secondary"
      >
        <h1 className="display-4">Welcome to Scooter's Pet Shop!</h1>
        <p className="lead my-3">
          Scooter's Pet Shop is a local, family owned store that specializes in
          pet supplies. Our passion for animals is reflected in the
          extraordinary care we provide and options we offer, being supplies or
          a furry new friend! Our store is a fun and welcoming place for any
          animal, so stop on by anytime!
        </p>
      </div>

      <div id="services">
        <h1>Our Services</h1>
        <p style={{marginBottom:30 + "px"}}>
          We offer a wide range of services tailored to the needs of you and
          your pet:
        </p>
        <div
          className="service"
          id="service1"
          style={{float:"left", marginLeft:2.5 +"%"}}
        >
          <h2 style={{paddingTop:10 +"px"}}>Adoption</h2>
          <hr style={{width:90 + "%", margin:"auto"}} />
          <p style={{paddingTop:20 + "px"}}>
            We partner with local animal shelters to find new homes for many
            animals in need.
            <a href="./adopt.html">
              Take a look at the variety and find your new friend!
            </a>
          </p>
          <br />
          <img
            style={{marginBottom: 30 + "px"}}
            src="./images/index-adopt.jpg"
            width="90%"
            height="auto"
            alt="Dog"
          />
        </div>
        <div
          className="service"
          id="service2"
          style={{float:"right", marginRight:2.5 + "%"}}
        >
          <h2 style={{paddingTop: 10 + "px"}}>Shop</h2>
          <hr style={{width:90 + "%", margin:"auto"}} />
          <p style={{paddingTop:20 + "px"}}>
            We have everything you need to keep you pets nice and happy! From
            food to toys, we've got you covered.{" "}
            <a href="./shop.html">Take a look at our selection.</a>
          </p>
          <br />
          <img
            style={{marginBottom:30 + "px"}}
            src="./images/index-shop.jpg"
            width="60%"
            height="auto"
            alt="Dog"
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
