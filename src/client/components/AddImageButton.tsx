import { useState } from "react";
import { Button } from "@mantine/core";
import { Receipt } from "../../types";

interface AddImageButtonProps {
  onUploadSuccess: (response: Receipt) => void;
}

export function AddImageButton({ onUploadSuccess }: AddImageButtonProps) {
  const [loading, setLoading] = useState(false);
  const maxFileSize = 5 * 1024 * 1024;

  const addImage = () => {
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    fileInput?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/webp"];

      // Validate file type
      if (!validTypes.includes(file.type)) {
        alert("Invalid file type. Please upload a JPEG, PNG, or WebP image.");
        return;
      }

      // Validate file size
      if (file.size > maxFileSize) {
        alert(
          `File size exceeds the limit of ${maxFileSize / 1024 / 1024} MB.`
        );
        return;
      }

      // Start upload process
      setLoading(true);

      try {
        const formData = new FormData();
        formData.append("image", file);

        const response = await fetch("/api/post-receipt", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.statusText}`);
        }

        // try to convert the response to the ResponseData type
        const data = (await response.json()) as Receipt;

        onUploadSuccess(data);
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("An error occurred while uploading the image. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Button onClick={addImage} disabled={loading} loading={loading}>
        Tilføj Billede
      </Button>
      <input
        type="file"
        id="fileInput"
        style={{ display: "none" }}
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
      />
    </>
  );
}
