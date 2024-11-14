import React from "react";
import { Button, Navbar } from "flowbite-react";
import { Link } from "react-router-dom";

function NavbarComponent() {
  return (
    <>
      <Navbar className="container mx-auto bg-red-800 mb-5" color="red" rounded>
        <Navbar.Brand to={"/"} as={Link}>
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            Test ReactJs
          </span>
        </Navbar.Brand>
        <Navbar.Collapse>
          <Navbar.Link as={Link} to={"/"}>
            Dashboard
          </Navbar.Link>
          <Navbar.Link as={Link} to={"/sensor"}>
            Sensor
          </Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
}

export default NavbarComponent;
