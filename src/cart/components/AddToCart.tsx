interface AddToCartProps {
  onClick?: () => void;
}

const AddToCart = (props: AddToCartProps) => {
  const { onClick } = props;
  return <div onClick={onClick}>Add To Cart</div>;
};

export default AddToCart;
