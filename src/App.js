import { Layout, Menu } from "antd";
import "antd/dist/reset.css";
import {
  UserOutlined,
  ShoppingOutlined,
  TagOutlined,
  CaretDownFilled,
} from "@ant-design/icons";
import { useState } from "react";
import Categories from "./components/Categories";
import Orders from "./components/Orders";
import Users from "./components/Users";
import Items from "./components/Items";

const { Header, Content, Sider } = Layout;

function App() {
  const [selectedMenuKey, setSelectedMenuKey] = useState("users");

  const handleMenuClick = ({ key }) => {
    setSelectedMenuKey(key);
  };

  const renderContent = () => {
    switch (selectedMenuKey) {
      case "users":
        return <Users />;
      case "orders":
        return <Orders />;
      case "categories":
        return <Categories />;
      case "items":
        return <Items />;
      default:
        return null;
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedMenuKey]}
          onClick={handleMenuClick}
        >
          <Menu.Item key="users" icon={<UserOutlined />}>
            Users
          </Menu.Item>
          <Menu.Item key="categories" icon={<CaretDownFilled />}>
            Categories
          </Menu.Item>
          <Menu.Item key="orders" icon={<ShoppingOutlined />}>
            Orders
          </Menu.Item>
          <Menu.Item key="items" icon={<TagOutlined />}>
            Items
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }} />
        <Content style={{ margin: "16px" }}>
          <div className="site-layout-background" style={{ padding: 24 }}>
            {renderContent()}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
