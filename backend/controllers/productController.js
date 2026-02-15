import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";
// function for add product
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      difficulty,
      light,
      price,
      bestseller,
    } = req.body;

    // Xử lý size - có thể là array hoặc string
    let size = req.body.size;
    if (typeof size === "string") {
      size = [size];
    }

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];
    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined,
    );

    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      }),
    );
    const productData = {
      name,
      description,
      category,
      difficulty,
      light,
      price: Number(price),
      size: size || [],
      bestseller: bestseller === "true" ? true : false,
      image: imagesUrl,
      date: Date.now(),
    };
    console.log(productData);
    const product = new productModel(productData);
    await product.save();

    res.json({ success: true, message: "Product Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// function for list product
const listProduct = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// function for remove product
const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Product Removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const {
      id,
      name,
      description,
      category,
      difficulty,
      light,
      price,
      bestseller,
    } = req.body;

    let size = req.body.size;
    if (typeof size === "string") {
      size = [size];
    }

    const updateData = {
      name,
      description,
      category,
      difficulty,
      light,
      price: Number(price),
      bestseller: bestseller === "true" ? true : false,
    };

    if (size && size.length > 0) {
      updateData.size = size;
    }

    const image1 = req.files?.image1 && req.files.image1[0];
    const image2 = req.files?.image2 && req.files.image2[0];
    const image3 = req.files?.image3 && req.files.image3[0];
    const image4 = req.files?.image4 && req.files.image4[0];
    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined,
    );

    if (images.length > 0) {
      let imagesUrl = await Promise.all(
        images.map(async (item) => {
          let result = await cloudinary.uploader.upload(item.path, {
            resource_type: "image",
          });
          return result.secure_url;
        }),
      );
      updateData.image = imagesUrl;
    }

    await productModel.findByIdAndUpdate(id, updateData);
    res.json({ success: true, message: "Product Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// function for single product info
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);
    res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// funcition for get product from suggest AI
const suggestProduct = async (req, res) => {
  try {
    const { spaceDesc, preferences } = req.body;

    const regexSpace = new RegExp(spaceDesc, "i");
    const regexPref = new RegExp(preferences, "i");
    const products = await productModel
      .find({
        $or: [
          { description: regexSpace },
          { description: regexPref },
          { category: regexPref },
          { difficulty: regexPref },
          { light: regexPref },
        ],
      })
      .limit(10);
    res.json(products);
  } catch (error) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export {
  listProduct,
  addProduct,
  removeProduct,
  singleProduct,
  suggestProduct,
  updateProduct,
};
