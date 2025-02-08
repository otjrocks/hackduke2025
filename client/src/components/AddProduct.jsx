import React, { useState } from "react";
import axios from "axios";

export default function AddProduct() {
  const [formData, setFormData] = useState({
    name: "",
    image: null,
    category: "Clothing", // Add category to handle size options dynamically
    size: "M",
    price: "",
    isSold: false,
    theme: "Casual",
    createdAt: new Date().toISOString().slice(0, 10),
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      setFormData({
        ...formData,
        [name]: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("image", formData.image);
    data.append("category", formData.category); // Include category in form data
    data.append("size", formData.size);
    data.append("price", formData.price);
    data.append("isSold", formData.isSold);
    data.append("theme", formData.theme);
    data.append("createdAt", formData.createdAt);

    try {
      const response = await axios.post("http://localhost:3001/product/add", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        setMessage("Product added successfully!");
        setFormData({
          name: "",
          image: null,
          category: "Clothing", // Reset category
          size: "M",
          price: "",
          isSold: false,
          theme: "Casual",
          createdAt: new Date().toISOString().slice(0, 10),
        });
      } else {
        setMessage(response.data);
      }
    } catch (error) {
      setMessage("Error submitting the form. Please try again.");
    }
  };

  const renderSizeOptions = () => {
    const sizeOptions = {
      Clothing: ["XS", "S", "M", "L", "XL", "XXL"],
      Shoes: ["5", "6", "7", "8", "9", "10", "11", "12", "13"],
      Dresses: ["S", "M", "L", "XL"],
      Pants: ["28", "30", "32", "34", "36", "38"],
      Hats: ["S", "M", "L"],
    };

    return sizeOptions[formData.category].map((size) => (
      <option key={size} value={size}>
        {size}
      </option>
    ));
  };

  return (
    <div className="container">
      <h2>Add Product</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />

        <label>Image:</label>
        <input type="file" name="image" onChange={handleChange} required />
        {formData.image && <p>{formData.image.name}</p>}

        <label>Category:</label>
        <select name="category" value={formData.category} onChange={handleChange}>
          <option value="Clothing">Clothing</option>
          <option value="Shoes">Shoes</option>
          <option value="Dresses">Dresses</option>
          <option value="Pants">Pants</option>
          <option value="Hats">Hats</option>
        </select>

        <label>Size:</label>
        <select name="size" value={formData.size} onChange={handleChange}>
          {renderSizeOptions()}
        </select>

        <label>Price ($):</label>
        <input type="number" name="price" value={formData.price} onChange={handleChange} required />

        <label>Theme:</label>
        <select name="theme" value={formData.theme} onChange={handleChange}>
          <option value="Casual">Casual</option>
          <option value="Woodstock">Woodstock</option>
          <option value="African Wedding">African Wedding</option>
          <option value="Diwali">Diwali</option>
          <option value="Oktoberfest">Oktoberfest</option>
        </select>

        <label>
          Sold:
          <input type="checkbox" name="isSold" checked={formData.isSold} onChange={handleChange} />
        </label>

        <label>Created At:</label>
        <input type="date" name="createdAt" value={formData.createdAt} onChange={handleChange} disabled />

        <button type="submit">Add Product</button>
      </form>
    </div>
  );
}
