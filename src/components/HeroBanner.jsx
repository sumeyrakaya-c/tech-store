import { useEffect, useState } from "react";
import "../styles/HeroBanner.css";
import phone from "../assets/images/banners/phone.png";
import laptop from "../assets/images/banners/laptop.png";
import gaming from "../assets/images/banners/gaming.png";

const banners = [
    {
        title: "Yeni Nesil Teknoloji",
        subtitle: "iPhone, laptop ve oyuncu ekipmanlarında büyük indirimler.",
        button: "Alışverişe Başla",
        image: phone
    },
    {
        title: "İş ve Eğitim İçin",
        subtitle: "Güçlü performans sunan dizüstü bilgisayarları keşfet.",
        button: "Fırsatları Gör",
        image: laptop
    },
    {
        title: "Oyuncular İçin",
        subtitle: "Profesyonel oyuncu ekipmanlarını şimdi keşfet.",
        button: "İncele",
        image: gaming
    }
];

function HeroBanner() {

    const [current, setCurrent] = useState(0);

    useEffect(() => {

        const interval = setInterval(() => {

            setCurrent((prev) =>
                prev === banners.length - 1 ? 0 : prev + 1
            );

        }, 5000);

        return () => clearInterval(interval);

    }, []);

    return (

        <section className="hero-banner">

            <div className="hero-content">

                <h1>{banners[current].title}</h1>

                <p>{banners[current].subtitle}</p>

                <button>

                    {banners[current].button}

                </button>

            </div>

            <div className="hero-image">

                <img
                    src={banners[current].image}
                    alt=""
                />

            </div>

            <div className="hero-dots">

                {banners.map((_, index) => (

                    <span

                        key={index}

                        className={
                            current === index
                                ? "dot active"
                                : "dot"
                        }

                        onClick={() => setCurrent(index)}

                    />

                ))}

            </div>

        </section>

    );

}

export default HeroBanner;