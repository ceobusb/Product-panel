const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const ProductRoutes = require("./routes/productRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5051;

app.use(cors());
app.use(express.json());

app.get("/",(req,res)=>{
  res.send(("Product Admin Apı çalışıyor"));
});

app.use("/api/products",ProductRoutes);

app.listen(PORT,"127.0.0.1",()=>{
  console.log(`Server http://127.0.0.1:${PORT} adresinde calisiyor`);
});
