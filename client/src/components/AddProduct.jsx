
import React, { useState } from "react";
import axios from "axios";
import './AddProduct.css'

export default function AddProduct() {
  const [message, setMessage] = useState("");
  const [fileUrl, setFileUrl] = useState(""); // State to store uploaded image URL

  const handleFileChange = (e) => {
    e.persist();
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      uploadImage(selectedFile);
    }
  };

  // Upload the image
  const uploadImage = async (file) => {
    console.log(file);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await axios.post("http://localhost:3001/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("File uploaded successfully", response.data);
      const imageUrl = response.data.fileUrl; // URL of the uploaded image
      setFileUrl(imageUrl); // Store in state
      console.log("Image URL:", imageUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    formData.append("image", fileUrl); // Attach uploaded image URL to form data

    try {
      const response = await fetch("http://localhost:3001/product/add", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const resData = await response.json();
      console.log(resData);
    } catch (error) {
      console.log("Request failed:", error);
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

    return sizeOptions["Clothing"].map((size) => (
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
        <input type="text" name="name" required />

        <label>Image:</label>
        <input type="file" name="image" accept="image/*" onChange={handleFileChange} required />

        {/* Display the uploaded image preview */}
        {fileUrl}
        {fileUrl && <img src={fileUrl} alt="Uploaded Preview" style={{ width: "100px", marginTop: "10px" }} />}

        <label>Category:</label>
        <select name="category">
          <option value="Clothing">Clothing</option>
          <option value="Shoes">Shoes</option>
          <option value="Dresses">Dresses</option>
          <option value="Pants">Pants</option>
          <option value="Hats">Hats</option>
        </select>

        <label>Size:</label>
        <select name="size">{renderSizeOptions()}</select>

        <label>Price ($):</label>
        <input type="number" name="price" required />

        <label>Theme:</label>
        <select name="theme">
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
          <option value="Tropical">Tropical</option>
          <option value="Valentines">Valentines</option>
    
        </select>

        <button type="submit">Add Product</button>
      </form>
    </div>
  );
}
