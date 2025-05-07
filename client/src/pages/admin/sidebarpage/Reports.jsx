import React, { useState } from "react";
import { useBill } from "@/hooks/useTables.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTables } from "@/hooks/useBill";

const Reports = () => {
  const { tables, loading, createTable, releaseTable } = useTables();
  const { billData, showModal, fetchBill, setShowModal } = useBill();
  const [newTableNumber, setNewTableNumber] = useState("");

  const handlePrint = () => window.print();

  const handleCreateTable = () => {
    if (!newTableNumber || isNaN(newTableNumber)) {
      toast.warning("Please enter a valid table number");
      return;
    }
    createTable(Number(newTableNumber));
    setNewTableNumber("");
  };
  

  return (
    <div className="p-6">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4">Table Manager</h2>

      {/* Create Table UI */}
      <div className="mb-6 flex flex-col sm:flex-row items-center gap-3">
        <input
          type="number"
          inputMode="numeric"
          min="1"
          placeholder="Enter Table Number"
          value={newTableNumber}
          onChange={(e) => setNewTableNumber(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full sm:w-64"
        />
        <button
          onClick={handleCreateTable}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Table"}
        </button>
      </div>

      {/* Table List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {(tables || []).map((table) => (
          <div
            key={table?._id}
            className={`p-4 rounded-xl shadow-md border ${
              table?.isBooked ? "bg-red-100 border-red-400" : "bg-green-100 border-green-400"
            }`}
          >
            <h3 className="text-xl font-semibold mb-2">
              Table {String(table?.tableNumber)}
            </h3>

            {/* QR Image */}
            {table?.qrImage?.url && (
              <img
                src={table.qrImage.url}
                alt={`QR for Table ${table.tableNumber}`}
                className="w-24 h-24 object-contain mb-2 border"
              />
            )}

            <p className="mb-1">
              Status:{" "}
              <span className={table?.isBooked ? "text-red-600" : "text-green-600"}>
                {table?.isBooked ? "Booked" : "Available"}
              </span>
            </p>

            {table?.isBooked && (
              <>
                <p className="mb-2 text-sm text-gray-600">
                  Order ID: {String(table?.currentOrderId || "N/A")}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => fetchBill(table?.tableNumber)}
                    className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
                  >
                    Print Bill
                  </button>
                  <button
                    onClick={() => releaseTable(table?.tableNumber)}
                    disabled={loading}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    Release
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Bill Modal */}
      {showModal && billData && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg print:w-full print:max-w-none print:shadow-none print:bg-white">
            <h3 className="text-xl font-bold mb-4">
              Bill - Table {String(billData?.tableNumber ?? "N/A")}
            </h3>
            <p className="mb-2">
              Customer: {typeof billData?.customerName === "string"
                ? billData.customerName
                : billData?.customerName?.name || "N/A"}
            </p>
            <table className="w-full mb-4">
              <thead>
                <tr className="border-b">
                  <th className="text-left">Item</th>
                  <th>Qty</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {(billData?.items || []).map((item, idx) => (
                  <tr key={idx} className="border-b">
                    <td>{String(item?.name)}</td>
                    <td className="text-center">{String(item?.quantity)}</td>
                    <td className="text-right">Rs. {String(item?.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-right font-semibold mb-4">
              Total: Rs. {billData?.total?.toFixed(2)}
            </p>
            <div className="flex justify-end gap-2 print:hidden">
              <button
                onClick={handlePrint}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Print
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
