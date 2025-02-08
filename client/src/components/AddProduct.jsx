import React, { useState } from "react";
import axios from "axios";

export default function AddProduct() {
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    size: "M",
    price: "",
    isSold: false,
    theme: "Casual",
    createdAt: new Date().toISOString().slice(0, 10),
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3001/product/add", formData);
      if (response.data.success) {
        setMessage("Product added successfully!");
        setFormData({
          name: "",
          image: "",
          size: "M",
          price: "",
          isSold: false,
          theme: "Casual",
          createdAt: new Date().toISOString().slice(0, 10),
        });
      } else {
        setMessage(response.data)
        setMessage("Failed to add product.");
      }
    } catch (error) {

      setMessage("Error submitting the form. Please try again.");
    }
  };

  return (
    <div className="container">
      <h2>Add Product</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />

        <label>Image URL:</label>
        <input type="text" name="image" value={formData.image} onChange={handleChange} required />

        <label>Size:</label>
        <select name="size" value={formData.size} onChange={handleChange}>
          <option value="XS">XS</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
          <option value="XXL">XXL</option>
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
