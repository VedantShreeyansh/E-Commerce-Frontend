import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [newProduct, setNewProduct] = useState({ title: "", price: 0, category: "", image: null });
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
        const res = await axios.get(`${backendUrl}/api/products/list`);
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err.message);
      }
    };

    fetchProducts();
  }, []);

  const handleAddProduct = async () => {
    try {

      if (!newProduct.title || !newProduct.price || !newProduct.category || !newProduct.image) {
        alert("Please fill in all the required fields.");
        return;
      }

      // Check if the price is a positive number
      if (newProduct.price <= 0) {
        alert("Price must be a positive number.");
        return;
      }
      
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
      const formData = new FormData();
      formData.append("title", newProduct.title);
      formData.append("price", newProduct.price);
      formData.append("category", newProduct.category);
      if (newProduct.image) {
        formData.append("image", newProduct.image);
      }

      const res = await axios.post(`${backendUrl}/api/products/add`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setProducts((prev) => [...prev, res.data.product]); // Add the new product to the list
      setNewProduct({ title: "", price: 0, category: "", image: null }); // Reset the form
      alert(res.data.message || "Product added successfully!");
    } catch (err) {
      console.error("Error adding product:", err.message);
      alert("Failed to add product. Please try again.");
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
      await axios.delete(`${backendUrl}/api/products/delete/${id}`); // Correct DELETE request
      setProducts((prev) => prev.filter((product) => product.id !== id)); // Remove the product from the state
      alert("Product deleted successfully!");
    } catch (err) {
      console.error("Error deleting product:", err.message);
      alert("Failed to delete product. Please try again.");
    }
  };

  return (
    <div className="p-8 min-h-screen inverted-gradient">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Admin Dashboard</h1>

      {/* Add Product Form */}
      <div className="max-w-2xl mx-auto  border-gray-300 rounded-lg p-6 custom-shadow">
        <h2 className="text-2xl font-bold mb-4 text-gray-700">Add New Product</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Product Title"
            value={newProduct.title}
            onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
            className="w-full p-3 border rounded-lg "
            required
          />
          <input
            type="number"
            placeholder="Product Price"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            className="w-full p-3 border rounded-lg"
            required
          />
          <input
            type="text"
            placeholder="Product Category"
            value={newProduct.category}
            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
            className="w-full p-3 border rounded-lg"
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewProduct({ ...newProduct, image: e.target.files[0] })}
            className="w-full p-3 border rounded-lg"
            required
          />
          <button
            onClick={handleAddProduct}
            className="button w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600"
          >
            Add Product
          </button>
        </div>
      </div>

      {/* Manage Products */}
      <div className="mt-12 max-w-4xl mx-auto rounded-lg p-6 custom-shadow1">
        <h2 className="text-2xl font-bold mb-4 text-gray-700">Manage Products</h2>
        {products.length === 0 ? (
          <p className="text-gray-600">No products found.</p>
        ) : (
          <ul className="space-y-4">
            {products.map((product) => (
              <li key={product.id} className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold">{product.title}</h3>
                  <p className="text-gray-600">${product.price}</p>
                </div>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;