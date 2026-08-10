import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/HeroBanner.css";

import phone from "../assets/images/banners/phone.png";
import laptop from "../assets/images/banners/laptop.png";
import gaming from "../assets/images/banners/gaming.png";

const banners = [

    {
        id: 1,
        title: "ASUS ROG STRIX G18",
        subtitle: "Gücün Yeni Tanımı",
        description: "Intel Ultra 9 • RTX 5090 • 64 GB RAM",
        image: laptop,
        productId: 1
    },

    {
        id: 2,
        title: "iPhone 17 Pro",
        subtitle: "Titanyum Performans",
        description: "Apple Intelligence ile geleceği keşfet.",
        image: phone,
        productId: 2
    },

    {
        id: 3,
        title: "Logitech G PRO X",
        subtitle: "Profesyonellerin Tercihi",
        description: "Oyuncular için tasarlanmış üst düzey ekipman.",
        image: gaming,
        productId: 3
    }

];

function HeroBanner() {

    const [current, setCurrent] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {

        const interval = setInterval(() => {

            setCurrent((prev) =>
                prev === banners.length - 1 ? 0 : prev + 1
            );

        }, 5000);

        return () => clearInterval(interval);

    }, []);

    return (

        <section
            className="hero-banner"
            onClick={() =>
                navigate(`/product/${banners[current].productId}`)
            }
        >

            <div className="hero-content">

                <h1>

                    {banners[current].title}

                </h1>

                <h3>

                    {banners[current].subtitle}

                </h3>

                <p>

                    {banners[current].description}

                </p>

            </div>

            <div className="hero-image">

                <img
                    src={banners[current].image}
                    alt={banners[current].title}
                />

            </div>

            <div className="hero-dots">

                {banners.map((banner, index) => (

                    <span

                        key={banner.id}

                        className={
                            current === index
                                ? "dot active"
                                : "dot"
                        }

                        onClick={(e) => {

                            e.stopPropagation();

                            setCurrent(index);

                        }}

                    />

                ))}

            </div>

        </section>

    );

}

export default HeroBanner;