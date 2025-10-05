import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req, { params }) {
  const { id } = params;
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
  });
  if (!product)
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(req, { params }) {
  const { id } = params;
  const body = await req.json();

  const updated = await prisma.product.update({
    where: { id: Number(id) },
    data: body,
  });

  return NextResponse.json(updated);
}

export async function DELETE(req, { params }) {
  const { id } = params;
  await prisma.product.delete({ where: { id: Number(id) } });
  return NextResponse.json({ message: "Product deleted successfully" });
}
