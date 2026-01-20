import { apiConnector } from "../apiConnector";
import { contactEndpoints } from "../api";
import toast from "react-hot-toast";

const { CONTACT_US_API } = contactEndpoints;

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  phoneNo?: string;
  message: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
      success?: boolean;
    };
  };
  message?: string;
}

export async function createContactUs(data: ContactFormData): Promise<boolean> {
  const toastId = toast.loading("Sending your message...");

  try {
    const response = await apiConnector("POST", CONTACT_US_API, data);

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to send message");
    }

    toast.success("Message sent successfully! We'll get back to you soon.", {
      id: toastId,
      duration: 3000,
    });
    return true;
  } catch (error) {
    console.error("Contact API error:", error);
    const apiError = error as ApiError;
    toast.error(
      apiError.response?.data?.message || "Failed to send message. Please try again.",
      { id: toastId, duration: 4000 }
    );
    return false;
  }
}

