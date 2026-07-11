import { X, Search, ArrowRight } from "lucide-react";
import useModalStore from "../store/modal.js";

import { useState, useEffect, use } from "react";
import { useNavigate, useSearchParams } from 'react-router-dom';
import useDebounce from "../utils/useDebounce.js";


export default function SearchOverlay() {
    const navigate = useNavigate();
    // Preview Product
    const [loading, setLoading] = useState(false);
    const [previewProducts, setPreviewProducts] = useState([]);
    const [previewTotal, setPreviewTotal] = useState(0);
    
    // Modal
    const { activeModal, closeModal } = useModalStore();
    const isOpen = activeModal === "search";
    
    // Search Filter
    const [ searchParams, setSearchParams ] = useSearchParams();
    const [ searchValue, setSearchValue ] = useState();
    const debounceValue = useDebounce(searchValue, 500);

    useEffect(() => {
        if (!isOpen) {
            setPreviewProducts([]);
            setPreviewTotal(0);
            setSearchValue(""); // also clear the input value
        }
    }, [isOpen]);
    
    useEffect(() => {  
        if(!debounceValue) return;
        
        const fetchPreview = async () => {
            setLoading(true);
            const res = await fetch(`/api/products?limit=3&search=${debounceValue}`);
            const data = await res.json();
            setPreviewProducts(data.data);
            setPreviewTotal(data.pagination.totalProduct);
            setLoading(false);
        }
        
        fetchPreview()
    }, [debounceValue])

    const hasMore = previewTotal > previewProducts.length; 
    
    const handleSeeAll = () => {
        closeModal();
        navigate(`/shop?page=1&search=${searchValue}`) // WHy not debounce value here ?
    }


    return (
        <div className={`search-overlay ${isOpen ? "search-overlay--open" : ""}`}>
        <div className="search-overlay__inner">

            {/* ── Input row ── */}
            <div className="search-overlay__input-row">
            <Search size={20} strokeWidth={1.5} className="search-overlay__input-icon" />
            <input
                className="search-overlay__input"
                type="text"
                placeholder="Search for a product..."
                value ={searchValue || ""}
                onChange={(e) => setSearchValue(e.target.value)}
                autoFocus={isOpen}
            />
            <button
                className="search-overlay__close-btn"
                onClick={closeModal}
                aria-label="Close search"
            >
                <X size={20} strokeWidth={1.5} />
            </button>
            </div>

            {/* ── Results ── */}
            <div className="search-overlay__results">

            {/* Results count label */}
            <p className="search-overlay__results-label">
                Showing {previewProducts.length} of {previewTotal} results
            </p>

            {/* Vertical list */}
            <div className="search-overlay__results-list">
                {previewProducts.map((product) => (
                <div
                    state = { product }
                    key={product._id} 
                    className="search-result-card"
                    onClick={() => {
                        closeModal(); 
                        navigate(`/shop/${product._id}`)
                    }}
                >

                    <div className="search-result-card__image-wrap">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="search-result-card__image"
                    />
                    </div>

                    <div className="search-result-card__info">
                    <span className="search-result-card__category">{product.category}</span>
                    <h4 className="search-result-card__name">{product.name}</h4>
                    </div>

                    <span className="search-result-card__price">
                    ${product.price.toFixed(2)}
                    </span>

                    <ArrowRight
                    size={16}
                    strokeWidth={1.5}
                    className="search-result-card__arrow"
                    />

                </div>
                ))}
            </div>

            {/* See all results — only when more than 6 */}
            {hasMore && (
                <div className="search-overlay__see-all">
                <button 
                    className="search-overlay__see-all-btn"
                    onClick={() => handleSeeAll()}
                >
                    See all {previewTotal} results
                    <ArrowRight size={14} strokeWidth={1.5} />
                </button>
                </div>
            )}

            </div>

        </div>
        </div>
    );
}