import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { setItems } from "../utils/cartSlice";
import { useDispatch } from "react-redux";

const Return = () => {
  const [status, setStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get("session_id");

    fetch(`private/payment/session-status?session_id=${sessionId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setStatus(data.status);
        setCustomerEmail(data.customer_email);
      });
  }, []);

  if (status === "open") {
    return <Navigate to="/checkout" />;
  }

  if (status === "complete") {
    dispatch(setItems([]))

    return (
      <section
        id="success"
        className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6"
      >
        <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-lg text-center">
          <h2 className="text-3xl font-bold text-green-600 mb-4">
            Order Confirmed!
          </h2>
          <p className="text-lg text-gray-700 mb-4">
            We appreciate your business! A confirmation email has been sent to{" "}
            <strong>{customerEmail}</strong>.
          </p>
          <p className="text-lg text-gray-700 mb-4">
            If you have any questions, please email{" "}
            <a
              href="mailto:orders@example.com"
              className="text-blue-500 hover:underline"
            >
              support@example.com
            </a>.
          </p>
          <div className="mt-6">
            <a
              href="/"
              className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Return to Home
            </a>
          </div>
        </div>
      </section>
    );
  }

  return null;
};

export default Return;
