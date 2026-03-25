const IMAGEKIT_UPLOAD_URL = "https://upload.imagekit.io/api/v1/files/upload";

export const uploadService = {
  uploadToImageKit: async (
    fileBuffer: Buffer,
    fileName: string,
    folder: string,
    mimeType: string
  ) => {
    const formData = new FormData();
    formData.append("file", new Blob([fileBuffer as any], { type: mimeType }), fileName);
    formData.append("fileName", fileName);
    formData.append("folder", folder);

    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY!;
    const authString = Buffer.from(`${privateKey}:`).toString("base64");

    const response = await fetch(IMAGEKIT_UPLOAD_URL, {
      method: "POST",
      headers: { Authorization: `Basic ${authString}` },
      body: formData,
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("ImageKit upload error:", errText);
      throw new Error("IMAGEKIT_ERROR");
    }

    const data = await response.json() as any;
    return { success: true, url: data.url, fileId: data.fileId, name: data.name };
  },
};
