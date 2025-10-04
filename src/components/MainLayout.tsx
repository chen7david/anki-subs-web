import { Outlet, Link, useLocation } from "react-router-dom";
import { Layout, Menu, Typography, Space } from "antd";
import { HomeOutlined, UploadOutlined } from "@ant-design/icons";

const { Header, Content } = Layout;
const { Title } = Typography;

/**
 * Main layout component that wraps all pages with navigation
 * Provides the primary navigation structure for the subtitle processing app
 */
export default function MainLayout() {
  const location = useLocation();

  const menuItems = [
    {
      key: "/",
      icon: <HomeOutlined />,
      label: <Link to="/">Home</Link>,
    },
    {
      key: "/upload",
      icon: <UploadOutlined />,
      label: <Link to="/upload">Upload</Link>,
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#fff",
          borderBottom: "1px solid #f0f0f0",
          padding: "0 24px",
        }}
      >
        <Space align="center">
          <Title level={3} style={{ margin: 0, color: "#1890ff" }}>
            Subtitle Processor
          </Title>
        </Space>
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{
            border: "none",
            background: "transparent",
            minWidth: "200px",
          }}
        />
      </Header>

      <Content
        style={{
          padding: "24px",
          background: "#f5f5f5",
          minHeight: "calc(100vh - 64px)",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Outlet />
        </div>
      </Content>
    </Layout>
  );
}
