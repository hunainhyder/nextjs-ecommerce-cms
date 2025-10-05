import { prisma } from "@/lib/prisma";
import { writeFile } from "fs/promises";
import path from "path";

export async function PUT(req, { params }) {
  const { id } = await params;
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

  const updated = await prisma.product.update({
    where: { id: Number(id) },
    data: {
      name,
      price,
      stock,
      description,
      ...(imageUrl && { image_url: imageUrl }),
    },
  });

  return Response.json(updated);
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  await prisma.product.delete({ where: { id: Number(id) } });
  return Response.json({ success: true });
}
