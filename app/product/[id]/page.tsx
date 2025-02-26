import { notFound } from "next/navigation";
import Image from "next/image";

// Remove the custom PageProps interface

async function getProduct(id: string) {
  const res = await fetch(`https://fakestoreapi.com/products/${id}`);

  if (!res.ok) {
    notFound();
  }

  return res.json();
}

// Use the Next.js generated types directly
export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  let product = null;

  try {
    product = await getProduct(params.id);
  } catch (error) {
    console.error("Failed to fetch product:", error);
    notFound();
  }

  if (!product) {
    return notFound();
  }

  return (
    <div className="flex justify-between md:justify-center md:items-center flex-col md:flex-row gap-8 p-10 lg:px-[200px]">
      <div className="md:w-1/2">
        <Image
          src={product?.image || "/placeholder.svg"}
          alt={product?.title || "Product Image"}
          width={400}
          height={200}
          className="w-full max-h-[80vh] object-contain bg-transparent backdrop-blur-md bg-gray-100"
        />
      </div>
      <div className="md:w-1/2">
        <h1 className="text-2xl font-bold mb-4">{product?.title}</h1>
        <p className="text-gray-600 mb-4">{product?.description}</p>
        <p className="text-xl font-semibold">${product?.price?.toFixed(2) || "N/A"}</p>
      </div>
    </div>
  );
}