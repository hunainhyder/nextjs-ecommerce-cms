import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const products = await prisma.product.findMany();
  return NextResponse.json(products);
}

export async function POST(req) {
  const body = await req.json();
  const { name, description, price, stock, image } = body;

  if (!name || !price) {
    return NextResponse.json(
      { error: "Name and price are required" },
      { status: 400 }
    );
  }

  const newProduct = await prisma.product.create({
    data: {
      name,
      description,
      price: parseFloat(price),
      stock: Number(stock) || 0,
      image,
    },
  });

  return NextResponse.json(newProduct, { status: 201 });
}
