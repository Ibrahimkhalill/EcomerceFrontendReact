// useUpdateUserOrder.js
import { useCart } from "./CartContext";

const useUpdateUserOrder = () => {
  const { setCartItems } = useCart();

  const updateUserOrder = async (variantId, action, count, authToken) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}/api/update-item/`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Authorization: `Token ${authToken}`,
          },
          body: JSON.stringify({ variantId, action, count }),
        }
      );
      const data = await response.json();
      if (data.cartItems) {
        setCartItems(data.cartItems);
      }
      return data.cartItems;
    } catch (e) {
      console.log(e);
    }
  };

  return updateUserOrder;
};

export default useUpdateUserOrder;
