"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    const form = new FormData(e.target);
    const data = Object.fromEntries(form.entries());
    data.price = parseFloat(data.price);
    data.stock = parseInt(data.stock || "0", 10);

    try {
      const res = await fetch(
        editingProduct ? `/api/products/${editingProduct.id}` : "/api/products",
        {
          method: editingProduct ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (!res.ok) throw new Error("Request failed");

      toast.success(
        editingProduct
          ? "✅ Product updated successfully!"
          : "🎉 Product added successfully!"
      );

      await fetchProducts();
      e.target.reset();
      setShowForm(false);
      setEditingProduct(null);
    } catch (err) {
      console.error(err);
      toast.error("❌ Something went wrong while saving");
    } finally {
      setStatus("idle");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      await fetchProducts();
      toast.success("🗑️ Product deleted");
    } catch {
      toast.error("Failed to delete product");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading products...</p>;

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

          <div className="flex flex-wrap gap-2 mb-3">
            <input
              type="text"
              name="name"
              placeholder="Name"
              required
              defaultValue={editingProduct?.name || ""}
              className="border p-2 rounded w-full sm:w-auto flex-1"
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              required
              defaultValue={editingProduct?.price || ""}
              className="border p-2 rounded w-full sm:w-auto flex-1"
            />
            <input
              type="number"
              name="stock"
              placeholder="Stock"
              defaultValue={editingProduct?.stock || ""}
              className="border p-2 rounded w-full sm:w-auto flex-1"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={status === "loading"}
              className={`${
                editingProduct ? "bg-blue-600" : "bg-green-600"
              } text-white px-4 py-2 rounded hover:opacity-90 disabled:opacity-50`}
            >
              {status === "loading"
                ? "Saving..."
                : editingProduct
                ? "Update"
                : "Save"}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingProduct(null);
              }}
              className="text-gray-600 hover:underline"
            >
              Cancel
            </button>
          </div>
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
