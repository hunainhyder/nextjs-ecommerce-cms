export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">🛠 Admin Dashboard</h1>
        <nav className="space-x-4">
          <a href="/admin/products" className="text-blue-600 hover:underline">
            Products
          </a>
          <a href="#" className="text-gray-600 hover:underline">
            Orders
          </a>
        </nav>
      </header>

      <main className="p-6">{children}</main>
    </div>
  );
}
