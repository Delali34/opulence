import { useState } from "react";
import { FaSpinner } from "react-icons/fa";

export const ProductModal = ({
  isOpen,
  onClose,
  currentProduct,
  handleInputChange,
  handleSubmit,
  handleImageChange,
  categories,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  if (!isOpen) return null;

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await handleSubmit(e);
      onClose();
    } catch (error) {
      setError("Failed to save product. Please try again.");
      console.error("Product submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setImage(file);
        // Create preview URL
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">
          {currentProduct.id ? "Edit Product" : "Add New Product"}
        </h2>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={currentProduct.name}
            onChange={handleInputChange}
            placeholder="Product Name"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
            disabled={isSubmitting}
          />
          <input
            type="text"
            name="brand"
            value={currentProduct.brand}
            onChange={handleInputChange}
            placeholder="Brand"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
            disabled={isSubmitting}
          />
          <select
            name="category_id"
            value={currentProduct.category_id}
            onChange={handleInputChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            disabled={isSubmitting}
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            name="price"
            value={currentProduct.price}
            onChange={handleInputChange}
            placeholder="Price"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            step="0.01"
            required
            disabled={isSubmitting}
          />
          <textarea
            name="description"
            value={currentProduct.description}
            onChange={handleInputChange}
            placeholder="Description"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            rows="3"
            required
            disabled={isSubmitting}
          />
          <input
            type="number"
            name="rating"
            value={currentProduct.rating}
            onChange={handleInputChange}
            placeholder="Rating"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            step="0.1"
            min="0"
            max="5"
            required
            disabled={isSubmitting}
          />
          <input
            type="file"
            onChange={handleImageChange}
            className="w-full p-2 border rounded"
            accept="image/*"
            disabled={isSubmitting}
          />
          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full max-h-40 object-cover rounded"
              />
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition duration-200"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex items-center justify-center px-4 py-2 rounded transition duration-200 ${
                isSubmitting
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              } text-white min-w-[100px]`}
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  {currentProduct.id ? "Updating..." : "Adding..."}
                </>
              ) : currentProduct.id ? (
                "Update Product"
              ) : (
                "Add Product"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
