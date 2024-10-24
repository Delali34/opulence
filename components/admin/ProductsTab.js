import { FaEdit, FaTrash, FaStar, FaPlus } from "react-icons/fa";

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white p-6 rounded-lg shadow-md transition duration-200 hover:shadow-lg"
        >
          <div className="aspect-w-1 aspect-h-1 mb-4">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-48 object-cover rounded"
            />
          </div>
          <h3 className="text-xl font-bold text-indigo-800 mb-2">
            {product.name}
          </h3>
          <p className="text-gray-600 mb-2">{product.brand}</p>
          <p className="text-indigo-600 font-bold mb-2">${product.price}</p>
          <p className="text-gray-700 mb-2 line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center mb-4">
            <FaStar className="text-yellow-400 mr-1" />
            <span>{product.rating} / 5.0</span>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => onEdit(product)}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
            >
              <FaEdit />
            </button>
            <button
              onClick={() => onDelete(product.id)}
              className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition duration-200"
            >
              <FaTrash />
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);
