import { useDispatch, useSelector } from "react-redux";
import { FaMinus, FaPlus } from "react-icons/fa";
import { addItem, deleteItem, showClearCartModal } from "../utils/cartSlice";
import { setSelectedRes } from "../utils/restaurantSlice";
import { BUCKET_PATH } from "../utils/constants";
import { useEffect } from "react";

const ItemsList = ({ prop }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const dispatch = useDispatch();
  const cartItems = useSelector((store) => store.cart.items);
  const selectedRes = useSelector((store) => store.restaurants.selectedRes);
  const addToCart = () => {
    if (selectedRes != null && selectedRes !== prop.restaurantId) {
      dispatch(showClearCartModal(true));
      return;
    }
    dispatch(setSelectedRes(prop.restaurantId));

    const existingItem = cartItems.find((item) => item.id === prop?.id);

    if (existingItem) {
      dispatch(addItem({ ...existingItem, quantity: 1 }));
    } else {
      dispatch(
        addItem({
          id: prop.id,
          name: prop?.name,
          price: prop?.price,
          cloudimageid: prop?.cloudimageid,
          quantity: 1,
          restrauntId: prop.restaurantId,
        })
      );
    }
  };

  const decreaseQuantity = (itemId) => {
    dispatch(deleteItem(itemId));

    const updatedTotalItemCount = cartItems.reduce(
      (total, item) =>
        total + (item.id === itemId ? item.quantity - 1 : item.quantity),
      0
    );

    if (updatedTotalItemCount === 0) {
      dispatch(setSelectedRes(null));
    }
  };

  const cartItem = cartItems.find((item) => item.id === prop?.id);

  return (
    <>
      <div className="flex justify-between p-3">
        <div className="text-left p-1 max-w-xl">
          <p className="font-medium">{prop?.name}</p>
          <p className="font-medium">{prop?.price}</p>
          <p className="text-zinc-600 mt-10">{prop?.description}</p>
        </div>
        <div>
          <img
            className="rounded-md w-[150px] h-[150px]"
            src={BUCKET_PATH + prop?.cloudimageid + ".avif"}
            alt="Food Item"
          />
          <button className="bg-white text-green-900 rounded-xl border-2 w-24 h-10 relative bottom-6">
            {cartItem ? (
              <div className="p-2 flex justify-between text-green-900">
                <FaMinus
                  onClick={() => decreaseQuantity(prop?.id)}
                  className="pr-1"
                />
                <p>{cartItem?.quantity}</p>
                <FaPlus onClick={addToCart} />
              </div>
            ) : (
              <p onClick={addToCart}> ADD </p>
            )}
          </button>
          <p className="font-light text-xs relative bottom-5 text-gray-500">
            Customisable
          </p>
        </div>
      </div>
      <hr />
    </>
  );
};

export default ItemsList;
