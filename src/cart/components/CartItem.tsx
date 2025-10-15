interface CartItemProps {
  label: string;
}

const CartItem = (props: CartItemProps) => {
  return <div>{props.label}</div>;
};

export default CartItem;
