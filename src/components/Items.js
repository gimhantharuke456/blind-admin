import React, { useState, useEffect } from "react";
import { Button, Table, Modal, Form, Input, message, Select, Row } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  createItem,
  getAllItems,
  updateItem,
  deleteItem,
} from "../controllers/itemController";
import { getCategories } from "../controllers/categoryController";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Items = () => {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingItem, setEditingItem] = useState(null);

  const fetchData = async () => {
    try {
      const data = await getAllItems();
      setItems(data);
      const d = await getCategories();
      setCategories(d);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateOrUpdateItem = async (values) => {
    try {
      if (editingItem) {
        await updateItem(editingItem._id, values);
        message.success("Item updated successfully");
      } else {
        await createItem(values);
        message.success("Item created successfully");
      }
      setVisible(false);
      form.resetFields();
      fetchData();
    } catch (error) {
      console.error("Error creating/updating item:", error);
      message.error("Failed to create/update item");
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await deleteItem(itemId);
      message.success("Item deleted successfully");
      fetchData();
    } catch (error) {
      console.error("Error deleting item:", error);
      message.error("Failed to delete item");
    }
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Price", dataIndex: "price", key: "price" },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category) => category.name,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEditItem(record)}
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteItem(record._id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const handleEditItem = (item) => {
    setEditingItem(item);
    setVisible(true);
    form.setFieldsValue(item);
  };

  return (
    <>
      <Row justify={"space-between"}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setVisible(true);
            setEditingItem(null);
            form.resetFields();
          }}
          style={{ marginBottom: "1rem" }}
        >
          Add Item
        </Button>
        <Button
          onClick={() => {
            const doc = new jsPDF();
            const tableColumn = ["Name", "Description", "Price", "Category"];
            const tableRows = [];

            items.forEach((item) => {
              const itemName = item.name || "Unknown Name";
              const description =
                item.description || "No description available";
              const price = item.price.toString() || "0";
              const categoryName = item.category.name || "Unknown Category"; // Assuming the item object has a category field with a name property

              tableRows.push([itemName, description, price, categoryName]);
            });

            doc.autoTable(tableColumn, tableRows, { startY: 20 });
            doc.text("Item Report", 14, 15);
            const date = new Date().toISOString().split("T")[0];
            doc.save(`item-report_${date}.pdf`);
          }}
          type="dashed"
        >
          Generate Report
        </Button>
      </Row>
      <Table dataSource={items} columns={columns} rowKey="_id" />
      <Modal
        title={editingItem ? "Edit Item" : "Add Item"}
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handleCreateOrUpdateItem}>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true }]}
          >
            <Select>
              {categories.map((category) => (
                <Select.Option key={category._id} value={category._id}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Items;
