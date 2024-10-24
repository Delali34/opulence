// components/admin/Modals/CategoryModal.js
import { useState, useEffect } from "react";
import { FaSpinner, FaImage, FaTrash } from "react-icons/fa";

export const CategoryModal = ({
  isOpen,
  onClose,
  currentCategory,
  handleInputChange,
  handleSubmit,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    // Set preview URL when currentCategory changes
    if (currentCategory.image_url) {
      setPreviewUrl(currentCategory.image_url);
    } else {
      setPreviewUrl("");
    }
    // Clear image state when modal opens/closes
    setImage(null);
  }, [currentCategory.image_url, isOpen]);

  // Cleanup preview URL when component unmounts or modal closes
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const url = URL.createObjectURL(file);
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(url);
    }
  };

  const handleRemoveImage = () => {
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl("");
    setImage(null);
    handleInputChange({ target: { name: "image_url", value: null } });
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      let imageUrl = currentCategory.image_url;

      if (image) {
        try {
          const base64 = await convertToBase64(image);
          const response = await fetch("/api/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: base64 }),
          });

          if (!response.ok) {
            throw new Error("Failed to upload image");
          }

          const data = await response.json();
          imageUrl = data.url;
        } catch (error) {
          throw new Error("Image upload failed: " + error.message);
        }
      }

      // Prepare category data
      const categoryData = {
        ...currentCategory,
        image_url: imageUrl,
      };

      await handleSubmit(e, categoryData);

      // Cleanup
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    } catch (error) {
      setError(error.message || "Failed to save category. Please try again.");
      console.error("Category submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">
          {currentCategory.id ? "Edit Category" : "Add New Category"}
        </h2>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Image Upload Section */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Category Image
            </label>
            <div className="flex flex-col items-center justify-center">
              {previewUrl ? (
                <div className="relative w-full h-48 mb-4">
                  <img
                    src={previewUrl}
                    alt="Category preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                    disabled={isSubmitting}
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FaImage className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">
                        Click to upload image
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleImageChange}
                      accept="image/*"
                      disabled={isSubmitting}
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Other form fields remain the same */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Name
            </label>
            <input
              type="text"
              name="name"
              value={currentCategory.name}
              onChange={handleInputChange}
              placeholder="Category Name"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug
            </label>
            <input
              type="text"
              name="slug"
              value={currentCategory.slug}
              onChange={handleInputChange}
              placeholder="category-slug"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50"
              required
              disabled={isSubmitting}
            />
            <p className="text-sm text-gray-500 mt-1">
              This will be automatically generated from the category name
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={currentCategory.description}
              onChange={handleInputChange}
              placeholder="Category Description"
              rows="3"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
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
                  {currentCategory.id ? "Updating..." : "Adding..."}
                </>
              ) : currentCategory.id ? (
                "Update Category"
              ) : (
                "Add Category"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
