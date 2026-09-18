const API_BASE_URL = "https://8fw72rgtr3.execute-api.ap-south-1.amazonaws.com";

export async function scanPassbook(imageDataUrl) {
  const response = await fetch(`${API_BASE_URL}/scan-passbook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: imageDataUrl }),
  });

  if (!response.ok) {
    throw new Error("Failed to scan passbook");
  }

  return response.json();
}