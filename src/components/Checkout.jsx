import React, { useEffect, useState } from "react";
import { load } from "@cashfreepayments/cashfree-js"; // Import the 'load' function

const Checkout = ({ closeModal, totalAmount, itemsList }) => {
  const [paymentStatus, setPaymentStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const createOrder = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/private/orders/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          items: itemsList,
          total_amount: totalAmount,
          currency: "INR",
        }),
      });

      if (!response.ok) throw new Error("Error creating order on backend.");

      const { paymentSessionId, orderID } = await response.json();
      setOrderId(orderID);
      console.log("Order created successfully");
      return paymentSessionId;
    } catch (error) {
      console.error("Error creating order:", error);
      setPaymentStatus("Failed to create an order. Please try again.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const initializeCheckout = async () => {
    setPaymentStatus("");
    const paymentSessionId = await createOrder();
    if (!paymentSessionId) {
      return;
    }

    // Initialize Cashfree with the mode you want (sandbox/production)
    const cashfree = load({ mode: "sandbox" }); // Using 'load' to initialize

    const checkoutOptions = {
      paymentSessionId,
      redirectTarget: "_modal", // Using the modal popup for payment
    };

    try {
      const result = await cashfree.checkout(checkoutOptions);
      if (result.error) {
        console.error("Payment error:", result.error);
        setPaymentStatus("Payment error. Please try again.");
      } else if (result.paymentDetails) {
        console.log("Payment completed:", result.paymentDetails);
        setPaymentStatus(
          result.paymentDetails.paymentMessage || "Payment successful!"
        );
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setPaymentStatus("An error occurred. Please try again.");
    }
  };

  useEffect(() => {
    // Check for the order_id in URL after payment
    const urlParams = new URLSearchParams(window.location.search);
    const orderIdFromURL = urlParams.get("order_id");
    if (orderIdFromURL) {
      confirmPayment(orderIdFromURL);
    }
  }, []);

  const confirmPayment = async (orderId) => {
    setLoading(true);
    try {
      const response = await fetch(`/private/orders/confirm/${orderId}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        setPaymentStatus("Failed to confirm payment. Please try again.");
        return;
      }

      const paymentData = await response.json();
      if (paymentData.order_status === "PAID") {
        setPaymentStatus("Payment Successful!");
      } else {
        setPaymentStatus("Payment Failed. Please try again.");
      }
    } catch (error) {
      console.error("Error confirming payment:", error);
      setPaymentStatus("Error confirming payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Checkout
        </h2>
        <p className="text-lg text-gray-600 mb-4 text-center">
          Total Amount: ₹{totalAmount}
        </p>
        <button
          onClick={initializeCheckout}
          disabled={loading}
          className={`w-full px-6 py-3 text-white rounded-lg ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
        {paymentStatus && (
          <p className="mt-4 text-lg font-semibold text-center text-gray-700">
            {paymentStatus}
          </p>
        )}
        <button
          onClick={closeModal}
          className="mt-4 text-blue-600 hover:text-blue-700 text-center block w-full"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Checkout;
