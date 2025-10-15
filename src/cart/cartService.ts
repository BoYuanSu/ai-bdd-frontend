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

const addToCart = (_payload: AddToCartPayload) => {
  //

  return Promise.resolve();
};

const removeFromCart = (_id: string) => {
  //
  return Promise.resolve();
};

export { fetchCart, addToCart, removeFromCart };
export type { CartItemDTO, AddToCartPayload };
