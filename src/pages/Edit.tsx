import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Form, Input, Button, Space, Typography, Row, Col } from "antd";
import { ArrowLeftOutlined, CheckOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

type SubtitleEntry = {
  id: number;
  startTime: string;
  endTime: string;
  text: string;
};

/**
 * Edit page component for subtitle editing interface
 * Allows users to modify subtitle text and timing
 */
export default function Edit() {
  const [subtitles, setSubtitles] = useState<SubtitleEntry[]>([
    {
      id: 1,
      startTime: "00:00:01,000",
      endTime: "00:00:04,000",
      text: "Hello, welcome to our video.",
    },
    {
      id: 2,
      startTime: "00:00:04,500",
      endTime: "00:00:08,000",
      text: "Today we'll be discussing subtitles.",
    },
    {
      id: 3,
      startTime: "00:00:08,500",
      endTime: "00:00:12,000",
      text: "Let's learn how to edit them properly.",
    },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  /**
   * Updates subtitle text for a specific entry
   * @param id - Subtitle entry ID
   * @param text - New text content
   */
  const updateSubtitleText = (id: number, text: string) => {
    setSubtitles((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, text } : sub))
    );
  };

  /**
   * Updates subtitle timing for a specific entry
   * @param id - Subtitle entry ID
   * @param field - Time field to update ('startTime' or 'endTime')
   * @param value - New time value
   */
  const updateSubtitleTime = (
    id: number,
    field: "startTime" | "endTime",
    value: string
  ) => {
    setSubtitles((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, [field]: value } : sub))
    );
  };

  /**
   * Handles processing completion and navigation to download page
   */
  const handleProcessComplete = async () => {
    setIsProcessing(true);

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsProcessing(false);
    navigate("/download");
  };

  return (
    <Card style={{ maxWidth: "800px", margin: "0 auto" }}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {/* Header */}
        <div>
          <Title level={2} style={{ marginBottom: "8px" }}>
            Edit Subtitles
          </Title>
          <Paragraph style={{ color: "#666" }}>
            Review and edit your subtitle content and timing
          </Paragraph>
        </div>

        {/* Subtitle entries */}
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          {subtitles.map((subtitle) => (
            <Card
              key={subtitle.id}
              size="small"
              title={`Subtitle #${subtitle.id}`}
              style={{ border: "1px solid #f0f0f0" }}
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={8}>
                  <Form.Item label="Start Time" style={{ marginBottom: "8px" }}>
                    <Input
                      value={subtitle.startTime}
                      onChange={(e) =>
                        updateSubtitleTime(
                          subtitle.id,
                          "startTime",
                          e.target.value
                        )
                      }
                      placeholder="00:00:00,000"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={8}>
                  <Form.Item label="End Time" style={{ marginBottom: "8px" }}>
                    <Input
                      value={subtitle.endTime}
                      onChange={(e) =>
                        updateSubtitleTime(
                          subtitle.id,
                          "endTime",
                          e.target.value
                        )
                      }
                      placeholder="00:00:00,000"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={8}>
                  <Form.Item label="Duration" style={{ marginBottom: "8px" }}>
                    <Input
                      value={subtitle.endTime}
                      disabled
                      style={{ backgroundColor: "#f5f5f5" }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="Text Content" style={{ marginBottom: 0 }}>
                <TextArea
                  value={subtitle.text}
                  onChange={(e) =>
                    updateSubtitleText(subtitle.id, e.target.value)
                  }
                  rows={2}
                  placeholder="Enter subtitle text..."
                />
              </Form.Item>
            </Card>
          ))}
        </Space>

        {/* Action buttons */}
        <Card style={{ backgroundColor: "#fafafa" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/upload")}
            >
              Back to Upload
            </Button>

            <Button
              type="primary"
              size="large"
              icon={<CheckOutlined />}
              onClick={handleProcessComplete}
              loading={isProcessing}
            >
              {isProcessing ? "Processing..." : "Complete & Download"}
            </Button>
          </div>
        </Card>
      </Space>
    </Card>
  );
}
