import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

function Favorites() {

    const [favorites, setFavorites] = useState([]);

    const removeFavorite = (productId) => {

    setFavorites(prev =>
        prev.filter(product => product.id !== productId)
    );

};

    useEffect(() => {

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {

        alert("Favorileri görüntülemek için giriş yapmalısınız.");

        window.location.href = "/login";

        return;

    }

    fetch(`http://localhost:5000/api/favorites/${user.id}`)
        .then(res => res.json())
        .then(data => setFavorites(data))
        .catch(err => console.log(err));

}, []);

    return (

        <div
            style={{
                maxWidth: "1300px",
                margin: "40px auto"
            }}
        >

            <h1>Favorilerim</h1>

            {favorites.length === 0 ? (

                <p>Henüz favori ürününüz bulunmuyor.</p>

            ) : (

                <div className="products">

                    {favorites.map(product => (

                        <ProductCard
    key={product.id}
    id={product.id}
    name={product.name}
    price={Number(product.price)}
    images={
        product.image
            ? [`http://localhost:5000/uploads/${product.image}`]
            : []
    }
    onFavoriteRemoved={removeFavorite}
/>

                    ))}

                </div>

            )}

        </div>

    );

}

export default Favorites;