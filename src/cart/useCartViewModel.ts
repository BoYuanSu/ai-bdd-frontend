import {
  transformToAddToCartPayload,
  transformToCartItemModel,
} from "./cartAdapter";
import { addToCart, fetchCart } from "./cartService";
import type { CartItemModel } from "./cartModels";

const useCartViewModel = async () => {
  const cartItems = await fetchCart();

  const cartItemsModel: CartItemModel[] = cartItems.map(
    transformToCartItemModel
  );

  const handleAddToCart = (item: string, qty: number) => {
    addToCart(transformToAddToCartPayload(item, qty));
  };
  return {
    cartItemsModel,
    handleAddToCart,
  };
};

export { useCartViewModel };

export type { CartItemModel };
