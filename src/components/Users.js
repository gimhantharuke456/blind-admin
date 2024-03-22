import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, message } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController";

const { confirm } = Modal;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleCreateUser = async (values) => {
    try {
      await createUser(values);
      message.success("User created successfully");
      setVisible(false);
      form.resetFields();
      fetchUsers();
    } catch (error) {
      console.error("Error creating user:", error);
      message.error("Failed to create user");
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setVisible(true);
  };

  const handleUpdateUser = async (values) => {
    try {
      await updateUser(editingUser._id, values);
      message.success("User updated successfully");
      setVisible(false);
      form.resetFields();
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
      message.error("Failed to update user");
    }
  };

  const handleDeleteConfirm = (user) => {
    confirm({
      title: "Are you sure you want to delete this user?",
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        handleDeleteUser(user._id);
      },
    });
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId);
      message.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      message.error("Failed to delete user");
    }
  };

  const columns = [
    { title: "Username", dataIndex: "username", key: "username" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    {
      title: "Shipping Address",
      dataIndex: "shippingAddress",
      key: "shippingAddress",
    },
    {
      title: "Billing Address",
      dataIndex: "billingAddress",
      key: "billingAddress",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, user) => (
        <div>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEditUser(user)}
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteConfirm(user)}
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
        Add User
      </Button>
      <Table dataSource={users} columns={columns} rowKey="_id" />

      <Modal
        title={editingUser ? "Edit User" : "Add User"}
        visible={visible}
        onCancel={() => {
          setVisible(false);
          setEditingUser(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          onFinish={editingUser ? handleUpdateUser : handleCreateUser}
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Please input username!" }]}
            initialValue={editingUser ? editingUser.username : ""}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input valid email address!" },
            ]}
            initialValue={editingUser ? editingUser.email : ""}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone"
            initialValue={editingUser ? editingUser.phone : ""}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="shippingAddress"
            label="Shipping Address"
            initialValue={editingUser ? editingUser.shippingAddress : ""}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="billingAddress"
            label="Billing Address"
            initialValue={editingUser ? editingUser.billingAddress : ""}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Users;
