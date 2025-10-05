import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Upload as AntUpload,
  Button,
  Typography,
  Space,
  Alert,
} from "antd";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import { useSetAtom } from "jotai";
import {
  parsedCuesAtom,
  rawSubtitleFileAtom,
  editedCuesAtom,
} from "../state/subtitles";
import { parseSubtitleContent } from "../utils/subtitleParser";

const { Title, Paragraph } = Typography;
const { Dragger } = AntUpload;

/**
 * Upload page component for document upload functionality
 * Handles file upload and navigation to edit page
 */
export default function Upload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const setRawFile = useSetAtom(rawSubtitleFileAtom);
  const setParsed = useSetAtom(parsedCuesAtom);
  const setEdited = useSetAtom(editedCuesAtom);

  /**
   * Handles file selection from upload component
   * @param info - Upload file info object
   */
  const handleFileChange = (info: any) => {
    const { file } = info;
    if (file) {
      setSelectedFile(file);
    }
  };

  /**
   * Handles file upload and navigation to edit page
   */
  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);

    // Read file and parse subtitles
    try {
      const text = await selectedFile.text();
      const cues = parseSubtitleContent(text);
      setRawFile(selectedFile);
      setParsed(cues);
      setEdited(cues);
      // Simulate brief processing delay for UX
      await new Promise((resolve) => setTimeout(resolve, 250));
    } catch (e) {
      console.error("Failed to parse subtitle file", e);
      setIsUploading(false);
      return;
    }

    setIsUploading(false);
    navigate("/edit");
  };

  const uploadProps = {
    name: "file",
    multiple: false,
    accept: ".txt,.srt,.vtt,.doc,.docx",
    beforeUpload: () => false, // Prevent auto upload
    onChange: handleFileChange,
    onDrop: (e: React.DragEvent) => {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  return (
    <Card style={{ maxWidth: "600px", margin: "0 auto" }}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div style={{ textAlign: "center" }}>
          <Title level={2} style={{ marginBottom: "8px" }}>
            Upload Document
          </Title>
          <Paragraph style={{ color: "#666", fontSize: "16px" }}>
            Upload your document to start processing subtitles
          </Paragraph>
        </div>

        {/* File upload area */}
        <Dragger {...uploadProps} style={{ padding: "32px" }}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined style={{ fontSize: "48px", color: "#1890ff" }} />
          </p>
          <p
            className="ant-upload-text"
            style={{ fontSize: "16px", marginBottom: "8px" }}
          >
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint" style={{ color: "#999" }}>
            Support for TXT, SRT, VTT, DOC, DOCX files up to 10MB
          </p>
        </Dragger>

        {/* Selected file info */}
        {selectedFile && (
          <Alert
            message={
              <Space>
                <span style={{ fontWeight: 500 }}>{selectedFile.name}</span>
                <span style={{ color: "#666" }}>
                  ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </Space>
            }
            type="info"
            showIcon
            style={{ marginBottom: "16px" }}
          />
        )}

        {/* Upload button */}
        <Button
          type="primary"
          size="large"
          block
          icon={<UploadOutlined />}
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          loading={isUploading}
        >
          {isUploading ? "Processing..." : "Upload & Process"}
        </Button>
      </Space>
    </Card>
  );
}
