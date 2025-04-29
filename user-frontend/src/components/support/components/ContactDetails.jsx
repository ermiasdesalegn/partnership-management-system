import { IoHomeOutline, IoMailOutline } from "react-icons/io5";
import { HiOutlinePhone } from "react-icons/hi2";

const ContactDetails = () => {
  return (
    <div className="w-full px-4 lg:w-1/2 xl:w-6/12">
      <div className="mb-12 max-w-[570px] lg:mb-0">
        <span className="mb-4 block text-base font-semibold text-primary">
          Contact Us
        </span>
        <h2 className="mb-6 text-text-h1 font-bold uppercase  sm:text-[40px] lg:text-[36px] xl:text-[40px]">
          GET IN TOUCH WITH US
        </h2>
        <p className="mb-9 text-base leading-relaxed text-text-p">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eius
          tempor incididunt ut labore e dolore magna aliqua. Ut enim adiqua
          minim veniam quis nostrud exercitation ullamco
        </p>
        <div className="mb-8 flex w-full max-w-[370px]">
          <div className="mr-6 flex h-[60px] w-full max-w-[60px] items-center justify-center overflow-hidden rounded bg-primary/5 text-primary sm:h-[70px] sm:max-w-[70px]">
            <IoHomeOutline className="text-3xl text-primary" />
          </div>
          <div className="w-full">
            <h4 className="mb-1 text-xl font-bold text-text-h2">
              Our Location
            </h4>
            <p className="text-base text-text-p">
              99 S.t Jomblo Park Pekanbaru 28292. Indonesia
            </p>
          </div>
        </div>

        <div className="mb-8 flex w-full max-w-[370px]">
          <div className="mr-6 flex h-[60px] w-full max-w-[60px] items-center justify-center overflow-hidden rounded bg-primary/5 text-primary sm:h-[70px] sm:max-w-[70px]">
            <HiOutlinePhone className="text-3xl text-primary" />
          </div>
          <div className="w-full">
            <h4 className="mb-1 text-xl font-bold text-text-h2">
              Phone Number
            </h4>
            <p className="text-base text-text-p">(+62)81 414 257 9980</p>
          </div>
        </div>

        <div className="mb-8 flex w-full max-w-[370px]">
          <div className="mr-6 flex h-[60px] w-full max-w-[60px] items-center justify-center overflow-hidden rounded bg-primary/5 text-primary sm:h-[70px] sm:max-w-[70px]">
            <IoMailOutline className="text-3xl text-primary" />
          </div>
          <div className="w-full">
            <h4 className="mb-1 text-xl font-bold text-text-h2">
              Email Address
            </h4>
            <p className="text-base text-text-p">info@yourdomain.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactDetails;
