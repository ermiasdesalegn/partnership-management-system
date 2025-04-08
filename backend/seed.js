// seed.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Request from "./models/Request.js";

dotenv.config();

// Connect to your MongoDB
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/your_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

async function seed() {
  try {
    // Clear existing data
    await User.deleteMany();
    await Request.deleteMany();

    // Create users
    const users = await User.insertMany([
      {
        name: "Abebe Internal",
        email: "abebe.internal@example.com",
        type: "internal"
      },
      {
        name: "Almaz External",
        email: "almaz.external@example.com",
        type: "external"
      },
      {
        name: "Dawit Internal",
        email: "dawit.internal@example.com",
        type: "internal"
      }
    ]);

    // Create requests linked to users
    await Request.insertMany([
      {
        userRef: users[0]._id,
        type: "internal",
        status: "Pending",
        frameworkType: "MOU",
        department: "Finance",
        lawRelated: false,
        companyDetails: {
          name: "Ethio Telecom",
          type: "Government",
          email: "ethio@telecom.et",
          phone: "0911000000",
          address: "Addis Ababa"
        }
      },
      {
        userRef: users[1]._id,
        type: "external",
        status: "In Review",
        frameworkType: "Contract",
        department: "ICT",
        lawRelated: true,
        companyDetails: {
          name: "Safaricom",
          type: "Private",
          email: "info@safaricom.et",
          phone: "0911222333",
          address: "Nairobi, Kenya"
        }
      },
      {
        userRef: users[2]._id,
        type: "internal",
        status: "Approved",
        frameworkType: "MOA",
        department: "Research",
        lawRelated: false,
        companyDetails: {
          name: "Bahir Dar University",
          type: "Government",
          email: "contact@bdu.edu.et",
          phone: "0582200000",
          address: "Bahir Dar"
        }
      },
      {
        userRef: users[1]._id,
        type: "external",
        status: "Pending",
        frameworkType: "Other",
        department: "Legal",
        lawRelated: true,
        companyDetails: {
          name: "UNDP Ethiopia",
          type: "Non-Government",
          email: "admin@undp.org",
          phone: "0933222444",
          address: "UN Headquarters, Addis"
        }
      }
    ]);

    console.log("🌱 Seeded users and requests successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding:", err);
    process.exit(1);
  }
}

seed();
