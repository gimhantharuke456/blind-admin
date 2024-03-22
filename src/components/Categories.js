import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, message } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController";

const { confirm } = Modal;

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleCreateCategory = async (values) => {
    try {
      await createCategory(values);
      message.success("Category created successfully");
      setVisible(false);
      form.resetFields();
      fetchCategories();
    } catch (error) {
      console.error("Error creating category:", error);
      message.error("Failed to create category");
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    form.setFieldsValue(category);
    setVisible(true);
  };

  const handleUpdateCategory = async (values) => {
    try {
      await updateCategory(editingCategory._id, values);
      message.success("Category updated successfully");
      setVisible(false);
      form.resetFields();
      fetchCategories();
    } catch (error) {
      console.error("Error updating category:", error);
      message.error("Failed to update category");
    }
  };

  const handleDeleteConfirm = (category) => {
    confirm({
      title: "Are you sure you want to delete this category?",
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        handleDeleteCategory(category._id);
      },
    });
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await deleteCategory(categoryId);
      message.success("Category deleted successfully");
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      message.error("Failed to delete category");
    }
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Actions",
      key: "actions",
      render: (_, category) => (
        <div>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEditCategory(category)}
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteConfirm(category)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setVisible(true)}
        style={{ marginBottom: 16 }}
      >
        Add Category
      </Button>
      <Table dataSource={categories} columns={columns} rowKey="_id" />

      <Modal
        title={editingCategory ? "Edit Category" : "Add Category"}
        visible={visible}
        onCancel={() => {
          setVisible(false);
          setEditingCategory(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          onFinish={
            editingCategory ? handleUpdateCategory : handleCreateCategory
          }
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please input category name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Categories;
