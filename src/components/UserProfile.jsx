import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addAddress,
  editAddress,
  deleteAddress,
  setAuthUser,
} from "../utils/userSlice";
import { FaEdit, FaTrash } from "react-icons/fa";
import { BUCKET_PATH } from "../utils/constants";

import Signup from "./Signup";

const UserProfile = () => {
  const [orders, setOrders] = useState();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const authUser = useSelector((store) => store.user.authUser);
  const addresses = useSelector((store) => store.user.addresses);
  const dispatch = useDispatch();

  const [isEditingUser, setIsEditingUser] = useState(false);
  const [editedUserDetails, setEditedUserDetails] = useState({
    name: authUser?.name || "",
    phone: authUser?.phone || "",
    email: authUser?.email || "",
  });
  const [userFormErrors, setUserFormErrors] = useState({});

  const handleEditUserDetails = () => {
    setIsEditingUser(true);
    setEditedUserDetails({
      name: authUser?.name || "",
      phone: authUser?.phone || "",
      email: authUser?.email || "",
    });
  };

  const handleSaveUserDetails = async () => {
    const requiredFields = ["name", "phone", "email"];
    const errors = requiredFields.reduce((acc, field) => {
      if (!editedUserDetails[field]?.trim()) {
        acc[field] = `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } is required.`;
      }
      return acc;
    }, {});

    if (Object.keys(errors).length > 0) return setUserFormErrors(errors);

    try {
      const response = await fetch(`/private/user/edit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedUserDetails),
        credentials: "include",
      });

      if (!response.ok)
        throw new Error(
          (await response.json()).message || "Failed to update user details"
        );

      const updatedUser = await response.json();

      dispatch(setAuthUser(updatedUser));

      setIsEditingUser(false);
      setUserFormErrors({});
    } catch (error) {
      console.error("Error updating user details:", error.message);
    }
  };

  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newAddress, setNewAddress] = useState({
    id: "",
    name: "",
    street: "",
    city: "",
    postalCode: "",
    phone: "",
    isPrimary: false,
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("addresses");

  const handleSaveAddress = async () => {
    const requiredFields = ["name", "street", "city", "postalCode", "phone"];
    const errors = requiredFields.reduce((acc, field) => {
      if (!newAddress[field]?.trim()) {
        acc[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`;
      }
      return acc;
    }, {});
  
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
  
    try {
      const isEdit = !!newAddress.id;
      const url = `/private/user/${isEdit ? `editaddress/${newAddress.id}` : "addaddress"}`;
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
  
      const data = await response.json(); // Always parse JSON before checking `response.ok`
      
      if (!response.ok) {
        throw new Error(data?.message || "Failed to save address");
      }
  
      if (data && typeof data === "object") {
        if (isEdit) {
          dispatch(editAddress({ id: data.id, updatedAddress: data }));
        } else {
          dispatch(addAddress(data));
        }
      } else {
        throw new Error("Invalid response format from server");
      }
  
      // Reset state after successful save
      setNewAddress({
        id: "",
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
      console.error(`Error while ${newAddress.id ? "editing" : "adding"} address:`, error.message);
    }
  };

  const handleEditAddress = (address) => {
    setIsAddingAddress(true);
    setIsEditing(true);
    setNewAddress(address);
  };

  const handleDeleteAddress = async (id) => {
    try {
      const response = await fetch(`/private/user/deleteaddress/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to delete address");

      dispatch(deleteAddress(id));
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`/private/user/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Logout failed:", error.message);
        return;
      }
      dispatch(setAuthUser(null));
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(`/private/user/fetchorders`);
      if (!response.ok)
        throw new Error(`Failed to fetch cities: ${response.statusText}`);
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  return (
    <div className="w-screen h-auto min-h-screen py-6 px-10 md:px-40 bg-white shadow-md text-black">
      {!authUser ? (
        <div className="flex flex-col items-center relative top-[30%]">
          <p className="text-gray-600 mb-4">
            Please login or signup to manage your profile.
          </p>
          <button
            className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
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
        <div className="flex flex-col md:flex-wrap gap-4">
          <div>
            <p className="mb-2 text-4xl font-bold">{authUser?.name}</p>
            <div className="flex justify-between flex-wrap gap-2">
              <div className="flex font-medium">
                <p>{authUser?.phone}</p>
                <p className="mx-2">.</p>
                <p>{authUser?.email}</p>
              </div>
              <div>
                <button
                  className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800 mr-20"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
          <div className="flex md:w-5/6 gap-5 rounded-md">
            <div className="md:w-1/4 bg-white p-4 rounded-lg shadow-md border-2">
              <h2 className="text-lg font-semibold mb-4">Options</h2>
              <ul className="space-y-4">
                <li>
                  <button
                    className={`w-full p-2 text-left rounded-lg ${
                      activeTab === "addresses"
                        ? "bg-black text-white"
                        : "text-black bg-gray-200"
                    }`}
                    onClick={() => setActiveTab("addresses")}
                  >
                    Addresses
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full p-2 text-left rounded-lg ${
                      activeTab === "myaccount"
                        ? "bg-black text-white"
                        : "text-black bg-gray-200"
                    }`}
                    onClick={() => {
                      setActiveTab("myaccount");
                    }}
                  >
                    My Account
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full p-2 text-left rounded-lg ${
                      activeTab === "orders"
                        ? "bg-black text-white"
                        : "text-black bg-gray-200"
                    }`}
                    onClick={() => {
                      setActiveTab("orders");
                      fetchOrders();
                    }}
                  >
                    Orders
                  </button>
                </li>
              </ul>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-md border-2 w-auto min-w-96">
              {activeTab === "addresses" && (
                <>
                  <h2 className="text-xl font-bold mb-4">Your Addresses</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden">
                    {addresses?.map((address) => (
                      <div
                        key={address.id}
                        className="w-full max-w-2xl h-56 p-6 bg-white rounded-lg shadow-md transform mb-4 overflow-hidden min-w-32"
                      >
                        <h3 className="font-medium text-black mb-2">
                          {address.name}
                        </h3>
                        <p className="text-sm text-gray-700">
                          {address.street}, {address.city}
                        </p>
                        <p className="text-sm text-gray-700">
                          {address.postalCode}
                        </p>
                        <p className="text-sm text-gray-700">{address.phone}</p>

                        <div className="flex space-x-4 mt-4 absolute bottom-4 left-4 right-4 justify-between">
                          <button
                            className="text-black hover:text-blue-500"
                            onClick={() => handleEditAddress(address)}
                          >
                            <FaEdit /> Edit
                          </button>
                          <button
                            className="text-black hover:text-red-500"
                            onClick={() => handleDeleteAddress(address.id)}
                          >
                            <FaTrash /> Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    className="bg-black text-white p-2 rounded mt-4 w-40"
                    onClick={() => setIsAddingAddress(true)}
                  >
                    Add New Address
                  </button>
                </>
              )}
              {activeTab === "myaccount" && (
                <div className="text-black">
                  <h2 className="text-xl font-bold mb-4">Account Details</h2>
                  <div className="mb-4">
                    <p>
                      <strong>Name:</strong> {authUser?.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {authUser?.email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {authUser?.phone}
                    </p>
                  </div>
                  <button
                    className="bg-black text-white p-2 rounded hover:bg-gray-800"
                    onClick={handleEditUserDetails}
                  >
                    Edit
                  </button>
                </div>
              )}
              {activeTab === "orders" && (
                <div className="text-black">
                  <h2 className="text-xl font-bold mb-4">Your Orders</h2>

                  <div className="mb-4 space-y-4">
                    {orders && orders.length > 0 ? (
                      orders.map((order) => {
                        const isCompleted = order.status === "completed";
                        const orderStatus = isCompleted
                          ? "Completed"
                          : "Failed";

                        return (
                          <div
                            key={order.order_id}
                            className="border border-gray-300 p-4 rounded-md shadow-sm flex flex-col lg:flex-row flex-wrap justify-between"
                          >
                            <div className="flex">
                              <img
                                src={
                                  BUCKET_PATH +
                                  order.items[0]?.cloudimageid +
                                  ".avif"
                                }
                                alt={order.items[0]?.name}
                                className="w-20 h-20 rounded-md object-cover mr-4"
                              />
                              <div>
                                <h3 className="text-lg font-semibold">
                                  {
                                    order.items[0]?.cloudimageid &&
                                      order.items[0].cloudimageid
                                        .replace(/[_\s]/g, " ") // Replace underscores with spaces
                                        .replace(/([a-z])([A-Z])/g, "$1 $2") // Add space before capital letters
                                        .replace(/\b\w/g, (char) =>
                                          char.toUpperCase()
                                        ) // Capitalize each word
                                  }
                                </h3>
                                <ul className="text-sm text-gray-500 mt-2">
                                  {order.items.map((item, index) => (
                                    <li key={index}>
                                      {item.quantity} x {item.name}
                                    </li>
                                  ))}
                                </ul>
                                <p className="text-sm text-gray-500 mt-2">
                                  Order Id: #{order.payment_id?.slice(-10)} |
                                  {" Order Time: "}
                                  {new Date(
                                    order.created_at
                                  ).toLocaleDateString()}{" "}
                                  {new Date(
                                    order.created_at
                                  ).toLocaleTimeString()}
                                </p>
                                <p
                                  className={`text-sm font-semibold ${
                                    isCompleted
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  Status: {orderStatus}
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-col md:items-end mt-4 md:mt-0">
                              <p className="text-gray-500 text-sm mb-2">
                                Total Paid: ₹{order.total_amount}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-gray-500">You have no orders yet.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          {isAddingAddress && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 p-4">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
                <h3 className="text-lg font-semibold mb-4 text-black">
                  {isEditing ? "Edit Address" : "Add New Address"}
                </h3>
                {["name", "street", "city", "postalCode", "phone"].map(
                  (field) => (
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
                          formErrors[field]
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {formErrors[field] && (
                        <p className="text-red-500 text-sm">
                          {formErrors[field]}
                        </p>
                      )}
                    </div>
                  )
                )}
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
          {isEditingUser && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 p-4">
              <div className="bg-white p-6 rounded-lg shadow-lg min-w-60">
                <h3 className="text-lg font-semibold mb-4 text-black">
                  Edit User Details
                </h3>
                {["name", "phone", "email"].map((field) => (
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
                      value={editedUserDetails[field]}
                      onChange={(e) =>
                        setEditedUserDetails((prev) => ({
                          ...prev,
                          [field]: e.target.value,
                        }))
                      }
                      className={`border p-2 rounded w-full text-black ${
                        userFormErrors[field]
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {userFormErrors[field] && (
                      <p className="text-red-500 text-sm">
                        {userFormErrors[field]}
                      </p>
                    )}
                  </div>
                ))}
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setIsEditingUser(false)}
                    className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveUserDetails}
                    className="bg-black text-white py-2 px-4 rounded ml-2 hover:bg-gray-800"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserProfile;
