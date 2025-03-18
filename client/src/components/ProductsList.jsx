import ShareButton from "./ShareButton";

export default function ProductsList({ products }) {
    return (
        <div className="product-list">
            {products.map((product) => {
                return (
                    <div 
                        key={product._id} 
                        className="product-item"
                    >
                        <h2>{product.name}</h2>
                        <p>Size: {product.size}</p>
                        <p>Price: ${product.price}</p>
                        <p>Email: <a href={`mailto:${product.email}`}>{product.email}</a></p>
                        {product.image && <img src={product.image} alt={product.name} />}
                        <ShareButton url={process.env.REACT_APP_CLIENT_URL + "/product/" + product._id} title="Check out this amazing product on Campus Closet!"></ShareButton>
                    </div>
                );
            })}
        </div>
    );
}
