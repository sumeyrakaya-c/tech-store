import iphone1 from "../assets/images/iphone1.png";
import iphone2 from "../assets/images/iphone2.png";
import iphone3 from "../assets/images/iphone3.png";

const products = [
    {
        id: 1,
        name: "MSI Katana A17 AI",
        price: 54999,
        images: [],
        category: "Laptop",
        rating: 4.8
    },
    {
    id:2,
    name:"iPhone 17",

    price:89999,

    images:[iphone1,iphone2,iphone3],

    category:"Telefon",

    rating:4.9,

    description: `iPhone 17, daha zarif tasarımı, gelişmiş ekran teknolojisi ve güçlü performansıyla günlük kullanım deneyimini üst seviyeye taşıyor. 6.3 inç Super Retina XDR ekranı, 120 Hz'e kadar uyarlanabilir ProMotion teknolojisi sayesinde son derece akıcı bir görüntü sunarken, yüksek parlaklık değeriyle güneş ışığında bile net bir görüntü sağlıyor. Ceramic Shield 2 ön yüzeyi ise çizilmelere ve darbelere karşı önceki nesillere göre daha dayanıklı bir yapı sunuyor.

Gelişmiş kamera sistemi sayesinde yüksek kaliteli fotoğraf ve videolar çekebilir, Kamera Denetimi özelliği ile çekim ayarlarına hızlıca ulaşabilirsiniz. Eylem düğmesi, sessiz mod, çeviri, kestirmeler ve sık kullandığınız diğer işlevlere tek dokunuşla erişmenizi sağlar. Dynamic Island ise bildirimleri ve canlı etkinlikleri daha pratik bir şekilde takip etmenize yardımcı olur.

Apple Intelligence desteğiyle çalışan iPhone 17, güçlü donanımı sayesinde yapay zekâ destekli özellikleri daha hızlı ve verimli kullanmanıza olanak tanır. Performans, enerji verimliliği ve iOS deneyimi bir araya gelerek hem günlük kullanımda hem de yoğun uygulamalarda akıcı bir deneyim sunar.

Beş farklı renk seçeneği (Lavanta, Ada Çayı, Sis Mavisi, Beyaz ve Siyah) ile sunulan iPhone 17, şık tasarımını dayanıklılıkla birleştirerek Apple ekosistemine kusursuz şekilde uyum sağlar.`,

specs: {
    processor: "Apple A19 Pro",
    ram: "12 GB",
    storage: "256 GB",
    display: "6.3 inç Super Retina XDR",
    battery: "4700 mAh",
    camera: "48 MP Fusion",
    os: "iOS 27"
}

},

    {
        id: 3,
        name: "Logitech G Pro X",
        price: 4299,
        images: [],
        category: "Kulaklık",
        rating: 4.7
    },
    {
        id: 4,
        name: "Samsung Odyssey G5",
        price: 11999,
        images: [],
        category: "Monitör",
        rating: 4.6
    }
];

export default products;