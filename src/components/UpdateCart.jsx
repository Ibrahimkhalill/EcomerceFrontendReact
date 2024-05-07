const updateUserOrder = async (variantId, action, count, authToken) => {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/update-item/", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Token ${authToken}`,
      },
      body: JSON.stringify({ variantId, action, count }),
    });
    const data = await response.json();
     
    return data.cartItems;
  } catch (e) {
    console.log(e);
  }
};


export default updateUserOrder;