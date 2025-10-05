import { useNavigate } from "react-router-dom";
import {
  Card,
  Form,
  Input,
  Button,
  Space,
  Typography,
  Row,
  Col,
  Popconfirm,
  message,
} from "antd";
import { ArrowLeftOutlined, CheckOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;
const { TextArea } = Input;
import { useAtom, useSetAtom } from "jotai";
import {
  editedCuesAtom,
  deleteCueAtom,
  mergeWithNextCueAtom,
} from "../state/subtitles";
import { msToSrtTimestamp } from "../utils/subtitleParser";

/**
 * Edit page component for subtitle editing interface
 * Allows users to modify subtitle text and timing
 */
export default function Edit() {
  const [subtitles, setSubtitles] = useAtom(editedCuesAtom);
  const deleteCue = useSetAtom(deleteCueAtom);
  const mergeNext = useSetAtom(mergeWithNextCueAtom);
  const [messageApi, contextHolder] = message.useMessage();
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
    field: "startMs" | "endMs",
    value: string
  ) => {
    const ms = valueToMs(value);
    setSubtitles((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, [field]: ms } : sub))
    );
  };

  function valueToMs(value: string): number {
    const normalized = value.replace(".", ",");
    const match = normalized.match(/(\d{2}):(\d{2}):(\d{2}),(\d{1,3})/);
    if (!match) return 0;
    const [, hh, mm, ss, mmm] = match;
    return (
      parseInt(hh, 10) * 3600000 +
      parseInt(mm, 10) * 60000 +
      parseInt(ss, 10) * 1000 +
      parseInt(mmm.padEnd(3, "0"), 10)
    );
  }

  /**
   * Handles processing completion and navigation to download page
   */
  const handleProcessComplete = async () => {
    messageApi.success("Edits prepared. Proceed to download.");
    navigate("/download");
  };

  return (
    <Card style={{ maxWidth: "800px", margin: "0 auto" }}>
      {contextHolder}
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
          {subtitles.map((subtitle, idx) => (
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
                      value={msToSrtTimestamp(subtitle.startMs)}
                      onChange={(e) =>
                        updateSubtitleTime(
                          subtitle.id,
                          "startMs",
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
                      value={msToSrtTimestamp(subtitle.endMs)}
                      onChange={(e) =>
                        updateSubtitleTime(subtitle.id, "endMs", e.target.value)
                      }
                      placeholder="00:00:00,000"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={8}>
                  <Form.Item label="Duration" style={{ marginBottom: "8px" }}>
                    <Input
                      value={msToSrtTimestamp(
                        Math.max(0, subtitle.endMs - subtitle.startMs)
                      )}
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

              <div
                style={{
                  display: "flex",
                  gap: 8,
                  marginTop: 12,
                  justifyContent: "flex-end",
                }}
              >
                <Popconfirm
                  title="Delete this line?"
                  okText="Delete"
                  okButtonProps={{ danger: true }}
                  onConfirm={() => deleteCue(subtitle.id)}
                >
                  <Button danger>Delete</Button>
                </Popconfirm>
                <Button
                  onClick={() => mergeNext(subtitle.id)}
                  disabled={idx === subtitles.length - 1}
                >
                  Merge with next
                </Button>
              </div>
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
            >
              Complete & Download
            </Button>
          </div>
        </Card>
      </Space>
    </Card>
  );
}
