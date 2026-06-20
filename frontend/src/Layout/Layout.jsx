import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useLocation } from "react-router-dom";

const Layout = ({ children }) => {
  const location = useLocation();
  const hideLayout = location.pathname === "/messages";

  if (hideLayout) {
    return <main className="bg-white min-h-screen">{children}</main>;
  }

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