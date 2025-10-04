import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Breadcrumb, Card, Button, Space } from "antd";
import { EditOutlined, DownloadOutlined } from "@ant-design/icons";

/**
 * Subtitle processing layout component for edit and download pages
 * Provides secondary navigation for the subtitle workflow
 */
export default function SubtitleLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const breadcrumbItems = [
    {
      title: <Link to="/">Home</Link>,
    },
    {
      title: <Link to="/upload">Upload</Link>,
    },
    {
      title: "Process",
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      {/* Breadcrumb navigation */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Subtitle workflow navigation */}
      <Card>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 600 }}>
            Subtitle Processing
          </h2>
          <Space>
            <Button
              type={location.pathname === "/edit" ? "primary" : "default"}
              icon={<EditOutlined />}
              onClick={() => navigate("/edit")}
            >
              Edit Subtitles
            </Button>
            <Button
              type={location.pathname === "/download" ? "primary" : "default"}
              icon={<DownloadOutlined />}
              onClick={() => navigate("/download")}
            >
              Download
            </Button>
          </Space>
        </div>
      </Card>

      {/* Page content */}
      <Outlet />
    </Space>
  );
}
