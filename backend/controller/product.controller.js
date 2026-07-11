import Product from "../models/product.model.js";
import mongoose from "mongoose";
import redis from "../config/redis.js";
import cloudinary from "../config/cloudinary.js";


// controller handle HTTP request/response
// services handle the actual business logic

export const getProducts = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    //Filter
    const category = req.query.category || "";
    const search = req.query.search || "";
    const sortBy = req.query.sortBy || "";
    const exclude = req.query.exclude || "";

    // Empty Object
    const sortObject = {};
    const filter = {};

    // Exclude
    if (exclude) {
      const ids = exclude.split(",").filter(id => mongoose.Types.ObjectId.isValid(id));
      if (ids.length > 0) {
        filter._id = { $nin: ids.map(id => new mongoose.Types.ObjectId(id)) };
      }
    }

    // Filtering and Exclude
    if (category) filter.category = category;

    // Partial Search Match
    if (search) filter.name = { $regex: search, $options: "i" };

    // Sort
    if (sortBy === "newest") sortObject.createdAt = -1;
    else if (sortBy === "oldest") sortObject.createdAt = 1;
    else if (sortBy === "price-asc") sortObject.price = 1;
    else if (sortBy === "price-desc") sortObject.price = -1;


    const cacheKey = `product:${page}:${limit}:${category}:${search}:${sortBy}:${exclude}`;
    const cached = await redis.get(cacheKey);
    if(cached){
      return res.status(200).json(JSON.parse(cached))
    }

    const products = await Product.find(filter)
      .sort(sortObject)
      .skip(skip)
      .limit(limit)
      .lean();
    const totalProduct = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProduct / limit);

    const responseData = {
      success: true,
      data: products,
      pagination: {
        totalPages, // total pages
        totalProduct, // total products
      },
    }
    // Store in redis for future access
    if(products.length > 0){
      await redis.set(cacheKey, JSON.stringify(responseData), "EX", 3600) // 1 hour
    }

    res.status(200).json(responseData);

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductbyId = async (req, res) => {
  const { id } = req.params;
  
  // Validate ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid product ID" });
  }

  try{
    // Check cached first
    const cacheKey = `product:${id}`;
    const cached = await redis.get(cacheKey);
    if(cached){
      return res.status(200).json(JSON.parse(cached)) // { success: true, data: products}
    }

    const products = await Product.findById(id).lean();
    if(!products){
      return res.status(404).json({success: false, message: 'Product ID not found!'})
    }

    // The response data store in redis
    const responseData = {success: true, data: products}
    // Store in cached for future access
    await redis.set(cacheKey, JSON.stringify(responseData), "EX", 3600) // 1 hour

    res.status(200).json(responseData);
    // { success: true, data: products};

  }catch (error){
    res
      .status(500)
      .json({success: false, message: 'Unable to find product ID!'})
  }
}

export const createProduct = async (req, res) => {
  const product = req.body; // user will send this data
  if (
    !product.name ||
    !product.price ||
    !product.image ||
    !product.category ||
    product.price < 0
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Please provide a valid name, price, image, and category for the product",
    });
  }

  try {
    const cloudinaryResponse = await cloudinary.uploader.upload(product.image, {folder: "products"});
    
    const newProduct = new Product({
      ...product,
      image: cloudinaryResponse.secure_url,
      imagePublicId: cloudinaryResponse.public_id 
    }); // create a new product instance

    await newProduct.save(); //save the product to mongodb

    // clear all product caches since list changed
    const keys = await redis.keys("product:*"); // Search for every keys that start with product:
    if (keys.length > 0) await redis.del(...keys);

    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    console.error("Error in creating product:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Server error while creating product" });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid product ID" });
  }

  try {
    const product = await Product.findById(id);
    if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
    }

    if(product.imagePublicId){
      try {
        await cloudinary.uploader.destroy(product.imagePublicId)
        
      } catch (error) {
        console.log("Cloudinary deleted failed: ", error.message);
      }
    }

    await Product.findByIdAndDelete(id);

    // clear all product caches since list changed
    const keys = await redis.keys("product:*"); // Search for every keys that start with product:
    if (keys.length > 0) await redis.del(...keys);

    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error in deleting product:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Server error while deleting product" });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const product = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid product ID" });
  }
  
  try {
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    const isNewImage = product.image && !product.image.startsWith("https://res.cloudinary.com");
    let updateData = { ...product };

    if(isNewImage){
      try {
        await cloudinary.uploader.destroy(existingProduct.imagePublicId);
        
      } catch (error) {
        console.log("Cloudinary delete failed: ", error.message);
      }
      
      const cloudinaryResponse = await cloudinary.uploader.upload(product.image, {folder: "products"});

      updateData = {
          ...req.body,
          image: cloudinaryResponse.secure_url,
          imagePublicId: cloudinaryResponse.public_id
      };
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    }); // find product and update in mongo

    // clear all product caches since list changed
    const keys = await redis.keys("product:*"); // Search for every keys that start with product:
    if (keys.length > 0) await redis.del(...keys);

    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    console.error("Error in updating product:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Server error while updating product" });
  }
};
