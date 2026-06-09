const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const getProducts = async (req,res)=>{
  try {
    const products = await prisma.product.findMany({
      orderBy:{
        createdAt:"desc",
      },
    });
    return res.status(200).json(products);
  } catch (error){
    console.error("ürünleri getirme hatası",error);
    return res.status(500).json({
      message : "sunucu hatası",
    });
  }
}
const createProduct = async (req,res)=>{
  try {
    const {name,description,price,stock} = req.body;
    if(!name || price=== undefined || stock === undefined){
      return res.status(400).json({
        message : "Name ,price ve stok zorunludur",
      });
    }
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price:Number(price),
        stock:Number(stock),
      }
    });
    return  res.status(201).json({
      message : "Urun Başarıyla eklendi",
      product : newProduct,
    })
  }catch (error){
    console.error("Ürün kayıt hatası",error);
    return res.status(500).json({
      message:"Sunucu Hatası",
    });
  }
}
const updateProduct = async (req,res)=>{
  try {
    const { id } = req.params;
    const {name,description,price,stock}= req.body;
    const updateProduct = await  prisma.product.update({
      where : {
        id:Number(id),
      },
      data:{
        name,
        description,
        price:Number(price),
        stock :Number(stock),
      },
    });
    return res.status(200).json({
      message:"Ürün başarıyla güncellendi",
      product:updateProduct,
    });
  }catch (error){
    console.error("güncelleme hatası",error);
    return res.status(500).json({
      message : "Sunucu Hatası",
    });
  }
}

const deleteProduct = async (req,res)=>{
  try {
    const { id } = req.params;
    await prisma.product.delete({
      where:{
        id : Number(id),
      },
    });
    return res.status(200).json({
      message : "Ürün Başarıyla silindi"
    });

  }catch (error){
    console.error("silme hatası",error);
    return res.status(500).json({
      message: "Sunucu Htası"
    });
  }
}

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
