function Authors() {
  return (
    <div>
      <div
        id="main"
        className="p-4 p-md-5 mb-4 rounded text-body-emphasis bg-body-secondary"
      >
        <h1 className="display-4">SE/ComS 319: Construction of User Interfaces</h1>
        <h2 className="display-6">Spring 2024, Dr. Abraham Aldaco</h2>
      </div>

      <div id="authors">
        <div style={{width:100 + "%", float: "inline-end"}}>
          <h3 style={{marginTop: 20 + "px", marginBottom: 20 + "px"}} className="display-6">
            Authors: Team77
          </h3>
          <div className="author" style={{float:"left", marginLeft: 2.5 + "%"}}>
            <h2>Justin Sebahar</h2>
            <h3>jtseb@iastate.edu</h3>
            <h4>5/3/2024</h4>
          </div>

          <div className="author" style={{float:"right", marginRight: 2.5 + "%"}}>
            <h2>Carter Peterson</h2>
            <h3>cjpetey@iastate.edu</h3>
            <h4>5/3/2024</h4>
          </div>
        </div>

        <div style={{width:100 + "%", float: "inline-end", marginTop: 20 + "px"}}>
          <h4>
            Meet Scooter the turtle and Chloe the dog; they're the inspiration
            behind this project!
          </h4>
          <img
            src="./images/author-scooter.jpg"
            style={{marginBottom:25 + "px", marginRight: 5 + "px"}}
            width="30%"
            height="auto"
            alt="Scooter the Turtle"
          />
          <img
            src="./images/author-chloe.jpg"
            style={{marginBottom:25 + "px", marginLeft: 5 + "px"}}
            width="30%"
            height="auto"
            alt="Chloe the Dog"
          />
        </div>
      </div>
    </div>
  );
}

export default Authors;