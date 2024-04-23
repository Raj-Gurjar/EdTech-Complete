import { studentPaymentEndpoints } from "../api";
import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import rzp_logo from "../../assets/logos/icons8-book-96.png";
import { resetCart } from "../../toolkit/slice/cartSlice";
import { setPaymentLoading } from "../../toolkit/slice/courseSlice";

const {
  COURSE_PAYMENT_API,
  COURSE_VERIFY_API,
  SEND_PAYMENT_SUCCESS_EMAIL_API,
} = studentPaymentEndpoints;

export async function buyCourse(
  token,
  courses,
  userDetails,
  navigate,
  dispatch
) {
  const toastId = toast.loading("Loading...");

  try {
    //initiate the order
    console.log("inside buy course");
    const orderResponse = await apiConnector(
      "POST",
      COURSE_PAYMENT_API,
      {
        courses,
      },
      { Authorization: `Bearer ${token}` }
    );

    console.log("OrderResponse :", orderResponse);
    
    if (!orderResponse?.data?.success) {
      toast.error(orderResponse.data.message);
      throw new Error(orderResponse.data.messages);
    }

    console.log("OrderResponse :", orderResponse);

    //create options

    const options = {
      key: process.env.RAZORPAY_KEY,
      amount: `${orderResponse.data.message.currency}`,
      currency: orderResponse.data.message.currency,
      name: "EdTech",
      description: "Thank you for purchasing course",
      image: rzp_logo,
      //   account_id: "acc_Ef7ArAsdU5t0XL",
      order_id: orderResponse.data.message.id,
      handler: function (response) {
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

    // paymentObject.createPayment(options);
    paymentObject.open();
    paymentObject.on("payment.failed", function (response) {
      toast.error("oops, payment failed");
      console.log("error in options...", response.error);
    });
  } catch (error) {
    console.log("PAYMENT error Api...", error);
    toast.error("Could not make the Payment", error.message);
  }
  toast.dismiss(toastId);
}

async function sendPaymentMail(response, amount, token) {
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

async function verifyPayment(bodyData, token, navigate, dispatch) {
  const toastId = toast.loading("Verifying Payment....");
  dispatch(setPaymentLoading(true));

  try {
    const response = await apiConnector("POST", COURSE_VERIFY_API, bodyData, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success("Payment Successful, you are added to the course");
    navigate("/dashboard/enrolled-courses");
    dispatch(resetCart());
  } catch (error) {
    console.log("Payment Verify error..", error);
    toast.error("Could not verify Payment", error);
  }
  toast.dismiss(toastId);
  dispatch(setPaymentLoading(false));
}
