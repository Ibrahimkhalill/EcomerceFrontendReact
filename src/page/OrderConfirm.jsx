import Navbar from "./Navbar";
import success from "../images/success.png";
import { Link } from "react-router-dom";
function OrderConfirm() {
  return (
    <div className="sub_page">
      <Navbar />
      <div className="container">
        <div className="sucess_item_container">
          <div>
            <img src={success} width={50} alt="" />
          </div>
          <div className="header_order_confirm">Your Order Has Been Received</div>
          <div style={{color:"red"}}>Thank you for your purchase</div>
          <div>Please Have This Amount Ready On delivery time</div>
          <div className="email_sent_order_confirm">We will send order confirmation email with details of your order</div>
         <Link to={"/"}><button>Continue Shopping</button></Link> 
        </div>
      </div>
    </div>
  );
}

export default OrderConfirm;
