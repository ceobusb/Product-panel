import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Space,
  Table,
  Checkbox,
  Dropdown,
  Typography,
  message,
} from "antd";




const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

function App() {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleColumns, setVisibleColumns] = useState([
    "name",
    "description",
    "price",
    "stock",
    "createdAt",
    "actions",
  ]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [form] = Form.useForm();




  const getProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://127.0.0.1:5051/api/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      message.error("Urunler alinirken hata olustu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    form.setFieldsValue({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
    });
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    try {
      const url = editingProduct
        ? `http://127.0.0.1:5051/api/products/${editingProduct.id}`
        : "http://127.0.0.1:5051/api/products";

      const method = editingProduct ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        message.error(data.message || "Islem basarisiz");
        return;
      }

      message.success(
        editingProduct
          ? "Urun basariyla guncellendi"
          : "Urun basariyla eklendi"
      );

      setIsModalOpen(false);
      setEditingProduct(null);
      form.resetFields();
      getProducts();
    } catch (error) {
      message.error("Islem sirasinda hata olustu");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:5051/api/products/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        message.error(data.message || "Silme islemi basarisiz");
        return;
      }

      message.success("Urun basariyla silindi");
      getProducts();
    } catch (error) {
      message.error("Silme sirasinda hata olustu");
    }
  };

  const filteredProducts = products.filter((product) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      product.name.toLowerCase().includes(search) ||
      (product.description || "").toLowerCase().includes(search) ||
      String(product.price).includes(search) ||
      String(product.stock).includes(search);

    const matchesPrice =
      (minPrice === "" || product.price >= Number(minPrice)) &&
      (maxPrice === "" || product.price <= Number(maxPrice));

    return matchesSearch && matchesPrice;
  });

  const exportToExcel = () => {
    const excelData = filteredProducts.map((product) => ({
      ID: product.id,
      "Urun Adi": product.name,
      Aciklama: product.description || "-",
      Fiyat: product.price,
      Stok: product.stock,
      "Olusturma Tarihi": new Date(product.createdAt).toLocaleString("tr-TR"),
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Urunler");
    XLSX.writeFile(workbook, "urunler.xlsx");
  };

  const allColumns = [
    {
      title: "Urun Adi",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Aciklama",
      dataIndex: "description",
      key: "description",
      render: (text) => text || "-",
    },
    {
      title: "Fiyat",
      dataIndex: "price",
      key: "price",
      render: (price) => `${price} TL`,
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Stok",
      dataIndex: "stock",
      key: "stock",
      sorter: (a, b) => a.stock - b.stock,
    },
    {
      title: "Olusturma Tarihi",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleString("tr-TR"),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: "Islemler",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => openEditModal(record)}>
            Duzenle
          </Button>

          <Popconfirm
            title="Bu urunu silmek istiyor musun?"
            okText="Evet"
            cancelText="Hayir"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger>Sil</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  const columns = allColumns.filter((column) =>
    visibleColumns.includes(column.key || column.dataIndex)
  );
  const columnMenu = {
    items: allColumns.map((col) => ({
      key: col.key || col.dataIndex,
      label: (
        <Checkbox
          checked={visibleColumns.includes(col.key || col.dataIndex)}
          onChange={(e) => {
            const key = col.key || col.dataIndex;

            if (e.target.checked) {
              setVisibleColumns((prev) => [...prev, key]);
            } else {
              setVisibleColumns((prev) => prev.filter((item) => item !== key));
            }
          }}
        >
          {col.title}
        </Checkbox>
      ),
    })),
  };

  return (
    <div className="page">
      <div className="panel">
        <div className="hero">
          <Text className="eyebrow">React + Node.js + Prisma + Ant Design</Text>
          <Title level={1}>Product Admin Panel</Title>
          <Paragraph className="hero-text">
            Urun listeleme, ekleme, guncelleme ve silme islemlerini yoneten
            modern bir CRUD paneli.
          </Paragraph>
        </div>

        <div className="top-bar">
          <div className="filters">
            <Input
              placeholder="Urun ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: 220 }}
            />

            <Input
              type="number"
              placeholder="Min fiyat"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              style={{ width: 140 }}
            />

            <Input
              type="number"
              placeholder="Max fiyat"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              style={{ width: 140 }}
            />
          </div>

          <div className="top-actions">
            <Button onClick={exportToExcel}>Excel'e Aktar</Button>
            <Button type="primary" size="large" onClick={openAddModal}>
              Yeni Urun Ekle
            </Button>
            <Dropdown menu={columnMenu} trigger={["click"]}>
              <Button>Kolonlari Sec</Button>
            </Dropdown>
          </div>
        </div>

        <Card className="table-card">
          <Table
            rowKey="id"
            columns={columns}
            dataSource={filteredProducts}
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50", "100", String(products.length)],
              showTotal: (total) => `Toplam ${total} kayit`,
            }}
          />
        </Card>

        <Modal
          title={editingProduct ? "Urunu Duzenle" : "Yeni Urun Ekle"}
          open={isModalOpen}
          onCancel={handleCancel}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              label="Urun Adi"
              name="name"
              rules={[{ required: true, message: "Urun adi zorunludur" }]}
            >
              <Input placeholder="Urun adi giriniz" />
            </Form.Item>

            <Form.Item label="Aciklama" name="description">
              <TextArea rows={4} placeholder="Aciklama giriniz" />
            </Form.Item>

            <Form.Item
              label="Fiyat"
              name="price"
              rules={[{ required: true, message: "Fiyat zorunludur" }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                placeholder="Fiyat giriniz"
              />
            </Form.Item>

            <Form.Item
              label="Stok"
              name="stock"
              rules={[{ required: true, message: "Stok zorunludur" }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                placeholder="Stok giriniz"
              />
            </Form.Item>

            <Space>
              <Button type="primary" htmlType="submit">
                {editingProduct ? "Guncelle" : "Kaydet"}
              </Button>
              <Button onClick={handleCancel}>Iptal</Button>
            </Space>
          </Form>
        </Modal>
      </div>
    </div>
  );
}

export default App;
