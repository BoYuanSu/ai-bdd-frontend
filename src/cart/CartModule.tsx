import AddToCart from "./components/AddToCart";
import CartItem from "./components/CartItem";
import { useCartViewModel } from "./useCartViewModel";

const CartModule = async () => {
  const { cartItemsModel, handleAddToCart } = await useCartViewModel();
  return (
    <div>
      {cartItemsModel?.map((item) => (
        <CartItem key={item.id} label={item.label} />
      ))}
      <AddToCart
        onClick={() => {
          handleAddToCart("New Item", 1);
        }}
      />
    </div>
  );
};

export default CartModule;
