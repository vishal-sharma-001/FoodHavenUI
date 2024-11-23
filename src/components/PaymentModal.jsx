import React from 'react';

const PaymentModal = ({ closeModal }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
                <h3 className="text-lg font-semibold mb-4 text-black">Select Payment Method</h3>
                <ul className="space-y-4">
                    <li>
                        <button className="w-full py-2 px-4 border rounded-lg hover:bg-gray-100 text-black">
                            Credit Card
                        </button>
                    </li>
                    <li>
                        <button className="w-full py-2 px-4 border rounded-lg hover:bg-gray-100 text-black">
                            Debit Card
                        </button>
                    </li>
                    <li>
                        <button className="w-full py-2 px-4 border rounded-lg hover:bg-gray-100 text-black">
                            UPI
                        </button>
                    </li>
                    <li>
                        <button className="w-full py-2 px-4 border rounded-lg hover:bg-gray-100 text-black">
                            Cash on Delivery
                        </button>
                    </li>
                </ul>
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={closeModal}
                        className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
