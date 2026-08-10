import React, { useEffect, useState } from "react";

import HeroSection from '../components/home/HeroSection'
import Categories from "../components/home/Categories";
import NewArrivals from "../components/home/NewArrivals";
import OurStory from "../components/home/OurStory";
import NewsLetter from "../components/home/NewsLetter";


export default function HomePage() {
  const [newArrivals, setNewArrivals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNewArrival = async () => {
    try {
      const url = `/api/products?sortBy=newest&limit=4`
      const res = await fetch(url);
      if(!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();

      setNewArrivals(data.data);

    } catch (error) {
      console.error(error)
    }
  } 

  // Use effect will run once the component is rendered
  useEffect(() => {
    let cancelled = false;

    const loadProducts = async () => {
      setIsLoading(true);
      try {
        await fetchNewArrival(); // on load fetch page 1
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    loadProducts();
    return () => {
      cancelled = true;
    };
  }, []); // The dependency array
  

  return (
    <div className="lumina-home">
      <main>
        <HeroSection />
        <Categories />
        <NewArrivals products={newArrivals} isLoading={isLoading}/>
        <OurStory />
        <NewsLetter />
      </main>
    </div>
  );
}