export async function uploadToCloudinary(file: File): Promise<string> {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined;
  const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined;

  if (!cloudName || !preset) {
    throw new Error(
      'Add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET to your .env.local file'
    );
  }

  const form = new FormData();
  form.append('file', file);
  form.append('upload_preset', preset);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: 'POST', body: form }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Cloudinary upload failed: ${text}`);
  }

  const json = await res.json() as { secure_url: string };
  return json.secure_url;
}
