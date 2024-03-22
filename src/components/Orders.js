import React, { useState, useEffect } from "react";
import { Button, Table, Modal, Form, Input, message, Row } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  getOrders,
  createOrder,
  updateOrder,
  deleteOrder,
} from "../controllers/orderController";
import jsPDF from "jspdf";
import "jspdf-autotable";
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingOrder, setEditingOrder] = useState(null);

  const fetchData = async () => {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateOrUpdateOrder = async (values) => {
    try {
      if (editingOrder) {
        await updateOrder(editingOrder._id, values);
        message.success("Order updated successfully");
      } else {
        await createOrder(values);
        message.success("Order created successfully");
      }
      setVisible(false);
      form.resetFields();
      fetchData();
    } catch (error) {
      console.error("Error creating/updating order:", error);
      message.error("Failed to create/update order");
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      await deleteOrder(orderId);
      message.success("Order deleted successfully");
      fetchData();
    } catch (error) {
      console.error("Error deleting order:", error);
      message.error("Failed to delete order");
    }
  };

  const columns = [
    { title: "User ID", dataIndex: "userId", key: "userId" },
    { title: "Item Name", dataIndex: "itemName", key: "itemName" },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Price", dataIndex: "price", key: "price" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEditOrder(record)}
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteOrder(record._id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const handleEditOrder = (order) => {
    setEditingOrder(order);
    setVisible(true);
    form.setFieldsValue(order);
  };

  const handleGenerateReport = () => {
    const doc = new jsPDF();
    const tableColumn = ["User ID", "Item Name", "Description", "Price"];
    const tableRows = [];

    orders.forEach((order) => {
      const { userId, itemName, description, price } = order;
      tableRows.push([userId, itemName, description, price]);
    });

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.text("Order Report", 14, 15);
    const date = new Date().toISOString().split("T")[0];
    doc.save(`order-report_${date}.pdf`);
  };

  return (
    <>
      <Row justify={"space-between"}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setVisible(true);
            setEditingOrder(null);
            form.resetFields();
          }}
          style={{ marginBottom: "1rem" }}
        >
          Add Order
        </Button>
        <Button onClick={handleGenerateReport} type="dashed">
          Generate Report
        </Button>
      </Row>
      <Table dataSource={orders} columns={columns} rowKey="_id" />
      <Modal
        title={editingOrder ? "Edit Order" : "Add Order"}
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handleCreateOrUpdateOrder}>
          <Form.Item name="userId" label="User ID" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="itemName"
            label="Item Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Orders;
