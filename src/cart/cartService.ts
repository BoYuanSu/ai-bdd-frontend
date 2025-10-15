type CartItemDTO = {
  id: string;
  name: string;
  priceCents: number;
  qty: number;
};

type AddToCartPayload = {
  id?: string;
  name: string;
  qty: number;
};

const fetchCart = () => {
  const res: Array<CartItemDTO> = [];
  return Promise.resolve(res);
};

const addToCart = (payload: AddToCartPayload) => {
  //

  return Promise.resolve();
};

const removeFromCart = () => {
  //
};

export { fetchCart, addToCart, removeFromCart };
export type { CartItemDTO, AddToCartPayload };
