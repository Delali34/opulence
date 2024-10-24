// components/admin/CategoriesTab.js
import { useState } from "react";
import { FaEdit, FaTrash, FaPlus, FaSpinner } from "react-icons/fa";
import Image from "next/image";

export const CategoriesTab = ({
  categories,
  products,
  onEdit,
  onDelete,
  onAddNew,
}) => {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (categoryId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this category? This action cannot be undone."
      )
    ) {
      return;
    }

    setDeletingId(categoryId);
    try {
      await onDelete(categoryId);
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-indigo-800">
          Categories Management
        </h2>
        <button
          onClick={onAddNew}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition duration-200 flex items-center"
        >
          <FaPlus className="mr-2" /> Add New Category
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white p-6 rounded-lg shadow-md transition duration-200 hover:shadow-lg"
          >
            <div className="relative w-full h-48 mb-4">
              {category.image_url ? (
                <img
                  src={category.image_url}
                  alt={category.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}
            </div>

            <h3 className="text-xl font-bold text-indigo-800 mb-2">
              {category.name}
            </h3>
            <p className="text-gray-600 mb-2">{category.description}</p>
            <p className="text-gray-500 mb-2">Slug: {category.slug}</p>
            <div className="mt-4 p-2 bg-gray-50 rounded">
              <p className="text-sm font-medium text-gray-600">
                Products in category:
              </p>
              <p className="text-2xl font-bold text-indigo-600">
                {products.filter((p) => p.category_id === category.id).length}
              </p>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => onEdit(category)}
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
                title="Edit Category"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDelete(category.id)}
                disabled={deletingId === category.id}
                className={`text-white p-2 rounded transition duration-200 ${
                  deletingId === category.id
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-500 hover:bg-red-600"
                }`}
                title="Delete Category"
              >
                {deletingId === category.id ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <FaTrash />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
