import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addItem, deleteItem, showClearCartModal } from "../utils/cartSlice";
import { addAddress, editAddress, selectAddress } from "../utils/userSlice";
import { setSelectedRes } from "../utils/restaurantSlice";
import { FaPlus, FaMinus } from "react-icons/fa";
import { BUCKET_PATH } from "../utils/constants";
import Payment from "./Payment";
import Signup from "./Signup";
const Cart = () => {
  const authUser = useSelector((store) => store.user.authUser);
  const itemsList = useSelector((store) => store.cart.items);
  const addresses = useSelector((store) => store.user.addresses);
  const selectedAddress = useSelector((store) => store.user.selectedAddress);
  const selectedRes = useSelector((store) => store.restaurants.selectedRes);
  const dispatch = useDispatch();

  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newAddress, setNewAddress] = useState({
    id: "",
    name: "",
    street: "",
    city: "",
    postalCode: "",
    phone: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const totalAmount = itemsList.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleSaveAddress = async () => {
    const requiredFields = ["name", "street", "city", "postalCode", "phone"];
    const errors = requiredFields.reduce((acc, field) => {
      if (!newAddress[field]?.trim()) {
        acc[field] = `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } is required.`;
      }
      return acc;
    }, {});

    if (Object.keys(errors).length > 0) return setFormErrors(errors);

    try {
      const isEdit = !!newAddress.id;
      const url = `/private/user/${
        isEdit ? `editaddress/${newAddress.id}` : "addaddress"
      }`;
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newAddress.name,
          street: newAddress.street,
          city: newAddress.city,
          postalCode: newAddress.postalCode,
          phone: newAddress.phone,
          is_primary: newAddress.isPrimary || false,
        }),
        credentials: "include",
      });

      if (!response.ok)
        throw new Error(
          (await response.json()).message || "Failed to save address"
        );

      const data = await response.json();

      if (isEdit) {
        dispatch(
          editAddress({
            id: data.id,
            updatedAddress: data,
          })
        );
      } else {
        dispatch(addAddress(data));
      }

      setNewAddress({
        id: "",
        user_id: "",
        name: "",
        street: "",
        city: "",
        postalCode: "",
        phone: "",
        isPrimary: false,
      });
      setFormErrors({});
      setIsAddingAddress(false);
      setIsEditing(false);
    } catch (error) {
      console.error(
        `Error while ${newAddress.id ? "editing" : "adding"} address:`,
        error.message
      );
    }
  };

  const handleEditAddress = (address) => {
    setIsAddingAddress(true);
    setIsEditing(true);
    setNewAddress(address);
  };
  const handleChooseAddress = (address) => {
    dispatch(selectAddress(address));
  };

  const addToCart = (prop) => {
    if (selectedRes != null && selectedRes !== prop.restaurantId) {
      dispatch(showClearCartModal(true));
    }
    dispatch(setSelectedRes(prop.restaurantId));

    const existingItem = itemsList.find((item) => item.id === prop?.id);

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

    const updatedTotalItemCount = itemsList.reduce(
      (total, item) =>
        total + (item.id === itemId ? item.quantity - 1 : item.quantity),
      0
    );

    if (updatedTotalItemCount === 0) {
      dispatch(setSelectedRes(null));
    }
  };

  const handleProceedToPayment = () => {
    setIsPaymentModalOpen(true);
  };

  if (itemsList.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen w-screen bg-white">
        <p className="text-gray-500 text-lg relative bottom-32">
          Your cart is empty
        </p>
      </div>
    );
  }
  return (
    <div className="flex justify-center items-start p-6 bg-white flex-wrap-reverse lg:flex-wrap gap-3">
      <div className="w-full sm:w-2/3 lg:w-1/2 bg-white p-6 rounded-lg shadow-lg">
        {!authUser ? (
          <div className="flex flex-col justify-start w-full">
            <p className="text-gray-700 mb-4 text-base">
              Please login or signup to proceed.
            </p>
            <button
              className="bg-black text-white py-2 px-3 rounded hover:bg-gray-800 w-40"
              onClick={() => setIsSignupOpen(true)}
            >
              Login/Signup
            </button>
            {isSignupOpen && (
              <Signup
                isOpen={isSignupOpen}
                onClose={() => setIsSignupOpen(false)}
              />
            )}
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-black">
              Choose a Delivery Address
            </h2>
            {addresses?.length > 0 ? (
              <div>
                {addresses?.map((address) => (
                  <div
                    key={address.id}
                    className={`mb-4 p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-100 transition ${
                      selectedAddress?.id === address.id
                        ? "border-2 border-black"
                        : ""
                    }`}
                    onClick={() => handleChooseAddress(address)}
                  >
                    <h3 className="font-medium text-lg text-black">
                      {address.name}
                    </h3>
                    <p className="text-sm text-gray-700">
                      {address.street}, {address.city}
                    </p>
                    <p className="text-sm text-gray-700">
                      {address.postalCode}
                    </p>
                    <p className="text-sm text-gray-700">{address.phone}</p>
                    <button
                      className="bg-black text-white py-1 px-4 rounded mt-3 hover:bg-gray-800"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditAddress(address);
                      }}
                    >
                      Edit Address
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                No addresses available. Please add a new address.
              </p>
            )}
            {selectedAddress ? (
              <button
                className="bg-gray-700 text-white py-2 px-6 rounded mt-6 w-full hover:bg-gray-600"
                onClick={() => dispatch(selectAddress(null))}
              >
                Change Address
              </button>
            ) : (
              !isAddingAddress && (
                <button
                  className="bg-black text-white py-2 px-6 rounded mt-6 hover:bg-gray-800 w-48"
                  onClick={() => setIsAddingAddress(true)}
                >
                  Add New Address
                </button>
              )
            )}

            {addresses?.length > 0 && selectedAddress && (
              <button
                className="bg-black text-white p-3 rounded mt-6 w-full hover:bg-gray-800"
                onClick={handleProceedToPayment}
              >
                Proceed to Payment
              </button>
            )}
          </div>
        )}
      </div>

      <div className="w-full sm:w-2/3 lg:w-1/3 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-black">Order Summary</h2>
        {itemsList.map((item) => (
          <div key={item.id} className="flex justify-between mb-6 flex-wrap">
            <div className="flex flex-wrap">
              <img
                src={BUCKET_PATH + item.cloudimageid + ".avif"}
                alt={item.name}
                className="w-16 h-16 object-cover mr-4"
              />
              <div>
                <h3 className="font-medium text-black">{item.name}</h3>
                <p className="text-sm text-gray-700">Price: ₹{item.price}</p>
                <p className="text-sm text-gray-700">
                  Quantity: {item.quantity}
                </p>
              </div>
            </div>
            <div className="p-2 flex justify-between text-green-900">
              <button className="bg-white text-green-900 rounded-xl border-2 w-24 h-10 relative">
                <div className="p-2 flex justify-between text-green-900">
                  <FaMinus
                    onClick={() => decreaseQuantity(item?.id)}
                    className="pr-1 cursor-pointer hover:text-green-800"
                  />
                  <span className="font-medium text-black">
                    {item.quantity}
                  </span>
                  <FaPlus
                    onClick={() => addToCart(item)}
                    className="pl-1 cursor-pointer hover:text-green-800"
                  />
                </div>
              </button>
            </div>
          </div>
        ))}
        <div className="border-t border-gray-300 mt-4 pt-4">
          <p className="text-lg font-semibold text-black">
            Total Amount: ₹{totalAmount}
          </p>
        </div>
      </div>

      {isAddingAddress && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg min-w-[300px]">
            <h3 className="text-lg font-semibold mb-4 text-black">
              {isEditing ? "Edit Address" : "Add New Address"}
            </h3>
            {["name", "street", "city", "postalCode", "phone"].map((field) => (
              <div key={field} className="mb-4">
                <label
                  className="block text-sm font-medium mb-1 text-black"
                  htmlFor={field}
                >
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type="text"
                  id={field}
                  value={newAddress[field]}
                  onChange={(e) =>
                    setNewAddress((prev) => ({
                      ...prev,
                      [field]: e.target.value,
                    }))
                  }
                  className={`border p-2 rounded w-full text-black ${
                    formErrors[field] ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors[field] && (
                  <p className="text-red-500 text-sm">{formErrors[field]}</p>
                )}
              </div>
            ))}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setIsAddingAddress(false);
                  setIsEditing(false);
                  setNewAddress({
                    id: "",
                    name: "",
                    street: "",
                    city: "",
                    postalCode: "",
                    phone: "",
                  });
                }}
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAddress}
                className="bg-black text-white py-2 px-4 rounded ml-2 hover:bg-gray-800"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {isPaymentModalOpen && (
        <Payment
          closeModal={() => setIsPaymentModalOpen(false)}
          totalAmount={totalAmount}
          itemsList={itemsList}
        />
      )}
    </div>
  );
};

export default Cart;
