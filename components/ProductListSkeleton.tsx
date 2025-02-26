

const ProductListSkeleton = () => {
  return (
    <div className="px-5 md:px-10 lg:px-40">
      <div className="mb-6 flex space-x-4">
        <div className="w-20 h-8 bg-gray-300 rounded animate-pulse"></div>
        <div className="w-24 h-8 bg-gray-300 rounded animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, index) => (
          <div
            key={index}
            className="border p-4 rounded-lg animate-pulse bg-gray-200 shadow-sm"
          >
            <div className="bg-gray-400 h-48 w-full rounded-lg mb-4"></div>
            <div className="bg-gray-300 h-6 w-3/4 rounded mb-2"></div>
            <div className="bg-gray-300 h-5 w-1/2 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductListSkeleton;
