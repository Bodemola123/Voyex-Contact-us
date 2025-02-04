"use client"; // Marks this component as a Client Component in Next.js
import React, { useState } from "react"; // Import React and useState for state management
import emailjs from "emailjs-com"; // Library to send emails via EmailJS
import PhoneInput from "react-phone-input-2"; // Library for phone number input with country codes
import "react-phone-input-2/lib/style.css"; // Styles for the phone input component
import axios from "axios"; // Library for making HTTP requests (used for API validation)
import { toast, ToastContainer } from "react-toastify"; // Toast notifications for user feedback
import "react-toastify/dist/ReactToastify.css"; // Styles for toast notifications
import { debounce } from 'lodash'; // Utility for debouncing function calls
import '../app/globals.css'; // Global styles for the application

const ContactUs = () => {
  // State to manage form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  // State to manage validation errors
  const [errors, setErrors] = useState({
    email: "",
    phone: "",
  });

  // State to manage form submission loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Environment variables for API keys and EmailJS configuration
  const ABSTRACT_EMAIL_API_KEY = process.env.NEXT_PUBLIC_ABSTRACT_EMAIL_API_KEY;
  const ABSTRACT_PHONE_API_KEY = process.env.NEXT_PUBLIC_ABSTRACT_PHONE_API_KEY;
  const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
  const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
  const EMAILJS_USER_ID = process.env.NEXT_PUBLIC_EMAILJS_USER_ID;

  // Function to validate email using AbstractAPI
  const validateEmailWithAbstract = async (email) => {
    try {
      const response = await axios.get(
        `https://emailvalidation.abstractapi.com/v1/?api_key=${ABSTRACT_EMAIL_API_KEY}&email=${email}`
      );
      // Check if the email is valid and deliverable
      return response.data.is_valid_format && response.data.is_deliverable;
    } catch (error) {
      console.error("AbstractAPI email validation error:", error);
      toast.error("Email validation service is currently unavailable. Please try again later.");
      return false; // Return false if validation fails
    }
  };

  // Function to validate phone number using AbstractAPI
  const validatePhoneWithAbstract = async (phone) => {
    try {
      const response = await axios.get(
        `https://phonevalidation.abstractapi.com/v1/?api_key=${ABSTRACT_PHONE_API_KEY}&phone=${phone}`
      );
      // Check if the phone number is valid
      return response.data.valid;
    } catch (error) {
      console.error("AbstractAPI phone validation error:", error);
      toast.error("Phone validation service is currently unavailable. Please try again later.");
      return false; // Return false if validation fails
    }
  };

  // Debounced function to validate email (to avoid excessive API calls)
  const debouncedValidateEmail = debounce(async (email) => {
    const isValidEmail = await validateEmailWithAbstract(email);
    // Update errors state based on validation result
    setErrors((prevErrors) => ({ ...prevErrors, email: isValidEmail ? "" : "Invalid email address" }));
  }, 5000); // Debounce delay of 4 seconds

  // Debounced function to validate phone number
  const debouncedValidatePhone = debounce(async (phone) => {
    const isValidPhone = await validatePhoneWithAbstract(phone);
    // Update errors state based on validation result
    setErrors((prevErrors) => ({ ...prevErrors, phone: isValidPhone ? "" : "Invalid phone number" }));
  }, 5000); // Debounce delay of 4 seconds

  // Handler for input changes in the form
  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    // Update form data state
    setFormData({ ...formData, [name]: value });

    // Validate email if the email field is changed
    if (name === "email") {
      debouncedValidateEmail(value);
    }
  };

  // Handler for phone number input changes
  const handlePhoneChange = async (value) => {
    // Update form data state with the new phone number
    setFormData({ ...formData, phone: value });
    // Validate phone number
    debouncedValidatePhone(value);
  };

  // Function to handle form submission
  const sendEmail = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setIsSubmitting(true); // Set loading state to true

    // Check if all fields are filled
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      toast.error("Please fill in all fields.");
      setIsSubmitting(false); // Reset loading state
      return;
    }

    // Check if there are any validation errors
    if (errors.email || errors.phone) {
      toast.error("Please fix validation errors before submitting.");
      setIsSubmitting(false); // Reset loading state
      return;
    }

    try {
      // Send form data via EmailJS
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        },
        EMAILJS_USER_ID
      );
      // Show success message
      toast.success("Message sent successfully!");
      // Reset form data after successful submission
      setFormData({ firstName: "", lastName: "", email: "", phone: "" });
    } catch (error) {
      // Show error message if submission fails
      toast.error("Failed to send message. Please try again.");
    } finally {
      // Reset loading state
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen text-white flex flex-col md:flex-row items-center justify-center p-6">
      {/* Toast container for displaying notifications */}
      <ToastContainer />
      {/* Form container */}
      <div className="w-full max-w-lg bg-[#131314] p-6 rounded-3xl shadow-2xl border border-[#3a3a3a]">
        <h1 className="text-3xl text-center font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#c088fb] to-[#6d28d9]">
          Get in Touch
        </h1>
        <p className="text-gray-300 mb-6 text-center">
          We will get back to you ASAP!
        </p>

        {/* Form */}
        <form onSubmit={sendEmail} className="space-y-4">
          {/* First Name and Last Name fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full p-2 rounded-3xl bg-[#0a0a0b] border border-[#4a4a4a] focus:outline-none focus:ring-2 focus:ring-[#c088fb] text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full p-2 rounded-3xl bg-[#0a0a0b] border border-[#4a4a4a] focus:outline-none focus:ring-2 focus:ring-[#c088fb] text-white"
                required
              />
            </div>
          </div>

          {/* Email field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 rounded-3xl bg-[#0a0a0b] border border-[#4a4a4a] focus:outline-none focus:ring-2 focus:ring-[#c088fb] text-white"
              required
            />
            {/* Display email validation error */}
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Phone number field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
            <div className="relative">
              <PhoneInput
                className="custom-phone-input"
                country={"us"} // Default country code
                value={formData.phone}
                onChange={handlePhoneChange}
                inputProps={{
                  "aria-label": "Phone Number",
                }}
                inputStyle={{
                  width: "100%",
                  paddingLeft: "50px",
                  borderRadius: "24px",
                  backgroundColor: "#0a0a0b",
                  border: "1px solid #4a4a4a",
                  color: "white",
                  outline: "none",
                  transition: "none",
                }}
                dropdownStyle={{
                  backgroundColor: "#0a0a0b",
                  color: "white",
                  border: "1px solid #4a4a4a",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  position: "absolute",
                  bottom: "100%",
                  zIndex: 9999,
                }}
                dropdownClass="iti__country-list"
                buttonStyle={{
                  backgroundColor: "0a0a0b",
                  border: "1px solid #4a4a4a",
                  color: "white",
                  outline: "none",
                  transition: "none",
                  borderRadius: "4px",
                }}
              />
            </div>
            {/* Display phone validation error */}
            {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full p-2 rounded-3xl bg-gradient-to-r from-[#c088fb] to-[#6d28d9] text-white font-bold hover:from-[#6d28d9] hover:to-[#c088fb] transition-all"
            disabled={isSubmitting} // Disable button while submitting
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>

      {/* Google Maps embed */}
      <div className="w-full max-w-2xl mt-8 md:mt-0 md:ml-8 h-80 md:h-96">
        <iframe
          title="Google Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345091843!2d144.9537353153175!3d-37.81627917975126!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf0727dbd1d67a29!2sMelbourne%20VIC%2C%20Australia!5e0!3m2!1sen!2sin!4v1674224556731!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};

export default ContactUs; // Export the component