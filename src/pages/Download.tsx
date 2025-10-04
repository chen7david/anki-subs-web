import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  Alert,
  Result,
  Space,
  Row,
  Col,
  Typography,
  Spin,
} from "antd";
import {
  DownloadOutlined,
  CheckCircleOutlined,
  ArrowLeftOutlined,
  FileTextOutlined,
  FileOutlined,
  FilePdfOutlined,
  FileWordOutlined,
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;

/**
 * Download page component for processed subtitle download
 * Provides download options and completion confirmation
 */
export default function Download() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const navigate = useNavigate();

  /**
   * Handles subtitle file download
   * @param format - File format to download
   */
  const handleDownload = async (format: string) => {
    setIsDownloading(true);

    // Simulate download process
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsDownloading(false);
    setDownloadComplete(true);

    // Create and trigger download
    const content = `1
00:00:01,000 --> 00:00:04,000
Hello, welcome to our video.

2
00:00:04,500 --> 00:00:08,000
Today we'll be discussing subtitles.

3
00:00:08,500 --> 00:00:12,000
Let's learn how to edit them properly.`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subtitles.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  /**
   * Handles starting a new processing workflow
   */
  const handleNewUpload = () => {
    navigate("/upload");
  };

  const downloadFormats = [
    {
      key: "srt",
      title: "SRT Format",
      description: "SubRip Subtitle",
      icon: <FileTextOutlined style={{ fontSize: "24px", color: "#1890ff" }} />,
    },
    {
      key: "vtt",
      title: "VTT Format",
      description: "WebVTT Subtitle",
      icon: <FileOutlined style={{ fontSize: "24px", color: "#52c41a" }} />,
    },
    {
      key: "txt",
      title: "TXT Format",
      description: "Plain Text",
      icon: <FileTextOutlined style={{ fontSize: "24px", color: "#722ed1" }} />,
    },
    {
      key: "ass",
      title: "ASS Format",
      description: "Advanced SubStation",
      icon: <FileWordOutlined style={{ fontSize: "24px", color: "#fa8c16" }} />,
    },
  ];

  return (
    <Card style={{ maxWidth: "600px", margin: "0 auto" }}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {/* Header */}
        <div>
          <Title level={2} style={{ marginBottom: "8px" }}>
            Download Subtitles
          </Title>
          <Paragraph style={{ color: "#666" }}>
            Your subtitles have been processed successfully
          </Paragraph>
        </div>

        {!downloadComplete ? (
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            {/* Success message */}
            <Alert
              message="Processing completed successfully!"
              type="success"
              showIcon
              icon={<CheckCircleOutlined />}
            />

            {/* Download options */}
            <div>
              <Title level={4} style={{ marginBottom: "16px" }}>
                Choose Download Format
              </Title>
              <Row gutter={[16, 16]}>
                {downloadFormats.map((format) => (
                  <Col xs={24} sm={12} key={format.key}>
                    <Card
                      hoverable
                      style={{
                        textAlign: "center",
                        height: "100%",
                        border: "1px solid #f0f0f0",
                      }}
                      bodyStyle={{ padding: "16px" }}
                      onClick={() => handleDownload(format.key)}
                    >
                      <Space
                        direction="vertical"
                        size="small"
                        style={{ width: "100%" }}
                      >
                        {format.icon}
                        <div>
                          <div style={{ fontWeight: 500, marginBottom: "4px" }}>
                            {format.title}
                          </div>
                          <div style={{ fontSize: "12px", color: "#666" }}>
                            {format.description}
                          </div>
                        </div>
                      </Space>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>

            {/* Download status */}
            {isDownloading && (
              <Alert
                message="Preparing download..."
                type="info"
                showIcon
                icon={<Spin size="small" />}
              />
            )}
          </Space>
        ) : (
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            {/* Success completion */}
            <Result
              status="success"
              title="Download Complete!"
              subTitle="Your subtitle file has been downloaded successfully."
              icon={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
            />

            {/* Action buttons */}
            <Space
              size="middle"
              style={{ width: "100%", justifyContent: "center" }}
            >
              <Button
                type="primary"
                size="large"
                icon={<DownloadOutlined />}
                onClick={handleNewUpload}
              >
                Process Another File
              </Button>

              <Button
                size="large"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate("/")}
              >
                Back to Home
              </Button>
            </Space>
          </Space>
        )}
      </Space>
    </Card>
  );
}
