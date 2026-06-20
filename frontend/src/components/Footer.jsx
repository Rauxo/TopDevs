import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="w-full bg-slate-900 border-t border-slate-800">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-10 py-6 flex-wrap">
        {/* Copyright */}
        <p className="text-sm font-medium text-slate-400">
          Copyright &copy; 2026 TopDevs. All rights reserved.
        </p>

        {/* Legal Links */}
        <nav aria-label="Footer navigation">
          <ul className="flex gap-5 list-none">
            <li>
              <Link
                to="/terms"
                className="text-sm font-medium text-slate-400 hover:text-white hover:underline cursor-pointer no-underline transition-colors"
              >
                Terms &amp; Conditions
              </Link>
            </li>
            <li>
              <Link
                to="/privacy"
                className="text-sm font-medium text-slate-400 hover:text-white hover:underline cursor-pointer no-underline transition-colors"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="text-sm font-medium text-slate-400 hover:text-white hover:underline cursor-pointer no-underline transition-colors"
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