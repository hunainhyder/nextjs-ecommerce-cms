import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "E-commerce CMS",
  description: "Manage products easily with Next.js CMS",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
