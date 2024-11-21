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
                  <span> Barishal Sadar, Barishal, Dhaka</span>
                </Link>
                <a href="tel:+8801829674786">
                  <i className="fa fa-phone" aria-hidden="true"></i>
                  <span> +8801829674786</span>
                </a>
                <Link href="">
                  <i className="fa fa-envelope" aria-hidden="true"></i>
                  <span>tannifashionhouse@gmail.com</span>
                </Link>
              </div>
            </div>
          </div>
          <div className="col-md-4 footer-col">
            <div className="footer_detail">
              <Link href="index.html" className="footer-logo">
                Tanni's Fashion House
              </Link>
              <p>
                It is a trendy e-commerce platform offering a wide range of
                stylish clothing and accessories for all occasions. Our
                collection is carefully curated to ensure you always look your
                best, with options for both men and women. 
              </p>
              <div className="footer_social">
                <a
                  href="https://www.facebook.com/tannifashionhouse"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaFacebookF />
                </a>
                <Link href="">
                  <FaInstagram />
                </Link>
                <Link href="">
                  <FaLinkedinIn />
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-info">
          <div className="col-lg-7 mx-auto px-0">
            <p>
              &copy; <span id="displayYear"></span> Developed By{" "}
              <a
                target="_blank"
                href="https://ibrahimkhalill.netlify.app/"
                rel="noreferrer"
              >
                Ibrahim Khalil
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
