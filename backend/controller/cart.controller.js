import User from "../models/user.model.js";

// This end point get both cart item and user info
export const getSessionData = async (req, res) => {
    const user = req.user;

    try {
        await user.populate("cartItems.product");

        //cartItems shape
        //cartItems: [
        //     { quantity: 2, product: { name: "Rose Serum", price: 45, image: "..." } },
        //     { quantity: 1, product: { name: "Face Cream", price: 30, image: "..." } }
        // ]
        
        res.status(200).json({ success: true, data: {
            cart: user.cartItems, 
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role
            }
        }});
        
    } catch (error) {
        console.log("Error in getting cart products: ", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const addToCart = async (req, res) => {
    const { productId, quantity = 1 } = req.body;
    const user = req.user;

    try {
        const existingItem = user.cartItems.find(item => item.product.toString() === productId);
        if(existingItem){
            existingItem.quantity += quantity;
        }else{
            user.cartItems.push({product: productId, quantity})
        }
    
        await user.save();
        await user.populate("cartItems.product");

        res.status(200).json({ success: true, data: { cart: user.cartItems } });
        
    } catch (error) {
        console.log("Error in add to cart: ", error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const updateQuantity = async (req, res) => {
    const {id: productId} = req.params;
    const { quantity } = req.body;
    const user = req.user;

    try {
        const existingItem = user.cartItems.find(item => item.product.toString() === productId);

        if (!existingItem) {
            return res.status(404).json({ success: false, message: "Item not found in cart" });
        }

        if(quantity > 10){
            return res.status(400).json({ success: false, message: "Item quantity exceed limit!"})
        }

        else if (quantity <= 0) {
            user.cartItems = user.cartItems.filter(item => item.product.toString() !== productId);

        } else {
            existingItem.quantity = quantity;
        }

        await user.save();
        await user.populate("cartItems.product");

        res.status(200).json({ success: true, data: { cart: user.cartItems } });

    } catch (error) {
        console.log("Error in updating quantity: ", error.message)
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const removeFromCart = async (req, res) => {
    const {id: productId} = req.params;
    const user = req.user;

    try {
        user.cartItems = user.cartItems.filter(item => item.product.toString() !== productId);
        await user.save();
        await user.populate("cartItems.product");

        res.status(200).json({ success: true, data: { cart: user.cartItems } });

    } catch (error) {

        console.log("Error in removing item: ", error.message)
        return res.status(500).json({ success: false, message: error.message });

    }
}

export const removeAllFromCart = async (req, res) => {
    const user = req.user;
    try {
        user.cartItems = [];
        await user.save();
    
        res.status(200).json({ success: true, data: { cart: user.cartItems } });
        
    } catch (error) {
        console.log("Error in clearing cart: ", error.message)
        return res.status(500).json({ success: false, message: error.message });
    }
}