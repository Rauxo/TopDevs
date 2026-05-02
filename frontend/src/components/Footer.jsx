import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="w-full bg-[#0ff4ce]">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-10 py-5 flex-wrap">
        {/* Copyright */}
        <p className="text-sm font-medium text-emerald-700">
          Copyright &copy; 2026 TopDevs. All rights reserved.
        </p>

        {/* Legal Links */}
        <nav aria-label="Footer navigation">
          <ul className="flex gap-5 list-none">
            <li>
              <Link
                to="/terms"
                className="text-sm font-medium text-emerald-700 hover:underline cursor-pointer no-underline"
              >
                Terms &amp; Conditions
              </Link>
            </li>
            <li>
              <Link
                to="/privacy"
                className="text-sm font-medium text-emerald-700 hover:underline cursor-pointer no-underline"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="text-sm font-medium text-emerald-700 hover:underline cursor-pointer no-underline"
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;