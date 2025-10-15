import type { AddToCartPayload, CartItemDTO } from "./cartService";
import type { CartItemModel } from "./cartModels";

const transformToCartItemModel = (item: CartItemDTO): CartItemModel => {
  return {
    id: item.id,
    label: item.name,
    price: item.priceCents / 100,
    quantity: item.qty,
  };
};

const transformToAddToCartPayload = (
  item: string,
  qty: number
): AddToCartPayload => {
  return {
    name: item,
    qty,
  };
};

export { transformToCartItemModel, transformToAddToCartPayload };
