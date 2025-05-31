// app/actions/whatsapp.ts
"use server";

interface WhatsAppMessageResponse {
  success: boolean;
  message?: string;
  data?: any;
  error?: string;
}

export async function sendWATIMessage(
  phoneNumber: string,
  messageContent: string
): Promise<WhatsAppMessageResponse> {
  // Get credentials from environment variables
  const accessToken = process.env.WATI_ACCESS_TOKEN;
  const apiEndpoint = process.env.WATI_API_ENDPOINT;

  if (!accessToken || !apiEndpoint) {
    return {
      success: false,
      error: "WATI credentials not configured in environment variables",
    };
  }

  // Validate phone number (basic E.164 format check)
  if (!/^[1-9]\d{9,14}$/.test(phoneNumber)) {
    return {
      success: false,
      error:
        "Invalid phone number format. Must be E.164 format without + or 00",
    };
  }

  try {
    const response = await fetch(`${apiEndpoint}/sendTemplateMessage`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        whatsappNumber: `whatsapp:${phoneNumber}`,
        templateName: "your_template_name", // Optional if sending freeform message
        broadcastName: "your_broadcast_name", // Optional
        parameters: [
          // Required if using template
          {
            name: "message",
            value: messageContent,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("WATI API Error:", data);
      return {
        success: false,
        error: data.message || "Failed to send WhatsApp message",
        data: data,
      };
    }

    return {
      success: true,
      message: "WhatsApp message sent successfully",
      data: data,
    };
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
