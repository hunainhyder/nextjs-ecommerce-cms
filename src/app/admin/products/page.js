"use client";
import { useEffect, useState } from "react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading products...</p>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const data = Object.fromEntries(form.entries());

    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    setShowForm(false);
    e.target.reset();

    const res = await fetch("/api/products");
    const updated = await res.json();
    setProducts(updated);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">All Products</h2>
      <button
        onClick={() => setShowForm(true)}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        + Add Product
      </button>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 bg-white p-4 rounded shadow-md"
        >
          <input
            type="text"
            name="name"
            placeholder="Name"
            required
            className="border p-2 mr-2 rounded"
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            required
            className="border p-2 mr-2 rounded"
          />
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            className="border p-2 mr-2 rounded"
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
          >
            Save
          </button>
        </form>
      )}

      <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 text-left">ID</th>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Price</th>
            <th className="p-3 text-left">Stock</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b hover:bg-gray-50">
              <td className="p-3">{p.id}</td>
              <td className="p-3">{p.name}</td>
              <td className="p-3">${p.price}</td>
              <td className="p-3">{p.stock}</td>
              <td className="p-3">
                <button className="text-blue-600 hover:underline mr-3">
                  Edit
                </button>
                <button className="text-red-600 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
