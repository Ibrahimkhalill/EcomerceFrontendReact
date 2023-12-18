import React from 'react'
import '../purchase/hardware_purchase.css'

const hardware_salepage = () => {

  const newWidth = {
    width: "7.5vw"
  };

  return (
    <div className='full_div'>
        <div className='navbar'></div>
        <div className='first_row_div'>
          <div className='invisible_div'>
            <div className='invisible_div_sale_col1'>
              <div className='input_field_short'>
                <label>Invoice No.</label>
                <input/>
              </div>
              <div className='input_field_short'>
                <label>Order No.</label>
                <input/>
              </div>
            </div>
            <div className='invisible_div_sale_col2'>
              <div className='input_field_short'>
                <label>Date</label>
                <input/>
              </div>
              <div className='input_field_short'>
                <label>Date</label>
                <input/>
              </div>
            </div>
            <fieldset className='customer_fieldset'>
              <legend>Vendor/Supplier</legend>
              <div className='customer_inner_div1'>
                <div className='customer_inner_div3'>
                  <div className='input_field_short'>
                    <label>Code</label>
                    <input/>
                  </div>
                </div>
                <div className='customer_inner_div4'>
                  <div className='input_field_short'>
                    <label>Balance</label>
                    <input/>
                  </div>
                </div>
              </div>
              <div className='customer_inner_div2'>
                <div className='input_field_long'>
                  <label>Name</label>
                  <input/>
                </div>
                <div className='input_field_long'>
                  <label>Address</label>
                  <input/>
                </div>
                <div className='input_field_long'>
                  <label>Mobile</label>
                  <input/>
                </div>
              </div>
            </fieldset>
          </div>
          <div className='table_div'>
            <div className="table_wrapper_hardware_purchase">
              <table border={3} cellSpacing={2} cellPadding={10}>
                <tr>
                  <th>Serial No.</th>
                  <th>Item Code</th>
                  <th>Description</th>
                  <th>Quantity</th>
                  <th>Unit</th>
                  <th>Price</th>
                  <th>Item Total</th>
                  <th>Discount</th>
                  <th>Total</th>
                </tr>
              </table>
            </div>
          </div>
        </div>
        <div className='second_row_div'>
          <div className='total_div'>
              <div className='input_field_short'>
                <label style={newWidth}>Total</label>
                <input style={newWidth}/>
              </div>
              <div className='input_field_short'>
                <label style={newWidth}>Additional Discount</label>
                <input style={newWidth}/>
              </div>
              <div className='input_field_short'>
                <label style={newWidth}>Carriage/Freight</label>
                <input style={newWidth}/>
              </div>
            <div className='bar_inside_total_div'></div>
          </div>
        </div>
    </div>
  )
}

export default hardware_salepage