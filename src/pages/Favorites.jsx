import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import "../styles/Favorites.css";

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

        <div className="favorites-page">

            <div className="favorites-container">

                <div className="favorites-header">

                    <h1>Favorilerim</h1>

                    <p>
                        Beğendiğiniz ürünleri burada bulabilirsiniz.
                    </p>

                </div>


                {favorites.length === 0 ? (

                    <div className="empty-favorites">

                        <div className="empty-favorites-icon">
                            ♡
                        </div>

                        <h2>Henüz favori ürününüz bulunmuyor.</h2>

                        <p>
                            Beğendiğiniz ürünleri favorilerinize ekleyerek
                            daha sonra kolayca ulaşabilirsiniz.
                        </p>

                    </div>

                ) : (

                    <div className="favorites-products">

                        {favorites.map(product => (

                            <ProductCard
                                key={product.id}
                                id={product.id}
                                name={product.name}
                                price={Number(product.price)}
                                images={
                                    product.image
                                        ? [
                                            `http://localhost:5000/uploads/${product.image}`
                                        ]
                                        : []
                                }
                                onFavoriteRemoved={removeFavorite}
                            />

                        ))}

                    </div>

                )}

            </div>

        </div>

    );

}

export default Favorites;