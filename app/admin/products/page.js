"use client";
import React, { useState, useEffect } from "react";
import {
  FaBox,
  FaLayerGroup,
  FaUsers,
  FaShoppingBag,
  FaCreditCard,
  FaEdit,
  FaTrash,
  FaStar,
  FaPlus,
  FaTags,
} from "react-icons/fa";

// TabButton component (same as before)
const TabButton = ({ active, icon: Icon, label, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 p-4 ${
      active ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-indigo-50"
    } transition duration-200`}
  >
    <Icon className="w-5 h-5" />
    <span>{label}</span>
  </button>
);

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    name: "",
    brand: "",
    price: "",
    description: "",
    rating: "",
    category_id: "", // Updated from categoryId
  });
  const [currentCategory, setCurrentCategory] = useState({
    name: "",
    description: "",
    slug: "",
  });
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (activeTab === "products") {
      fetchProducts();
      fetchCategories();
    } else if (activeTab === "categories") {
      fetchCategories();
    }
  }, [activeTab]);

  // Fetch functions
  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data.data);
  };

  const fetchCategories = async () => {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data.data || []);
  };

  // Category management functions
  const handleCategoryInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCategory({
      ...currentCategory,
      [name]: value,
      slug:
        name === "name"
          ? value.toLowerCase().replace(/\s+/g, "-")
          : currentCategory.slug,
    });
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    const url = currentCategory.id
      ? `/api/categories/${currentCategory.id}`
      : "/api/categories";
    const method = currentCategory.id ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(currentCategory),
    });

    if (response.ok) {
      setIsCategoryModalOpen(false);
      setCurrentCategory({ name: "", description: "", slug: "" });
      fetchCategories();
    }
  };

  const handleEditCategory = (category) => {
    setCurrentCategory(category);
    setIsCategoryModalOpen(true);
  };

  const handleDeleteCategory = async (id) => {
    if (
      window.confirm(
        "Are you sure? This will affect all products in this category."
      )
    ) {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchCategories();
      }
    }
  };

  // Product management functions (updated to include category)
  const handleProductInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct({ ...currentProduct, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    let image_url = currentProduct.image_url || "";
    if (image) {
      const uploadRes = await handleImageUpload(image);
      image_url = uploadRes.url;
    }

    const productData = { ...currentProduct, image_url };
    const url = currentProduct.id
      ? `/api/products/${currentProduct.id}`
      : "/api/products";
    const method = currentProduct.id ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });

    if (response.ok) {
      setIsProductModalOpen(false);
      setCurrentProduct({
        name: "",
        brand: "",
        price: "",
        description: "",
        rating: "",
        categoryId: "",
      });
      setImage(null);
      fetchProducts();
    }
  };

  // Image handling functions (same as before)
  const handleImageUpload = async (file) => {
    const base64 = await convertToBase64(file);
    const res = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: base64 }),
    });
    return await res.json();
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  // Categories Tab Content
  const CategoriesTab = () => (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-indigo-800">
          Categories Management
        </h2>
        <button
          onClick={() => setIsCategoryModalOpen(true)}
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
                onClick={() => handleEditCategory(category)}
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDeleteCategory(category.id)}
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

  // Main content renderer
  const renderTabContent = () => {
    switch (activeTab) {
      case "products":
        return (
          <div className="p-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-indigo-800">
                Products Management
              </h2>
              <button
                onClick={() => setIsProductModalOpen(true)}
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
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-48 object-cover mb-4 rounded"
                  />
                  <h3 className="text-xl font-bold text-indigo-800 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 mb-2">{product.brand}</p>
                  <p className="text-indigo-600 font-bold mb-2">
                    ${product.price}
                  </p>
                  <p className="text-gray-700 mb-2">{product.description}</p>
                  <div className="flex items-center mb-4">
                    <FaStar className="text-yellow-400 mr-1" />
                    <span>{product.rating} / 5.0</span>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => {
                        setCurrentProduct(product);
                        setIsProductModalOpen(true);
                      }}
                      className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
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
      case "categories":
        return <CategoriesTab />;
      // Other tabs remain the same...
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans2">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <div className="p-4">
            <h1 className="text-2xl font-bold text-indigo-800">Admin Panel</h1>
          </div>
          <nav className="mt-4">
            <TabButton
              active={activeTab === "products"}
              icon={FaBox}
              label="Products"
              onClick={() => setActiveTab("products")}
            />
            <TabButton
              active={activeTab === "categories"}
              icon={FaTags}
              label="Categories"
              onClick={() => setActiveTab("categories")}
            />
            <TabButton
              active={activeTab === "collections"}
              icon={FaLayerGroup}
              label="Collections"
              onClick={() => setActiveTab("collections")}
            />
            <TabButton
              active={activeTab === "signups"}
              icon={FaUsers}
              label="Sign Ups"
              onClick={() => setActiveTab("signups")}
            />
            <TabButton
              active={activeTab === "orders"}
              icon={FaShoppingBag}
              label="Orders"
              onClick={() => setActiveTab("orders")}
            />
            <TabButton
              active={activeTab === "payments"}
              icon={FaCreditCard}
              label="Payments"
              onClick={() => setActiveTab("payments")}
            />
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">{renderTabContent()}</div>
      </div>

      {/* Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">
              {currentProduct.id ? "Edit Product" : "Add New Product"}
            </h2>
            <form onSubmit={handleProductSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                value={currentProduct.name}
                onChange={handleProductInputChange}
                placeholder="Product Name"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="text"
                name="brand"
                value={currentProduct.brand}
                onChange={handleProductInputChange}
                placeholder="Brand"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <select
                name="categoryId"
                value={currentProduct.categoryId}
                onChange={handleProductInputChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
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
                onChange={handleProductInputChange}
                placeholder="Price"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <textarea
                name="description"
                value={currentProduct.description}
                onChange={handleProductInputChange}
                placeholder="Description"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                rows="3"
              />
              <input
                type="number"
                name="rating"
                value={currentProduct.rating}
                onChange={handleProductInputChange}
                placeholder="Rating"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                step="0.1"
                min="0"
                max="5"
              />
              <input
                type="file"
                onChange={handleImageChange}
                className="w-full p-2 border rounded"
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="bg-gray-300 text-gray-800 p-2 rounded hover:bg-gray-400 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 transition duration-200"
                >
                  {currentProduct.id ? "Update Product" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">
              {currentCategory.id ? "Edit Category" : "Add New Category"}
            </h2>
            <form onSubmit={handleCategorySubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={currentCategory.name}
                  onChange={handleCategoryInputChange}
                  placeholder="Category Name"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
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
                  onChange={handleCategoryInputChange}
                  placeholder="category-slug"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50"
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
                  onChange={handleCategoryInputChange}
                  placeholder="Category Description"
                  rows="3"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition duration-200"
                >
                  {currentCategory.id ? "Update Category" : "Add Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stats Overview Panel */}
      <div className="fixed bottom-0 right-0 m-4 bg-white p-4 rounded-lg shadow-lg">
        <div className="flex space-x-6">
          <div>
            <p className="text-sm text-gray-500">Total Products</p>
            <p className="text-2xl font-bold text-indigo-600">
              {products.length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Categories</p>
            <p className="text-2xl font-bold text-indigo-600">
              {categories.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
