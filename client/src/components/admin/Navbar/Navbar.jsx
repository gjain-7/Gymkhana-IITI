import React from "react";
import Button from "@material-ui/core/Button";
import dp from "../../photos/dp.svg";
function Navbar() {
  return (
    <div className="navbar">
      <span id="left">
        <Button
          variant="contained"
          className="nav-btn"
          id="first-btn"
          color="primary"
        >
          Preview
        </Button>
        <Button
          variant="contained"
          className="nav-btn"
          id="second-btn"
          color="primary"
        >
          Publish
        </Button>
      </span>

      <span id="right">
        <Button
          variant="contained"
          className="nav-btn"
          id="third-btn"
          color="primary"
        >
          Change Theme
        </Button>
        <Button
          variant="contained"
          className="nav-btn"
          id="fourth-btn"
          color="primary"
        >
          Home Page
        </Button>
        <img
          id="dp"
          src={dp}
          alt="dp"
          height="45px"
          width="40px"
          radius="3px"
        ></img>
      </span>

    </div>
  );
}

export default Navbar;
