"use client";
import { useEffect, useState } from "react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [status, setStatus] = useState("idle");
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");

    const formData = new FormData(e.target);
    if (imageFile) formData.append("image", imageFile);

    const method = editingProduct ? "PUT" : "POST";
    const url = editingProduct
      ? `/api/products/${editingProduct.id}`
      : `/api/products`;

    try {
      await fetch(url, { method, body: formData });
      setStatus("success");
      await fetchProducts();
      setShowForm(false);
      setEditingProduct(null);
      setPreview(null);
      e.target.reset();
    } catch (err) {
      console.error(err);
      setStatus("error");
    } finally {
      setTimeout(() => setStatus("idle"), 1500);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    await fetchProducts();
  }

  if (loading) return <p>Loading products...</p>;

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
            className="border p-2 mr-2 rounded w-full mb-2"
          />

          <textarea
            name="description"
            placeholder="Description"
            defaultValue={editingProduct?.description || ""}
            className="border p-2 mr-2 rounded w-full mb-2"
          ></textarea>

          <input
            type="number"
            name="price"
            placeholder="Price"
            required
            defaultValue={editingProduct?.price || ""}
            className="border p-2 mr-2 rounded w-full mb-2"
          />

          <input
            type="number"
            name="stock"
            placeholder="Stock"
            defaultValue={editingProduct?.stock || ""}
            className="border p-2 mr-2 rounded w-full mb-2"
          />

          <div className="mb-3">
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="mb-2"
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded"
              />
            )}
          </div>

          <button
            type="submit"
            className={`${
              editingProduct ? "bg-blue-600" : "bg-green-600"
            } text-white px-3 py-2 rounded hover:opacity-90`}
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
              setPreview(null);
            }}
            className="ml-2 text-gray-600 hover:underline"
          >
            Cancel
          </button>

          {status === "success" && (
            <p className="text-green-600 mt-2">✅ Saved successfully!</p>
          )}
          {status === "error" && (
            <p className="text-red-600 mt-2">❌ Something went wrong!</p>
          )}
        </form>
      )}

      <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 text-left">ID</th>
            <th className="p-3 text-left">Image</th>
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
              <td className="p-3">
                {p.image_url && (
                  <img
                    src={p.image_url}
                    alt={p.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                )}
              </td>
              <td className="p-3">{p.name}</td>
              <td className="p-3">${p.price}</td>
              <td className="p-3">{p.stock}</td>
              <td className="p-3">
                <button
                  onClick={() => {
                    setEditingProduct(p);
                    setShowForm(true);
                    setPreview(p.image_url || null);
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
