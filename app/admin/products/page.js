"use client";

import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaStar, FaPlus } from "react-icons/fa";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    name: "",
    brand: "",
    price: "",
    description: "",
    rating: "",
  });
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data.data);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct({ ...currentProduct, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleSubmit = async (e) => {
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
      setIsModalOpen(false);
      setCurrentProduct({
        name: "",
        brand: "",
        price: "",
        description: "",
        rating: "",
      });
      setImage(null);
      fetchProducts();
    } else {
      console.error("Failed to save product");
    }
  };

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

  const handleEdit = (product) => {
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const response = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (response.ok) {
        fetchProducts();
      } else {
        console.error("Failed to delete product");
      }
    }
  };

  const openModal = () => {
    setCurrentProduct({
      name: "",
      brand: "",
      price: "",
      description: "",
      rating: "",
    });
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-[1320px] font-sans2 mx-auto p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-indigo-800">
          Product Management
        </h1>
        <button
          onClick={openModal}
          className="bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 transition duration-200 flex items-center"
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
            <h2 className="text-xl font-bold text-indigo-800 mb-2">
              {product.name}
            </h2>
            <p className="text-gray-600 mb-2">{product.brand}</p>
            <p className="text-indigo-600 font-bold mb-2">${product.price}</p>
            <p className="text-gray-700 mb-2">{product.description}</p>
            <div className="flex items-center mb-4">
              <FaStar className="text-yellow-400 mr-1" />
              <span>{product.rating} / 5.0</span>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => handleEdit(product)}
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">
              {currentProduct.id ? "Edit Product" : "Add New Product"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                value={currentProduct.name}
                onChange={handleInputChange}
                placeholder="Product Name"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="text"
                name="brand"
                value={currentProduct.brand}
                onChange={handleInputChange}
                placeholder="Brand"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="number"
                name="price"
                value={currentProduct.price}
                onChange={handleInputChange}
                placeholder="Price"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <textarea
                name="description"
                value={currentProduct.description}
                onChange={handleInputChange}
                placeholder="Description"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                rows="3"
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
              />
              <input
                type="file"
                onChange={handleImageChange}
                className="w-full p-2 border rounded"
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
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
    </div>
  );
}
