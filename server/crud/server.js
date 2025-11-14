import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB 
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Schema & Model
const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true }
});

const Item = mongoose.model("Item", ItemSchema);

// Create
app.post("/items", async (req, res) => {
  try {
    const item = new Item({ name: req.body.name });
    await item.save();
    res.json({ message: "Item created", item });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read
app.get("/items", async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

// Update
app.put("/items/:id", async (req, res) => {
  try {
    const updated = await Item.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete
app.delete("/items/:id", async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
