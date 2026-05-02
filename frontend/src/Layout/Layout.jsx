import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      {/* pt-[72px] matches the fixed navbar height */}
      <main className="pt-[72px]">{children}</main>
      <Footer />
    </>
  );
};

export default Layout;