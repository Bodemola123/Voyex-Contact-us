"use client";
import React, { useState } from "react";
import emailjs from "emailjs-com";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";  // Import toast
import "react-toastify/dist/ReactToastify.css";  // Import toast styles
import '../app/globals.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    phone: "",
  });

  const validateEmailWithHunter = async (email) => {
    try {
      const response = await axios.get(
        `https://api.hunter.io/v2/email-verifier?email=${email}&api_key=96038781561cc3023000da4e3dbd7478d113e249`
      );
      return response.data.data.result === "deliverable";
    } catch (error) {
      console.error("Hunter API error:", error);
      return false;
    }
  };

  const validatePhoneWithNumverify = async (phone) => {
    try {
      const response = await axios.get(
        `https://apilayer.net/api/validate?access_key=1e3a2d374e61f3758734566f41c32b0e&number=${phone}`
      );
      return response.data.valid;
    } catch (error) {
      console.error("Numverify API error:", error);
      return false;
    }
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "email") {
      const isValidEmail = await validateEmailWithHunter(value);
      setErrors({ ...errors, email: isValidEmail ? "" : "Invalid email address" });
    }
  };

  const handlePhoneChange = async (value) => {
    setFormData({ ...formData, phone: value });
    const isValidPhone = await validatePhoneWithNumverify(value);
    setErrors({ ...errors, phone: isValidPhone ? "" : "Invalid phone number" });
  };

  const sendEmail = (e) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (errors.email || errors.phone) {
      toast.error("Please fix validation errors before submitting.");
      return;
    }

    emailjs
      .send(
        "service_dvvrehq",
        "template_u4pl4cr",
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        },
        "mgQO4sunPaUIhxonx"
      )
      .then(
        (result) => {
          toast.success("Message sent successfully!");
          setFormData({ firstName: "", lastName: "", email: "", phone: "" });
        },
        (error) => {
          toast.error("Failed to send message. Please try again.");
        }
      );
  };

  return (
    <div className="min-h-screen text-white flex flex-col md:flex-row items-center justify-center p-6">
      {/* Form Section */}
      <ToastContainer/>
      <div className="w-full max-w-lg bg-[#131314] p-6 rounded-xl shadow-2xl border border-[#3a3a3a]">
        <h1 className="text-3xl text-center font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#c088fb] to-[#6d28d9]">
          Get in Touch
        </h1>
        <p className="text-gray-300 mb-6 text-center">
          We will get back to you ASAP!
        </p>

        <form onSubmit={sendEmail} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full p-2 rounded-lg bg-[#0a0a0b] border border-[#4a4a4a] focus:outline-none focus:ring-2 focus:ring-[#c088fb] text-white"
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
                className="w-full p-2 rounded-lg bg-[#0a0a0b] border border-[#4a4a4a] focus:outline-none focus:ring-2 focus:ring-[#c088fb] text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 rounded-lg bg-[#0a0a0b] border border-[#4a4a4a] focus:outline-none focus:ring-2 focus:ring-[#c088fb] text-white"
              required
            />
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
            <div className="relative">
              <PhoneInput
                className="custom-phone-input"
                country={"us"}
                value={formData.phone}
                onChange={handlePhoneChange}
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
                  scrollbarWidth: "none", // Hides scrollbar in Firefox
                  msOverflowStyle: "none", // Hides scrollbar in IE/Edge
                  position: "absolute",
                  bottom: "100%",
                  zIndex: 9999,
                }}
                dropdownClass="iti__country-list" // Apply custom styles from globals.css

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
            {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
          </div>

          <button
            type="submit"
            className="w-full p-2 rounded-lg bg-gradient-to-r from-[#c088fb] to-[#6d28d9] text-white font-bold hover:from-[#6d28d9] hover:to-[#c088fb] transition-all"
          >
            Send Message
          </button>
        </form>
      </div>

      {/* Map Section */}
      <div className="w-full max-w-2xl mt-8 md:mt-0 md:ml-8 h-80 md:h-96">
        <iframe
          title="Google Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345091843!2d144.9537353153175!3d-37.81627917975126!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf0727dbd1d67a29!2sMelbourne%20VIC%2C%20Australia!5e0!3m2!1sen!2sus!4v1615932201105!5m2!1sen!2sus"
          width="100%"
          height="100%"
          className="rounded-xl shadow-2xl border border-[#3a3a3a]"
          style={{ border: 0 }}
          allowFullScreen="true"
          loading="lazy"
        ></iframe>
      </div>

      {/* Toast container */}

    </div>
  );
};

export default ContactUs;
