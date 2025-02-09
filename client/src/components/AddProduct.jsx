import React, { useState } from "react";
import axios from "axios";
import "./AddProduct.css";

export default function AddProduct() {
  const [message, setMessage] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    image: null,
    category: "Clothing",
    size: "M",
    price: "",
    theme: "Casual",
    isSold: false,
    createdAt: new Date().toISOString().slice(0, 10),
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      try {
        const uploadFormData = new FormData();
        uploadFormData.append("image", selectedFile);

        const response = await axios.post(process.env.REACT_APP_SERVER_URL + "/upload", uploadFormData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        setFileUrl(response.data.fileUrl);
        setFormData((prev) => ({ ...prev, image: response.data.fileUrl }));
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormData((prev) => ({ ...prev, image: fileUrl }));
    console.log(JSON.stringify(formData))
    try {
      const response = await fetch(process.env.REACT_APP_SERVER_URL + "/product/add", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        window.location.href = 'http://localhost:3000/profile'
      } else {
        setMessage(data.message)
      }
      console.log(await response.json());
    } catch (error) {
      console.error("Request failed:", error);
    }
  };

  return (
    <div className="container">
      <h2>Add Product</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />

        <label>Image:</label>
        <input type="file" name="image" accept="image/*" onChange={handleFileChange} required />
        {fileUrl && <img src={process.env.REACT_APP_SERVER_URL + fileUrl} alt="Uploaded Preview" style={{ width: "100%", marginTop: "10px" }} />}

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
          {(["XS", "S", "M", "L", "XL", "XXL"]).map((size) => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>

        <label>Price ($):</label>
        <input type="number" name="price" value={formData.price} onChange={handleChange} required />

        <label>Theme:</label>
        <select name="theme" value={formData.theme} onChange={handleChange}>
          <option value="Duke Basketball">Duke Basketball</option>
          <option value="Professional">Professional Attire</option>
          <option value="Spring Break">Spring Break</option>
          <option value="Tropical">Tropical</option>
          <option value="Duo's">Duo Costumes</option>
          <option value="Formals">Formals</option>
          <option value="Woodstock">Woodstock</option>
          <option value="Oktoberfest">Oktoberfest</option>
          <option value="Halloween">Halloween</option>
          <option value="Disco">Disco</option>
          <option value="Duke Game Days">Duke Merch</option>
          <option value="Cowboy">Cowboy</option>
          <option value="Christmas">Christmas</option>
          <option value="Valentines">Valentines</option>
        </select>

        <button type="submit">Add Product</button>
      </form>
    </div>
  );
}
