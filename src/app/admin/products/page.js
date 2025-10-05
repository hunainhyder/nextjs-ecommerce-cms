"use client";
import { useEffect, useState } from "react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

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

    if (editingProduct) {
      // Update existing product
      await fetch(`/api/products/${editingProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else {
      // Create new product
      await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }

    const res = await fetch("/api/products");
    setProducts(await res.json());

    setShowForm(false);
    setEditingProduct(null);
    e.target.reset();
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    await fetch(`/api/products/${id}`, { method: "DELETE" });

    const res = await fetch("/api/products");
    setProducts(await res.json());
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">All Products</h2>
      <button
        onClick={() => {
          setEditingProduct(null);
          setShowForm(true);
        }}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        + Add Product
      </button>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 bg-white p-4 rounded shadow-md border"
        >
          <h3 className="text-lg font-semibold mb-3">
            {editingProduct ? "Edit Product" : "Add Product"}
          </h3>

          <input
            type="text"
            name="name"
            placeholder="Name"
            required
            defaultValue={editingProduct?.name || ""}
            className="border p-2 mr-2 rounded"
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            required
            defaultValue={editingProduct?.price || ""}
            className="border p-2 mr-2 rounded"
          />
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            defaultValue={editingProduct?.stock || ""}
            className="border p-2 mr-2 rounded"
          />

          <button
            type="submit"
            className={`${
              editingProduct ? "bg-blue-600" : "bg-green-600"
            } text-white px-3 py-2 rounded hover:opacity-90`}
          >
            {editingProduct ? "Update" : "Save"}
          </button>

          <button
            type="button"
            onClick={() => {
              setShowForm(false);
              setEditingProduct(null);
            }}
            className="ml-2 text-gray-600 hover:underline"
          >
            Cancel
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
                <button
                  onClick={() => {
                    setEditingProduct(p);
                    setShowForm(true);
                  }}
                  className="text-blue-600 hover:underline mr-3"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
