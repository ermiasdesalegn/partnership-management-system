import { useEffect, useState } from "react";
import { FaChevronDown, FaQuestion } from "react-icons/fa";
import faqs from "../../services/static/faq";

const FAQ = () => {
  const [displayFAQ, setDisplayFAQ] = useState([]);
  const [message, setMessage] = useState("");

  const [open, setOpen] = useState(null);
  const [loading, setLoading] = useState(true);

  const toggleAccordion = (index) => {
    setOpen(open === index ? null : index);
  };

  const searchFAQ = (e) => {
    const searchValue = e.target.value.toLowerCase();

    if (!searchValue) return setDisplayFAQ(faqs.slice(0, 5));

    const filteredFAQ = faqs.filter((faq) => {
      return (
        faq.question.toLowerCase().includes(searchValue) ||
        faq.answer.toLowerCase().includes(searchValue)
      );
    });

    if (!filteredFAQ.length) {
      setMessage("No FAQ found");
      setDisplayFAQ([]);
    } else {
      setMessage("");
      setDisplayFAQ(filteredFAQ.slice(0, 5));
    }
  };

  useEffect(() => {
    setDisplayFAQ(faqs.slice(0, 5));
    setLoading(false);
  }, []);

  if (loading)
    return <div className="flex justify-center items-center">Loading...</div>;

  return (
    <div id="faq" className="font--poppins mt-12 p-5 bg-bg-color rounded-lg shadow-md">
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold text-text-h1">
          Frequently Asked Questions
        </h1>
        <p className="text-lg text-text-p mt-2">
          Find answers to common questions about our platform and services.
        </p>
        <input
          type="text"
          placeholder="Search FAQ"
          className="w-3/5 mx-auto mt-4 p-2 ps-6 border border-text-grey rounded-2xl"
          onChange={searchFAQ}
        />
        {message && <p className="text-text-p text-center mt-2">{message}</p>}
      </div>
      <div className="mt-3 space-y-2">
        {displayFAQ.map((faq, index) => (
          <div
            key={index}
            className="border-b max-w-4xl mx-auto border-text-grey"
          >
            <button
              onClick={() => toggleAccordion(index)}
              className={`flex justify-between items-center w-full p-5 text-text-h2 font-medium bg-white transition-all duration-600 ease-in-out hover:bg-text-h2 hover:text-btn-text
               ${open === index ? "bg--btn-disabled" : ""}`}
            >
              <span className="flex items-center">
                <FaQuestion className="mr-2" />
                {faq.question}
              </span>
              <FaChevronDown
                className={`w-3 h-3 transform ${
                  open === index ? "rotate-180" : ""
                }`}
              />
            </button>
            {open === index && (
              <div className="p-5 text-[var(--color-text-p)]">
                <p>{faq.answer}</p>
                {faq.link && (
                  <p>
                    <a
                      href={faq.link.url}
                      className="text-[var(--color-btn-default)] hover:underline"
                    >
                      {faq.link.text}
                    </a>
                  </p>
                )}
                {faq.extra && <p>{faq.extra}</p>}
                {faq.links && (
                  <ul className="list-disc ml-5">
                    {faq.links.map((link, i) => (
                      <li key={i}>
                        <a
                          href={link.url}
                          className="text-[var(--color-btn-default)] hover:underline"
                        >
                          {link.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
