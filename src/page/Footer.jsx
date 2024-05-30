import { Link } from "react-router-dom";
import { FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer_section">
      <div className="container">
        <div className="row">
          <div className="col-md-4 footer-col">
            <div className="footer_contact">
              <h4>Reach at..</h4>
              <div className="contact_link_box">
                <Link href="">
                  <i className="fa fa-map-marker" aria-hidden="true"></i>
                  <span>Location</span>
                </Link>
                <Link href="">
                  <i className="fa fa-phone" aria-hidden="true"></i>
                  <span>Call +01 1746185166</span>
                </Link>
                <Link href="">
                  <i className="fa fa-envelope" aria-hidden="true"></i>
                  <span>mdibrahimkhalil516@gmail.com</span>
                </Link>
              </div>
            </div>
          </div>
          <div className="col-md-4 footer-col">
            <div className="footer_detail">
              <Link href="index.html" className="footer-logo">
                Ecom
              </Link>
              <p>
                Necessary, making this the first true generator on the Internet.
                It uses a dictionary of over 200 Latin words, combined with
              </p>
              <div className="footer_social">
                <Link href="">
                  <FaFacebookF />
                </Link>
                <Link href="">
                  <FaInstagram />
                </Link>
                <Link href="">
                  <FaLinkedinIn />
                </Link>
              </div>
            </div>
          </div>
          <div className="col-md-4 footer-col">
            <div className="map_container">
              <div className="map">
                <div id="googleMap"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-info">
          <div className="col-lg-7 mx-auto px-0">
            <p>
              &copy; <span id="displayYear"></span> All Rights Reserved By{" "}
              <Link href="https://html.design/">Ibrahim Khalil</Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
