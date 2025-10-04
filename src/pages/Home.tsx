import { useNavigate } from "react-router-dom";
import { Card, Button, Steps, Typography, Space, Row, Col } from "antd";
import {
  UploadOutlined,
  EditOutlined,
  DownloadOutlined,
  ArrowRightOutlined,
  CloudUploadOutlined,
  EditFilled,
  DownloadOutlined as DownloadFilled,
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;

/**
 * Home page component with welcome content and navigation
 * Provides an overview of the subtitle processing workflow
 */
export default function Home() {
  const navigate = useNavigate();

  const steps = [
    {
      title: "Upload Your Document",
      description:
        "Start by uploading your document or subtitle file. We support various formats and will automatically detect the content type.",
      icon: <CloudUploadOutlined />,
    },
    {
      title: "Edit and Review",
      description:
        "Use our editing interface to review timing, correct text, and make any necessary adjustments to your subtitles.",
      icon: <EditFilled />,
    },
    {
      title: "Download Your Subtitles",
      description:
        "Choose your preferred format and download your processed subtitles ready for use in your video projects.",
      icon: <DownloadFilled />,
    },
  ];

  const features = [
    {
      title: "Upload",
      description:
        "Upload your document in various formats including TXT, SRT, VTT, DOC, and DOCX",
      icon: <UploadOutlined style={{ fontSize: "24px", color: "#1890ff" }} />,
      color: "#e6f7ff",
    },
    {
      title: "Edit",
      description:
        "Review and edit your subtitles with our intuitive interface for timing and content",
      icon: <EditOutlined style={{ fontSize: "24px", color: "#52c41a" }} />,
      color: "#f6ffed",
    },
    {
      title: "Download",
      description:
        "Download your processed subtitles in multiple formats including SRT, VTT, TXT, and ASS",
      icon: <DownloadOutlined style={{ fontSize: "24px", color: "#722ed1" }} />,
      color: "#f9f0ff",
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      {/* Hero section */}
      <Card style={{ textAlign: "center", padding: "48px 24px" }}>
        <Title level={1} style={{ marginBottom: "16px" }}>
          Subtitle Processing Made Easy
        </Title>
        <Paragraph
          style={{ fontSize: "18px", marginBottom: "32px", color: "#666" }}
        >
          Upload, edit, and download your subtitles with our intuitive workflow
        </Paragraph>
        <Button
          type="primary"
          size="large"
          icon={<ArrowRightOutlined />}
          onClick={() => navigate("/upload")}
        >
          Get Started
        </Button>
      </Card>

      {/* Features section */}
      <Row gutter={[24, 24]}>
        {features.map((feature, index) => (
          <Col xs={24} md={8} key={index}>
            <Card
              style={{
                textAlign: "center",
                height: "100%",
                border: "none",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
              bodyStyle={{ padding: "32px 24px" }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "8px",
                  backgroundColor: feature.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                {feature.icon}
              </div>
              <Title level={4} style={{ marginBottom: "8px" }}>
                {feature.title}
              </Title>
              <Paragraph style={{ color: "#666", margin: 0 }}>
                {feature.description}
              </Paragraph>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Workflow section */}
      <Card title="How It Works" style={{ padding: "24px" }}>
        <Steps
          direction="vertical"
          size="small"
          items={steps.map((step) => ({
            title: step.title,
            description: step.description,
            icon: step.icon,
          }))}
        />
      </Card>
    </Space>
  );
}
