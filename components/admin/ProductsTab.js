// components/admin/ProductsTab.js
import { FaEdit, FaTrash, FaStar, FaPlus, FaImage } from "react-icons/fa";

export const ProductsTab = ({ products, onEdit, onDelete, onAddNew }) => (
  <div className="p-6">
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-2xl font-bold text-indigo-800">
        Products Management
      </h2>
      <button
        onClick={onAddNew}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition duration-200 flex items-center"
      >
        <FaPlus className="mr-2" /> Add New Product
      </button>
    </div>

    {products.length === 0 ? (
      <div className="text-center py-8">
        <p className="text-gray-600">
          No products found. Add your first product!
        </p>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white p-6 rounded-lg shadow-md transition duration-200 hover:shadow-lg"
          >
            <div className="aspect-w-1 aspect-h-1 mb-4 relative">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/placeholder.png";
                  }}
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 rounded flex items-center justify-center">
                  <FaImage className="text-gray-400 text-4xl" />
                </div>
              )}
            </div>

            <h3 className="text-xl font-bold text-indigo-800 mb-2">
              {product.name}
            </h3>
            <p className="text-gray-600 mb-2">{product.brand}</p>
            <p className="text-indigo-600 font-bold mb-2">
              ${parseFloat(product.price).toFixed(2)}
            </p>
            <p className="text-gray-700 mb-2 line-clamp-2">
              {product.description}
            </p>
            <div className="flex items-center mb-4">
              <FaStar className="text-yellow-400 mr-1" />
              <span>{parseFloat(product.rating).toFixed(1)} / 5.0</span>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => onEdit(product)}
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
                title="Edit product"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => onDelete(product.id)}
                className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition duration-200"
                title="Delete product"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);
