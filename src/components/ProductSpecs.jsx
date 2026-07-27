import "../styles/ProductSpecs.css";
import {
    FiCpu,
    FiHardDrive,
    FiMonitor,
    FiBatteryCharging,
    FiCamera,
    FiSmartphone
} from "react-icons/fi";

function ProductSpecs({ product }) {

    return (
        

        <section className="product-specs">
            <h2>Teknik Özellikler</h2>

            <div className="specs-grid">

                <div className="spec-card">
                    <FiCpu />
                    <span>İşlemci</span>
                    <strong>{product.specs.processor}</strong>
                </div>

                <div className="spec-card">
                    <FiHardDrive />
                    <span>RAM</span>
                    <strong>{product.specs.ram}</strong>
                </div>

                <div className="spec-card">
                    <FiHardDrive />
                    <span>Depolama</span>
                    <strong>{product.specs.storage}</strong>
                </div>

                <div className="spec-card">
                    <FiMonitor />
                    <span>Ekran</span>
                    <strong>{product.specs.display}</strong>
                </div>

                <div className="spec-card">
                    <FiBatteryCharging />
                    <span>Pil</span>
                    <strong>{product.specs.battery}</strong>
                </div>

                <div className="spec-card">
                    <FiCamera />
                    <span>Kamera</span>
                    <strong>{product.specs.camera}</strong>
                </div>

                <div className="spec-card">
                    <FiSmartphone />
                    <span>İşletim Sistemi</span>
                    <strong>{product.specs.os}</strong>
                </div>

            </div>

        </section>

    );

}

export default ProductSpecs;