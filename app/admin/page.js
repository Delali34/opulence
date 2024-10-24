// app/admin/page.js
"use client";
import { useState, useEffect } from "react";
import {
  FaBox,
  FaTags,
  FaUsers,
  FaShoppingBag,
  FaCreditCard,
} from "react-icons/fa";
import { TabButton } from "@/components/admin/TabButton";
import { ProductsTab } from "@/components/admin/ProductsTab";
import { CategoriesTab } from "@/components/admin/CategoriesTab";
import { ProductModal } from "@/components/admin/Modals/ProductModal";
import { CategoryModal } from "@/components/admin/Modals/CategoryModal";
import { StatsPanel } from "@/components/admin/StatsPanel";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    name: "",
    brand: "",
    price: "",
    description: "",
    rating: "",
    category_id: "",
  });
  const [currentCategory, setCurrentCategory] = useState({
    name: "",
    description: "",
    slug: "",
  });
  const [image, setImage] = useState(null);

  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([fetchProducts(), fetchCategories()]);
      } catch (error) {
        console.error("Error initializing data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.success) {
        setProducts(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setProducts([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.success) {
        setCategories(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      setCategories([]);
    }
  };

  // Product handlers
  const handleProductInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
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
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      let image_url = currentProduct.image_url;
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
          category_id: "",
        });
        setImage(null);
        fetchProducts();
      }
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(`/api/products/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          fetchProducts();
        }
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  // Category handlers
  const handleCategorySubmit = async (e, categoryData) => {
    try {
      const url = categoryData.id
        ? `/api/categories/${categoryData.id}`
        : "/api/categories";
      const method = categoryData.id ? "PUT" : "POST";

      console.log("Submitting category data:", { url, method, categoryData });

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryData),
      });

      const data = await response.json();
      console.log("Response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to save category");
      }

      await fetchCategories(); // Refresh categories list
      setIsCategoryModalOpen(false);
      setCurrentCategory({
        name: "",
        description: "",
        slug: "",
        image_url: "",
      });

      return data;
    } catch (error) {
      console.error("Error saving category:", error);
      throw error;
    }
  };

  // Also, update the handleCategoryInputChange to automatically generate slug
  const handleCategoryInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCategory((prev) => ({
      ...prev,
      [name]: value,
      // Only update slug when name changes and slug hasn't been manually edited
      ...(name === "name" &&
      prev.slug === prev.name.toLowerCase().replace(/\s+/g, "-")
        ? {
            slug: value
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, ""),
          }
        : {}),
    }));
  };

  const handleDeleteCategory = async (id) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete category");
      }

      if (data.success) {
        // Refresh the categories list
        await fetchCategories();
      } else {
        throw new Error(data.error || "Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      // Re-throw the error to be handled by the calling component
      throw error;
    }
  };

  const navItems = [
    { id: "products", icon: FaBox, label: "Products" },
    { id: "categories", icon: FaTags, label: "Categories" },
    { id: "signups", icon: FaUsers, label: "Sign Ups" },
    { id: "orders", icon: FaShoppingBag, label: "Orders" },
    { id: "payments", icon: FaCreditCard, label: "Payments" },
  ];

  const renderTabContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      );
    }

    switch (activeTab) {
      case "products":
        return (
          <ProductsTab
            products={products}
            onEdit={(product) => {
              setCurrentProduct(product);
              setIsProductModalOpen(true);
            }}
            onDelete={handleDeleteProduct}
            onAddNew={() => {
              setCurrentProduct({
                name: "",
                brand: "",
                price: "",
                description: "",
                rating: "",
                category_id: "",
              });
              setIsProductModalOpen(true);
            }}
          />
        );
      case "categories":
        return (
          <CategoriesTab
            categories={categories}
            products={products}
            onEdit={(category) => {
              setCurrentCategory(category);
              setIsCategoryModalOpen(true);
            }}
            onDelete={handleDeleteCategory}
            onAddNew={() => {
              setCurrentCategory({ name: "", description: "", slug: "" });
              setIsCategoryModalOpen(true);
            }}
          />
        );
      default:
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800">
              This feature is coming soon...
            </h2>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <div className="p-4">
            <h1 className="text-2xl font-bold text-indigo-800">Admin Panel</h1>
          </div>
          <nav className="mt-4">
            {navItems.map((item) => (
              <TabButton
                key={item.id}
                active={activeTab === item.id}
                icon={item.icon}
                label={item.label}
                onClick={() => setActiveTab(item.id)}
              />
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">{renderTabContent()}</div>

        {/* Modals */}
        {!isLoading && (
          <>
            <ProductModal
              isOpen={isProductModalOpen}
              onClose={() => setIsProductModalOpen(false)}
              currentProduct={currentProduct}
              handleInputChange={handleProductInputChange}
              handleSubmit={handleProductSubmit}
              handleImageChange={handleImageChange}
              categories={categories}
            />

            <CategoryModal
              isOpen={isCategoryModalOpen}
              onClose={() => setIsCategoryModalOpen(false)}
              currentCategory={currentCategory}
              handleInputChange={handleCategoryInputChange}
              handleSubmit={handleCategorySubmit}
            />
          </>
        )}

        {/* Stats Panel */}
        <StatsPanel
          productsCount={products?.length}
          categoriesCount={categories?.length}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
