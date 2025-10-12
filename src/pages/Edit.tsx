import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Form,
  Input,
  Button,
  Space,
  Typography,
  Popconfirm,
  message,
} from "antd";
import { ArrowLeftOutlined, CheckOutlined } from "@ant-design/icons";
import { useAtom, useSetAtom } from "jotai";
import {
  editedCuesAtom,
  deleteCueAtom,
  mergeWithNextCueAtom,
} from "../state/subtitles";
import http from "../service/http.service"; // ✅ import the Axios wrapper

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

/**
 * Edit page component for subtitle editing interface
 * Cleaner version — text-only editing with infinite scroll
 */
export default function Edit() {
  const [subtitles] = useAtom(editedCuesAtom);
  const setSubtitles = useSetAtom(editedCuesAtom);
  const deleteCue = useSetAtom(deleteCueAtom);
  const mergeNext = useSetAtom(mergeWithNextCueAtom);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  // Infinite scroll state
  const BATCH_SIZE = 50;
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 300
      ) {
        setVisibleCount((prev) =>
          Math.min(prev + BATCH_SIZE, subtitles.length)
        );
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [subtitles.length]);

  const visibleSubs = subtitles.slice(0, visibleCount);

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
   * Handles processing completion and submission to backend
   */
  const handleProcessComplete = async () => {
    console.log("Submitting edited subtitles:", subtitles);


    try {
      const res = await http.post("users/subs", { subs: subtitles.map((e) => e.text)}); // ✅ Axios call
      console.log("Response from backend:", res);

      messageApi.success("Edits submitted successfully!");
      navigate("/download");
    } catch (err: any) {
      console.error("Upload error:", err);
      messageApi.error(
        err?.response?.data?.message ||
          "Failed to submit edits. Please try again."
      );
    }
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
            Review and edit your subtitle text content below.
          </Paragraph>
        </div>

        {/* Subtitle entries (infinite scroll) */}
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          {visibleSubs.map((subtitle, idx) => (
            <Card
              key={subtitle.id}
              size="small"
              style={{
                border: "1px solid #f0f0f0",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <Form.Item
                label={`Subtitle #${subtitle.id}`}
                style={{ marginBottom: 0 }}
              >
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

          {visibleCount < subtitles.length && (
            <div style={{ textAlign: "center", padding: 16, color: "#888" }}>
              Loading more subtitles...
            </div>
          )}
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
              Complete & Upload
            </Button>
          </div>
        </Card>
      </Space>
    </Card>
  );
}
