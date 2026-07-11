import ProductCard from "./ProductCard.jsx";

import { useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react'
import useProductStore from '../../store/product.js'

export default function ProductGrid() {

    const { products, totalPages, totalProduct, fetchProduct } = useProductStore();

    const [ searchParams, setSearchParams ] = useSearchParams();

    const pageNum = parseInt(searchParams.get("page")) || 1;
    const category = searchParams.get("category") || '';
    const sortBy = searchParams.get("sortBy") || '';
    const search = searchParams.get("search") || '';

    // Use effect will run once the component is rendered
    useEffect(() => {
        fetchProduct( { pageNum, category, sortBy, search } ); // on load fetch page 1
    }, [ pageNum, category, sortBy, search ]) // The dependency array

    const handlePageChange =  (newPage) => {
      setSearchParams({
          ...Object.fromEntries(searchParams),
          page: newPage
      })
    }

    return (
      <section className="product-grid__section">

        {/* ── Cards ── */}
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {/* ── Load more ── */}
        <div className="pagination-container">
            
            <span className="show-result">{Math.min(pageNum * 9, totalProduct)} of {totalProduct} Results</span>

            <div className='pagination'>

                {/* Previous Button */}
                <button 
                    className='arrow-btn'
                    disabled={pageNum === 1}
                    onClick={() => handlePageChange(pageNum - 1)}
                >&lt;</button>

                {/* Page Numbers */}
                {Array.from({length: totalPages}, (_, i) => i + 1).map((page) =>(
                        // Page button
                        <button
                            key={page}
                            className={`pagination-btn ${pageNum === page ? 'active' : ''}`}
                            onClick={() => handlePageChange(page)}
                        >{page}</button>
                    ))
                }

                {/* Next Button */}
                <button 
                    className='arrow-btn'
                    disabled={pageNum === totalPages}
                    onClick={() => handlePageChange(pageNum + 1)}
                >&gt;</button>
                
            </div>

        </div>

      </section>
    );
}