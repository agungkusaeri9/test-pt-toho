import React from "react";
import NavbarComponent from "../components/NavbarComponent";

function MainLayout({ children }) {
  return (
    <>
      <NavbarComponent />
      <div className="container mx-auto px-4 py-10">{children}</div>
    </>
  );
}

export default MainLayout;
