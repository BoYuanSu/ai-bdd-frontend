import {
  transformToAddToCartPayload,
  transformToCartItemModel,
} from "./cartAdapter";
import { addToCart, fetchCart } from "./cartService";
import type { CartItemModel } from "./cartModels";
import type { AddToCartPayload, CartItemDTO } from "./cartService";

type CartServices = {
  fetchCart: () => Promise<CartItemDTO[]>;
  addToCart: (payload: AddToCartPayload) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
};

const useCartViewModel = async (services: Partial<CartServices> = {}) => {
  const svc: CartServices = {
    fetchCart,
    addToCart,
    // provide a no-op default to keep backward compatibility until implemented
    removeFromCart: services.removeFromCart ?? (async () => {}),
    ...services,
  } as CartServices;

  const cartItems = await svc.fetchCart();

  const cartItemsModel: CartItemModel[] = cartItems.map(
    transformToCartItemModel
  );

  const handleAddToCart = (item: string, qty: number) => {
    return svc.addToCart(transformToAddToCartPayload(item, qty));
  };
  const handleRemoveFromCart = (id: string) => {
    return svc.removeFromCart(id);
  };
  return {
    cartItemsModel,
    handleAddToCart,
    handleRemoveFromCart,
  };
};

export { useCartViewModel };

export type { CartItemModel };
