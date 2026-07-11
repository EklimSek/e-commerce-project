import { create } from 'zustand';

const useProductStore = create((set) => ({

    products: [],
    setProducts: (products) => set({ products }), 
    loading: false,

    // Recommend Product
    recommendedProducts: [],

    // Pages
    totalPages: 1,
    totalProduct: 0,

    // Fetch Product
    fetchProduct: async ({ pageNum = 1, limit = 9, category = '', sortBy = '', search = '' }) => {
        try{
            set({loading: true}) 
    
            const url = `/api/products?page=${pageNum}&limit=${limit}${category ? `&category=${category}` : ""}${sortBy ? `&sortBy=${sortBy}` : ""}${search ? `&search=${search}` : ""}`;
    
            const res = await fetch(url);
            if(!res.ok) throw new Error("Failed to fetch products");
            const data = await res.json();

            set({
                products: data.data,
                totalPages: data.pagination.totalPages,
                totalProduct: data.pagination.totalProduct,
                loading: false
            })

        }catch(error){
            console.error(error)
            set({loading: false})
        }
    },
    // Recommend Product
    fetchRecommend: async({ category = '', exclude = []}) => {
        try{
            set({loading: true})
            set({recommendedProducts: []})
            const url = `/api/products?${category ? `&category=${category}` : ""}&${exclude.length > 0 ? `&exclude=${exclude.toString()}` : ""}&limit=4`
            const res = await fetch(url)
            if(!res.ok) throw new Error("Failed to fetch recommended products")
            const data = await res.json();
    
            set({
                recommendedProducts: data.data,
                loading: false
            })

        }catch(error){
            console.error(error);
            set({loading: false})
        }
    },

    // Create Product
    createProduct: async (newProduct) => {
        // Post this to the Database
        try{
            const res = await fetch("/api/products", {
                method:"POST",
                headers:{
                "Content-Type": "application/json"
                },
                body:JSON.stringify(newProduct)
            })
            const data = await res.json() 
            // Updating the state
            if(!res.ok || !data.success) return {success: false, message: "Unable to create product!!"}
            
            set((state) => ({products: [...state.products, data.data]}))
            return {success: true, message: "Creating product successfully!!"}

        }catch(error){
            console.error(`Erorr in creating new products: ${error}`)
        }
    }

}))

export default useProductStore;