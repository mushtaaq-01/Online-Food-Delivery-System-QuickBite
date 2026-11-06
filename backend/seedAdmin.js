import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import userModel from "./models/userModel.js";
import foodModel from "./models/foodModel.js";

const sampleFoods = [
  { name: "Greek salad", image: "1722865444288food_1.png", price: 12, description: "Food provides essential nutrients for overall health and well-being", category: "Salad" },
  { name: "Veg salad", image: "1722865514626food_2.png", price: 18, description: "Food provides essential nutrients for overall health and well-being", category: "Salad" },
  { name: "Clover Salad", image: "1722865628915food_3.png", price: 16, description: "Food provides essential nutrients for overall health and well-being", category: "Salad" },
  { name: "Chicken Salad", image: "1722865668073food_4.png", price: 24, description: "Food provides essential nutrients for overall health and well-being", category: "Salad" },
  { name: "Lasagna Rolls", image: "1722865738489food_5.png", price: 14, description: "Food provides essential nutrients for overall health and well-being", category: "Rolls" },
  { name: "Peri Peri Rolls", image: "1722865934153food_6.png", price: 12, description: "Food provides essential nutrients for overall health and well-being", category: "Rolls" },
  { name: "Chicken Rolls", image: "1722865976487food_7.png", price: 20, description: "Food provides essential nutrients for overall health and well-being", category: "Rolls" },
  { name: "Veg Rolls", image: "1722866043779food_8.png", price: 15, description: "Food provides essential nutrients for overall health and well-being", category: "Rolls" },
  { name: "Ripple Ice Cream", image: "1722866109947food_9.png", price: 14, description: "Food provides essential nutrients for overall health and well-being", category: "Deserts" },
  { name: "Fruit Ice Cream", image: "1722866148130food_10.png", price: 22, description: "Food provides essential nutrients for overall health and well-being", category: "Deserts" },
  { name: "Jar Ice Cream", image: "1722866329894food_11.png", price: 10, description: "Food provides essential nutrients for overall health and well-being", category: "Deserts" },
  { name: "Vanilla Ice Cream", image: "1722866385025food_12.png", price: 12, description: "Food provides essential nutrients for overall health and well-being", category: "Deserts" },
  { name: "Chicken Sandwich", image: "1722866412882food_13.png", price: 12, description: "Food provides essential nutrients for overall health and well-being", category: "Sandwich" },
  { name: "Vegan Sandwich", image: "1722866469319food_14.png", price: 18, description: "Food provides essential nutrients for overall health and well-being", category: "Sandwich" },
  { name: "Grilled Sandwich", image: "1722866504992food_15.png", price: 16, description: "Food provides essential nutrients for overall health and well-being", category: "Sandwich" },
  { name: "Bread Sandwich", image: "1722866560218food_16.png", price: 24, description: "Food provides essential nutrients for overall health and well-being", category: "Sandwich" },
  { name: "Cup Cake", image: "1722866610567food_17.png", price: 14, description: "Food provides essential nutrients for overall health and well-being", category: "Cake" },
  { name: "Vegan Cake", image: "1722866647952food_18.png", price: 12, description: "Food provides essential nutrients for overall health and well-being", category: "Cake" },
  { name: "Butterscotch Cake", image: "1722866694357food_19.png", price: 20, description: "Food provides essential nutrients for overall health and well-being", category: "Cake" },
  { name: "Sliced Cake", image: "1722866729053food_20.png", price: 15, description: "Food provides essential nutrients for overall health and well-being", category: "Cake" },
  { name: "Garlic Mushroom", image: "1722866777756food_21.png", price: 14, description: "Food provides essential nutrients for overall health and well-being", category: "Pure Veg" },
  { name: "Fried Cauliflower", image: "1722866830901food_22.png", price: 22, description: "Food provides essential nutrients for overall health and well-being", category: "Pure Veg" },
  { name: "Mix Veg Pulao", image: "1722866871307food_23.png", price: 10, description: "Food provides essential nutrients for overall health and well-being", category: "Pure Veg" },
  { name: "Rice Zucchini", image: "1722866909328food_24.png", price: 12, description: "Food provides essential nutrients for overall health and well-being", category: "Pure Veg" },
  { name: "Cheese Pasta", image: "1722866948105food_25.png", price: 12, description: "Food provides essential nutrients for overall health and well-being", category: "Pasta" },
  { name: "Tomato Pasta", image: "1722867018540food_26.png", price: 18, description: "Food provides essential nutrients for overall health and well-being", category: "Pasta" },
  { name: "Creamy Pasta", image: "1722867053413food_27.png", price: 16, description: "Food provides essential nutrients for overall health and well-being", category: "Pasta" },
  { name: "Chicken Pasta", image: "1722867110108food_28.png", price: 24, description: "Food provides essential nutrients for overall health and well-being", category: "Pasta" },
  { name: "Buttter Noodles", image: "1722867144188food_29.png", price: 14, description: "Food provides essential nutrients for overall health and well-being", category: "Noodles" },
  { name: "Veg Noodles", image: "1722867222977food_30.png", price: 12, description: "Food provides essential nutrients for overall health and well-being", category: "Noodles" },
  { name: "Somen Noodles", image: "1722867254829food_31.png", price: 20, description: "Food provides essential nutrients for overall health and well-being", category: "Noodles" },
  { name: "Cooked Noodles", image: "1722867630288food_32.png", price: 15, description: "Food provides essential nutrients for overall health and well-being", category: "Noodles" },
];

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/food-del";
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB for data seeding...");

    // 1. Seed Admin
    const adminEmail = process.env.ADMIN_EMAIL || "admin@quickbite.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    const adminName = process.env.ADMIN_NAME || "Administrator";

    const existingUser = await userModel.findOne({ email: adminEmail });
    if (!existingUser) {
      const saltRounds = Number(process.env.SALT) || 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);

      const adminUser = new userModel({
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
        cartData: {},
      });
      await adminUser.save();
      console.log(`Created admin user: ${adminEmail} (password: ${adminPassword})`);
    } else {
      if (existingUser.role !== "admin") {
        existingUser.role = "admin";
        await existingUser.save();
        console.log(`Updated user ${adminEmail} to admin role.`);
      } else {
        console.log(`Admin user ${adminEmail} already exists.`);
      }
    }

    // 2. Seed Foods if collection is empty
    const foodCount = await foodModel.countDocuments();
    if (foodCount === 0) {
      await foodModel.insertMany(sampleFoods);
      console.log(`Successfully seeded ${sampleFoods.length} sample food items into the database.`);
    } else {
      console.log(`Food items already exist (${foodCount} items). Skipping food seed.`);
    }

    console.log("==================================================");
    console.log(" Seeding completed successfully!");
    console.log(` Admin:    ${adminEmail} / ${adminPassword}`);
    console.log(` Foods:    ${await foodModel.countDocuments()} items in database`);
    console.log("==================================================");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Error during database seeding:", error.message);
    process.exit(1);
  }
};

seedData();
