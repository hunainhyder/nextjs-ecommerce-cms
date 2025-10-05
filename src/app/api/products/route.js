import { prisma } from "@/lib/prisma";
import { writeFile } from "fs/promises";
import path from "path";

export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { id: "desc" },
  });
  return Response.json(products);
}

export async function POST(req) {
  const formData = await req.formData();

  const name = formData.get("name");
  const price = parseFloat(formData.get("price"));
  const stock = parseInt(formData.get("stock")) || 0;
  const description = formData.get("description") || "";

  let imageUrl = null;
  const file = formData.get("image");

  if (file && file.name) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${file.name}`;
    const filepath = path.join(process.cwd(), "public", "uploads", filename);
    await writeFile(filepath, buffer);
    imageUrl = `/uploads/${filename}`;
  }

  const newProduct = await prisma.product.create({
    data: { name, price, stock, description, image_url: imageUrl },
  });

  return Response.json(newProduct);
}
