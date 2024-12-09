import React, { useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";

// Load Stripe outside of a component render
const stripePromise = loadStripe(
  "pk_test_51QTm8eLhrle3XiFe44jMtYzQRjlViuXt5bYxpz6Pt9jdsI2eWKjdSUcYmQwiX705y2WrIx29VN36xeNnPLi8yIu4001Ee1b2Xo"
);

const Payment = ({ closeModal, totalAmount, itemsList }) => {
  const fetchClientSecret = useCallback(() => {
    // Create a Checkout Session
    return fetch("private/payment/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: itemsList }),
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok)
          throw new Error(
            response.json().message || "Failed to save address"
          );
        return response.json();
      })
      .then((data) => data.clientSecret);
  }, [itemsList]);

  const options = { fetchClientSecret };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-lg overflow-auto max-h-[90vh]"
        style={{ margin: "auto" }}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Complete Your Payment</h2>
          <button
            className="text-gray-600 hover:text-gray-800"
            onClick={closeModal}
          >
            ✕
          </button>
        </div>
        <div className="p-4">
          <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      </div>
    </div>
  );
};

export default Payment;
