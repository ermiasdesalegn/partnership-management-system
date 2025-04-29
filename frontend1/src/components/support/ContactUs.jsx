import ContactForm from "./components/ContactForm";
import ContactDetails from "./components/ContactDetails";

const Contact = () => {
  return (
    <>
      <section className="relative z-10 overflow-hidden max-w-screen h-scereen bg-white py-20 px-24 lg:py-24">
        <div className="container">
          <div className="-mx-4 flex flex-wrap lg:justify-between">
            <ContactDetails />
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
