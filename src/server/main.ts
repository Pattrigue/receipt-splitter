import express from "express";
import ViteExpress from "vite-express";
import OpenAI from "openai";
import multer from "multer";
import dotenv from "dotenv";
import fs from "fs/promises";

dotenv.config();

const app = express();
const upload = multer({ dest: "uploads/" });

const client = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

// Convert file to base64
const convertFileToBase64 = async (filePath: string): Promise<string> => {
  try {
    const fileBuffer = await fs.readFile(filePath);
    return fileBuffer.toString("base64");
  } catch (error) {
    throw new Error("Failed to convert file to base64");
  }
};

// Cleanup uploaded file
const cleanupFile = async (filePath: string): Promise<void> => {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    console.error("Error deleting file:", error);
  }
};

app.post("/api/post-receipt", upload.single("image"), async (req, res) => {
  try {
    // Ensure a file was uploaded
    if (!req.file) {
      return res
        .status(400)
        .json({ error: "No file uploaded. Please attach an image." });
    }

    console.log("Processing image:", req.file.originalname);
    const imagePath = req.file.path;

    // Convert the image to a base64 string
    const base64Image = await convertFileToBase64(imagePath);

    // Call the OpenAI GPT-4 API with the image
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `
You are an assistant with vision capabilities that processes receipt data from images of Danish receipts.

Please analyze the receipt image below and extract the store name, item names, prices, and discounts.
Discounts are formatted as rows starting with "RABAT" and ending with a number and a minus symbol (e.g., "RABAT 10,00-").
Include discounts as a positive number in the "discount" field, or 0 if no discount is present.
Return the results as structured JSON, following the format provided in the system message.

**
      `,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this Danish receipt image and extract the store name, item names, prices, and discounts. Return the results as structured JSON, following the instructions provided in the system message.  ",
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/${
                  req.file.mimetype.split("/")[1]
                };base64,${base64Image}`,
                detail: "high",
              },
            },
          ],
        },
      ],
      max_completion_tokens: 1024,
    });

    const rawContent = response.choices[0]?.message?.content;
    console.log(rawContent);

    if (!rawContent) {
      return res.status(500).json({ error: "Invalid response from AI" });
    }

    // Clean up the response and parse JSON
    const cleanedContent = rawContent.replace(/^```json|```$/g, "").trim();
    const jsonResponse = JSON.parse(cleanedContent);

    console.log("Processed JSON response:", jsonResponse);

    // Respond to the client
    res.json(jsonResponse);

    // Cleanup: Delete the uploaded file
    await cleanupFile(imagePath);
  } catch (error) {
    console.error("Error processing image:", error);
    res.status(500).json({ error: "Failed to process the image" });
  }
});

ViteExpress.listen(app, 3000, () => {
  console.log("Server is listening on port 3000...");
});
