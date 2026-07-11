const THUMBNAILS = [
  {
    id: 1,
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCR2T0YtUNLocVkrGVPIHGdHjyEnJH7EWKFildTrrlTRi-oLntWIjcKLMX-YB5smxiOuGfm2svEH9jnNKf5K0B6Norf3B3vnt91-oPWpKi5lLZv4HC1u0N_u2eYlAZWF1zOg_csEQN32dUV1p5mPP4MLxf-vYQW8yMQ4koOZQRwleloYtd3g_7UquoGMJLk2jwQgw8MtXXzN6aNa2zZi4HcsMDbHZjIbAuNPf-9XVe_pHv8urTedLA87Vghg7ulx4NDJVKF9x6CL1uT",
    alt: "Radiant Vitamin C Serum bottle",
  },
  {
    id: 2,
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCNpPZsDQ7hyP7rzZ2q2xOWqrejMyA8gmcLcq1Okd8nqxcWCyvtKrmPubJHsoUtJi1o-048TefT3QuN-hWd_bZ1X4YwnB0pbmAFLgR6h2aXQbbEpfZnHiS4YDMNSR2obiamyP7nmzhwI-x2N8O3QKFtnRGyG0AlRWNMaQimsbNXKrDpxk6sCLvGBOqsfmmJpzz8Wu396nc64pINA7vMQlSqqeUhkwhSpBTAd-Qut8C1Qwm32N6BvGU-Qd7uFH7fPQt9DTq84Q3mJPDj",
    alt: "View 1",
  },
  {
    id: 3,
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBrAC4AaUgqa6MpyHIUTcendABArPSiayT14NMqOQnoU95VTm3L1YgwwZzO6IAttrTSRTTyJpGVk7f-uxsxNOq0kU8NRyyMg4ZflbyftGc5zNF3o_hadh7PEm7OaTJpdYj0kc1f15t4tURnLJiBeitHjvp4Q2fEjzYBUVvpapPAnBY08d_LZDTzhOfal0TdsPh6N2uprbmPJBvZKpdaW3iqlG0nAMVS7vnR41SWjljHpmpMk64zpF6GuzuS3xEIPEvqsnxInnxeJsv7",
    alt: "View 2",
  },
  {
    id: 4,
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDnvapiY_jP--gkrn5QF_cROtA431GO8Wg9F-2tEje5kbm2uLVHNRwHsopCIYmnsTmNERNgEZMv2OfFBUg2zhIzZwoTxEFfLasgF5TqmQmD_MxM57NWwJ1fUjh9vBii2m24_nEWE_Rs2LIER1NA6An3YT01bDLdpXGLInI9lTp_7u28dnUvzeHtB7d20tkajr7m9ZvWPIfyQYoOaBBKtTei3VEvO7F6dnG-ooOcFwRhe4aacJMsH5UEyoX1WNk2ZEDSfwqSz5GNAsjn",
    alt: "View 3",
  },
];

export default function ProductGallery( {images} ) {
  return (
    <div className="product-gallery">

      {/* ── Main image ── */}
      <div className="product-gallery__main">
        <img
          src={images}
          alt='product_images'
          className="product-gallery__main-image"
        />
        <div className="product-gallery__main-overlay" />
      </div>

      {/* ── Thumbnails ── */}
      <div className="product-gallery__thumbs">
        {THUMBNAILS.map((thumb, index) => (
          <button
            key={thumb.id}
            className={`product-gallery__thumb-btn ${
              index === 0 ? "product-gallery__thumb-btn--active" : ""
            }`}
          >
            <img src={thumb.src} alt={thumb.alt} className="product-gallery__thumb-image" />
          </button>
        ))}
      </div>

    </div>
  );
}