import React, { useState } from "react";
import axios from "axios";
import "./AddProduct.css";
import Header from "./Header";

export default function AddProduct() {
  const [message, setMessage] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [loading, setLoading] = useState(false); //Added loading state
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    image: null,
    category: "Clothing",
    size: "M",
    price: "",
    theme: "Duke Basketball",
    isSold: false,
    createdAt: new Date().toISOString(),
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
    if (!selectedFile) return;

    if (selectedFile.size > 12 * 1024 * 1024) {
      setErrorMessage("File size exceeds 12MB. Please upload a smaller image.");
      return;
    }
    
    setLoading(true);
    setErrorMessage("");
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/generate-upload-url?fileType=${selectedFile.type}`
      );

      await fetch(data.uploadUrl, {
        method: "PUT",
        body: selectedFile,
        headers: { "Content-Type": selectedFile.type },
      });

      setFileUrl(process.env.REACT_APP_AWS_URL + data.filePath);
      setFormData((prev) => ({ ...prev, image: process.env.REACT_APP_AWS_URL + data.filePath }));
    } catch (error) {
      console.error("Error uploading image:", error);
      setErrorMessage("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fileUrl) {
      setErrorMessage("Image upload is required. Please try uploading a new image.");
      return;
    }
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
        window.location.href = process.env.REACT_APP_CLIENT_URL + "/profile"
      } else {
        setMessage(data.message)
      }
    } catch (error) {
      console.error("Request failed:", error);
    }
  };

    // Determine sizes based on selected category
  const getSizeOptions = () => {
    if (formData.category === 'Shoes') {
      // If category is Shoes, return sizes 3 to 14
      return Array.from({ length: 12 }, (_, i) => i + 3).map((size) => (
        <option key={size} value={size}>
          {size}
        </option>
      ));
    } else if (formData.category === 'Pants') {
      // If category is Pants, return sizes 24 to 44
      return Array.from({ length: 21 }, (_, i) => i + 24).map((size) => (
        <option key={size} value={size}>
          {size}
        </option>
      ));
    } else {
      // For other categories, return XS to XXL
      return ['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
        <option key={size} value={size}>
          {size}
        </option>
      ));
    }
  };
  return (
    <div className="container">
      <Header />
      <h2>Add Product</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />

        <label>Image:</label>
        <input type="file" name="image" accept="image/png, image/jpeg, image/jpg, image/gif" onChange={handleFileChange} required />

        {errorMessage && <p className="error-message">{errorMessage}</p>}

         {loading && (
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
        )}

          {!errorMessage && !loading && fileUrl && (
            <img src={fileUrl} alt="Uploaded Preview" style={{ width: "100%", marginTop: "10px" }} />
        )}

        <label>Category:</label>
        <select name="category" value={formData.category} onChange={handleChange}>
          <option value="Tops">Tops</option>
          <option value="Bottoms">Bottoms</option>
          <option value="Dresses">Dresses</option>
          <option value="Shoes">Shoes</option>
          <option value="Accessories">Accessories</option>
        </select>

        <label>Size:</label>
        <select name="size" value={formData.size} onChange={handleChange}>
            {getSizeOptions()}
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
          <option value="Intramural Sports">Intramural Sports</option>
        </select>

        <button type="submit">Add Product</button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>
    </div>
  );
}
