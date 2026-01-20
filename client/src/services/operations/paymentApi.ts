import { studentPaymentEndpoints } from "../api";
import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import rzp_logo from "../../assets/logos/icons8-book-96.png";
import { resetCart } from "../../toolkit/slice/cartSlice";
import { setPaymentLoading } from "../../toolkit/slice/courseSlice";
import { NavigateFunction } from "react-router-dom";
import { AnyAction, Dispatch } from "@reduxjs/toolkit";

const {
  COURSE_PAYMENT_API,
  COURSE_VERIFY_API,
  SEND_PAYMENT_SUCCESS_EMAIL_API,
} = studentPaymentEndpoints;

interface RazorpayOptions {
  key: string | undefined;
  amount: string;
  currency: string;
  name: string;
  description: string;
  image: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
  };
  theme: {
    color: string;
  };
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayError {
  error: {
    description: string;
    source: string;
    step: string;
    reason: string;
    metadata: {
      order_id: string;
      payment_id: string;
    };
  };
}

interface UserDetails {
  firstName: string;
  lastName: string;
  email: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
      on: (event: string, handler: (response: RazorpayError) => void) => void;
    };
  }
}

function loadScript(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    const script = document.createElement("script");

    script.src = src;

    script.onload = () => {
      resolve(true);
    };

    script.onerror = () => {
      resolve(false);
    };

    document.body.appendChild(script);
  });
}

export async function buyCourse(
  token: string,
  courses: any[],
  userDetails: UserDetails,
  navigate: NavigateFunction,
  dispatch: Dispatch<AnyAction>
): Promise<void> {
  const toastId = toast.loading("Loading...");

  try {
    //load script
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      toast.error("RazorPay SDK failed to load.", { duration: 4000 });
      return;
    }

    //initiate the order
    const orderResponse = await apiConnector(
      "POST",
      COURSE_PAYMENT_API,
      {
        courses,
      },
      { Authorization: `Bearer ${token}` }
    );

    if (!orderResponse.data.success) {
      throw new Error(orderResponse.data.messages);
    }

    //create options
    const options: RazorpayOptions = {
      key: process.env.REACT_APP_RAZORPAY_KEY || process.env.RAZORPAY_KEY,
      amount: `${orderResponse.data.message.currency}`,
      currency: orderResponse.data.message.currency,
      name: "SkillScript",
      description: "Thank you for purchasing course",
      image: rzp_logo,
      order_id: orderResponse.data.message.id,
      handler: function (response: RazorpayResponse) {
        //send success mail
        sendPaymentMail(response, orderResponse.data.message.amount, token);

        //verifyPayment
        verifyPayment({ ...response, courses }, token, navigate, dispatch);
      },
      prefill: {
        name: `${userDetails.firstName} ${userDetails.lastName}`,
        email: userDetails.email,
      },
      theme: {
        color: "#3399cc",
      },
    };

    const paymentObject = new window.Razorpay(options);

    paymentObject.open();
    paymentObject.on("payment.failed", function (response: RazorpayError) {
      toast.error("oops, payment failed", { duration: 4000 });
    });
  } catch (error) {
    const apiError = error as ApiError;
    toast.error(apiError.response?.data?.message || "Payment failed", { duration: 4000 });
  }
  toast.dismiss(toastId);
}

async function sendPaymentMail(response: RazorpayResponse, amount: number, token: string): Promise<void> {
  try {
    await apiConnector(
      "POST",
      SEND_PAYMENT_SUCCESS_EMAIL_API,
      {
        orderId: response.razorpay_order_id,
        paymentId: response.razorpay_payment_id,
        amount,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    );
  } catch (error) {
    console.log("Payment Success email error...", error);
  }
}

async function verifyPayment(bodyData: any, token: string, navigate: NavigateFunction, dispatch: Dispatch<AnyAction>): Promise<void> {
  const toastId = toast.loading("Verifying Payment....");
  dispatch(setPaymentLoading(true));

  try {
    const response = await apiConnector("POST", COURSE_VERIFY_API, bodyData, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success("Payment Successful, you are added to the course", { id: toastId, duration: 3000 });
    navigate("/dashboard/enrolledCourses");
    dispatch(resetCart());
  } catch (error) {
    toast.error("Could not verify Payment", { id: toastId, duration: 4000 });
  }
  toast.dismiss(toastId);
  dispatch(setPaymentLoading(false));
}

