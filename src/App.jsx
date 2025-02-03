import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import {
  addRestaurants,
  addFilteredRestaurants,
  setSelectedCity,
  setCities,
  setSelectedRes,
} from "./utils/restaurantSlice";
import { setAuthUser, setAddresses } from "./utils/userSlice";

import { setCartId, setItems } from "./utils/cartSlice";

const App = () => {
  const dispatch = useDispatch();
  const selectedCity = useSelector((state) => state.restaurants.selectedCity);
  const authUser = useSelector((state) => state.user.authUser);
  const itemsList = useSelector((state) => state.cart.items);
  const cart_id = useSelector((state) => state.cart.cart_id);

  const fetchCities = async () => {
    try {
      const response = await fetch(`/public/cities`);
      if (!response.ok)
        throw new Error(`Failed to fetch cities: ${response.statusText}`);
      const cities = await response.json();
      if (cities?.data?.length) {
        dispatch(setCities(cities.data));
        dispatch(setSelectedCity(cities.data[0]));
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await fetch(`/private/user/getuser`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!response.ok)
        throw new Error(`Failed to fetch user: ${response.statusText}`);
      const user = await response.json();
      dispatch(setAuthUser(user));
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const fetchCart = async () => {
    try {
      const response = await fetch(`/private/user/getcart`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!response.ok)
        throw new Error(`Failed to fetch user: ${response.statusText}`);
      const data = await response.json();
      dispatch(setCartId(data.cart_id));
      dispatch(setItems(data.items));
      dispatch(setSelectedRes(data.restaurantid));
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const fetchAddresses = async () => {
    if (!authUser) return;
    try {
      const response = await fetch(`/private/user/getaddresses`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!response.ok)
        throw new Error(`Failed to fetch addresses: ${response.statusText}`);
      const addresses = await response.json();
      dispatch(setAddresses(addresses));
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const fetchRestaurants = async () => {
    if (!selectedCity) return;
    try {
      const response = await fetch(`/public/restaurants?city=${selectedCity}`);
      if (!response.ok)
        throw new Error(`Failed to fetch restaurants: ${response.statusText}`);
      const restaurants = await response.json();
      dispatch(addRestaurants(restaurants?.data || []));
      dispatch(addFilteredRestaurants(restaurants?.data || []));
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    }
  };

  const syncCart = async () => {
    if (!itemsList.length) return;
    try {
      const response = await fetch(`/private/user/synccart/${cart_id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: itemsList }),
        credentials: "include",
      });
      if (!response.ok)
        throw new Error("Failed to sync cart with the database");
    } catch (error) {
      console.error("Error syncing cart:", error);
    }
  };

  useEffect(() => {
    fetchCities();
    fetchUser();
  }, []);

  useEffect(() => {
    fetchCart();
    fetchAddresses();
  }, [authUser]);

  useEffect(() => {
    fetchRestaurants();
  }, [selectedCity]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      syncCart();
    }, 60000);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [syncCart]); // Only run once on mount and cleanup on unmount

  return (
    <div className="pt-[250px] md:pt-[80px] select-none">
      <Header />
      <Outlet />
    </div>
  );
};

export default App;
