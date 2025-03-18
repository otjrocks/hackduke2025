import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "./Header";
import "./Product.css";
import MetaData from "./MetaData";

export default function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_SERVER_URL + `/product/get/product/${id}`, {
          method: "GET",
          credentials: "include", // Include credentials (cookies, authentication headers)
        });

        const data = await response.json();

        if (data.success) {
          setProduct(data.product);
        } else {
          setError(data.message || "Product not found");
        }
      } catch (err) {
        setError("Error fetching product.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      {product && <MetaData image={product.image} />}
      <Header />
      <div className="main-content">
        <div key={product._id} className="single-product">
          {product.image && <img src={product.image} alt={product.name} />}
          <h2>{product.name}</h2>
          <p>Size: {product.size}</p>
          <p>Price: ${product.price}</p>
          <p>Email: <a href={`mailto:${product.email}`}>{product.email}</a></p>
        </div>
      </div>
    </>
  );
}
