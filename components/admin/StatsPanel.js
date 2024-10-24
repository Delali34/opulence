// components/admin/StatsPanel.js
export const StatsPanel = ({ productsCount, categoriesCount, isLoading }) => {
  if (isLoading) {
    return (
      <div className="fixed bottom-0 right-0 m-4 bg-white p-4 rounded-lg shadow-lg">
        <div className="flex space-x-6">
          <div>
            <p className="text-sm text-gray-500">Total Products</p>
            <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
          </div>
          <div>
            <p className="text-sm text-gray-500">Categories</p>
            <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 right-0 m-4 bg-white p-4 rounded-lg shadow-lg">
      <div className="flex space-x-6">
        <div>
          <p className="text-sm text-gray-500">Total Products</p>
          <p className="text-2xl font-bold text-indigo-600">
            {productsCount || 0}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Categories</p>
          <p className="text-2xl font-bold text-indigo-600">
            {categoriesCount || 0}
          </p>
        </div>
      </div>
    </div>
  );
};
