import TopContactDecore from "./TopContactDecore";
import TopDecore from "./TopDecore";
import CircleDecore from "./CircleDecore";
import ContactInputBox from "./ContactInputBox";
import ContactTextArea from "./ContactTextArea";
import api from "../../../api";
import { useState } from "react";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    details: "",
  });

  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/v1/support", formData);
      setSuccessMessage("Message sent successfully!");
      console.log("Message sent successfully:", response.data);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="w-full px-4 lg:w-1/2 xl:w-5/12">
      <div className="relative rounded-lg bg-bg-color p-8 shadow-lg dark:bg-dark-2 sm:p-12">
        <form onSubmit={handleSubmit}>
          <ContactInputBox
            type="text"
            name="name"
            placeholder="Your Name"
            onChange={handleChange}
          />
          <ContactInputBox
            type="text"
            name="email"
            placeholder="Your Email"
            onChange={handleChange}
          />
          <ContactInputBox
            type="text"
            name="phone"
            placeholder="Your Phone"
            onChange={handleChange}
          />
          <ContactTextArea
            row="6"
            placeholder="Your Message"
            name="details"
            defaultValue=""
            onChange={handleChange}
          />
          <div>
            <button
              type="submit"
              className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-[var(--color-btn-default)] hover:bg-[var(--color-btn-hover)] focus:ring-4 focus:ring-[var(--color-btn-active)] dark:focus:ring-primary-900"
            >
              Send Message
            </button>
          </div>
        </form>
        {successMessage && (
          <div className="mt-4 text-green-500">{successMessage}</div>
        )}
        <div>
          <TopContactDecore />
          <TopDecore />
          <CircleDecore />
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
