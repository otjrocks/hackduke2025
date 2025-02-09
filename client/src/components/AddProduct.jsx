import React, { useState } from "react";
import axios from "axios";
import "./AddProduct.css";

export default function AddProduct() {
  const [formData, setFormData] = useState({
    name: "",
    image: null,
    category: "Tops",
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
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) {
      setMessage("Please upload an image.");
      return;
    }

    const request = new Request(`http://localhost:3001/product/add`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
      credentials: "include"
    });

    fetch(request)
      .then(res => res.json())
      .then(res => console.log(res))
      .catch(error => console.log('Request failed: ', error));
  };

  // 🔹 Ensure this function is inside AddProduct()
  const renderSizeOptions = () => {
    const sizeOptions = {
      Tops: ["XS", "S", "M", "L", "XL", "XXL"],
      Bottoms: ["28", "30", "32", "34", "36", "38"],
      Shoes: ["5", "6", "7", "8", "9", "10", "11", "12", "13"],
      Accessories: ["One Size"],
      Other: ["N/A"]
    };

    return sizeOptions[formData.category].map((size) => (
      <option key={size} value={size}>{size}</option>
    ));
  };

  // 🔹 Ensure return is inside AddProduct()
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
          <option value="Tops">Tops</option>
          <option value="Bottoms">Bottoms</option>
          <option value="Shoes">Shoes</option>
          <option value="Accessories">Accessories</option>
          <option value="Other">Other</option>
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


        <button type="submit">Add Product</button>
      </form>
    </div>
  );
}