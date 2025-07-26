import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/Footer.css"
const Footer = () => {
  return (
    <>
    <footer className="text-center text-lg-start mt-4 header-container">
      <div className="container p-4 header-Title">
        <div className="row d-flex justify-content-center align-items-center">
          <div className="col-lg-4 col-md-6 mb-4 mb-md-0 d-flex justify-content-center align-items-center">
            <div>
            <h5 className="text-uppercase">Internet Banking</h5>
            <p className="footer-font">Secure and seamless banking experience anytime, anywhere.</p>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 mb-4 mb-md-0 d-flex justify-content-center align-items-center">
            <div>
            <h5 className="text-uppercase text-center">Quick Links</h5>
            <div className="gap-3">
            <ul className="list-unstyled d-flex gap-2">
              <li><a href="/dashboard" className="footer-font">Logout</a></li>
              <li><a href="/dashboard" className="footer-font">Account</a></li>
              <li><a href="/dashboard" className="footer-font">Transfer</a></li>
              <li><a href="/dashboard" className="footer-font">Payment</a></li>
            </ul>
            <ul className="list-unstyled d-flex gap-2">
              <li><a href="/dashboard" className="footer-font">Wallet</a></li>
              <li><a href="/dashboard" className="footer-font">Loan</a></li>
              <li><a href="/dashboard" className="footer-font">Cards</a></li>
              <li><a href="/dashboard" className="footer-font">Service</a></li>
              <li><a href="/dashboard" className="footer-font">Apply</a></li>
            </ul>
            </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-12 mb-4 mb-md-0 d-flex justify-content-center align-items-center">
            <div>
            <h5 className="text-uppercase">Follow Us</h5>
            <div className="text-end">
            <a href="/dashboard" className="footer-font me-3"><i className="fab fa-facebook"></i></a>
            <a href="/dashboard" className="footer-font me-3"><i className="fab fa-twitter"></i></a>
            <a href="/dashboard" className="footer-font me-3"><i className="fab fa-instagram"></i></a>
            </div>
            </div>
          </div>
        </div>
      </div>
    </footer>   
      <div className="text-center p-3">
        © {new Date().getFullYear()} Internet Banking. All rights reserved.
      </div>
    </>
  );
};

export default Footer;
