import mongoose from "mongoose";
import "dotenv/config";
import productModel from "../models/productModel.js";
import { plantsData } from "../data/plantsSeedData.js";

const seedDatabase = async () => {
  try {
    // Kết nối database
    await mongoose.connect(`${process.env.MONGODB_URI}/vuonlanho`);
    console.log("✅ Connected to MongoDB");

    // Xóa dữ liệu cũ (tùy chọn)
    // await productModel.deleteMany({});
    // console.log("🗑️  Cleared existing products");

    // Thêm dữ liệu mới
    const products = await productModel.insertMany(plantsData);
    console.log(`✅ Successfully added ${products.length} plants to database`);

    // Hiển thị danh sách
    console.log("\n📋 Added plants:");
    products.forEach((plant, index) => {
      console.log(`${index + 1}. ${plant.name} - ${plant.price.toLocaleString('vi-VN')}đ`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
