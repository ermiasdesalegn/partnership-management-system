import React, { useState, useEffect } from "react";
import { FaArrowRight } from "react-icons/fa";
import ScrollReveal from "scrollreveal";
import article1 from '../../assets/article1.jpg';
import article2 from '../../assets/article2.jpeg';
import article3 from '../../assets/article3.jpeg';
import article from '../../assets/article.jpg';
import ethiopia from '../../assets/ethiopia.jpg';
import illustration from '../../assets/illustration.webp';
import Startup from '../../assets/partnership-types-images/Startup.jpg';

const BlogData = [
  {
    date: "Dec 22, 2023",
    CardTitle: "Introducing AutoManage: Revolutionizing Partnership Management",
    CardDescription:
      "AutoManage provides innovative AI tools for efficient partnership management, helping organizations streamline collaboration...",
    image: article1,
    fullDescription:
      "AutoManage provides innovative AI tools for efficient partnership management, helping organizations streamline collaboration and improve overall performance. AutoManage is an advanced AI-driven platform that enables organizations to manage their partnerships with greater efficiency. The platform leverages machine learning and data analytics to optimize collaboration, track progress, and ensure long-term success in all business partnerships."
  },
  {
    date: "Feb 20, 2024",
    CardTitle: "Ethiopia's Digital Leap: Partnership Success Stories",
    CardDescription:
      "Discover how digital transformation is reshaping partnerships in Ethiopia and beyond...",
    image: ethiopia,
    fullDescription:
      "Ethiopia is making significant strides in digital transformation, and partnerships are at the core of this progress. Learn how organizations are leveraging technology and collaboration to drive growth and innovation in the region."
  },
  {
    date: "Mar 1, 2024",
    CardTitle: "Startup Spotlight: Building the Future Together",
    CardDescription:
      "Startups are driving innovation in partnership management. See how new ventures are changing the landscape...",
    image: Startup,
    fullDescription:
      "Startups are at the forefront of partnership management innovation. Explore how these agile companies are using technology and creative strategies to build strong, sustainable partnerships."
  }
]

const News = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({});

  const handleOpenModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalContent({});
  };

  useEffect(() => {
    const sr = ScrollReveal({
      origin: "bottom",
      distance: "30px",
      duration: 700,
      reset: false,
    });

    sr.reveal(".blog-card", { interval: 100 });
    sr.reveal(".modal-content", { delay: 300 });

    return () => {
      sr.destroy();
    };
  }, []);

  return (
    <>
      <section className='pb-10 pt-20 lg:pb-20 lg:pt-[120px] bg-bg-color '>
        <div>
          <div className='mx-4 flex flex-wrap'>
            <div className='w-full'>
              <div className='mx-auto mb-[60px] max-w-[510px] text-center lg:mb-20'>
                <h2 className='font-poppins mb-4 text-text-h1 font-bold sm:text-4xl md:text-[40px]'>
                  Our Recent News
                </h2>
                <p className='font-poppins text-text-p'>
                  Stay updated with the latest news about AutoManage and how it
                  is transforming partnership management across industries.
                </p>
              </div>
            </div>
          </div>
          <div className='mx-4 flex flex-wrap'>
            {BlogData.map((blog, index) => (
              <BlogCard
                key={index}
                date={blog.date}
                CardTitle={blog.CardTitle}
                CardDescription={blog.CardDescription}
                image={blog.image}
                fullDescription={blog.fullDescription}
                onReadMore={handleOpenModal}
                className="blog-card"
              />
            ))}
          </div>
        </div>
      </section>
      {isModalOpen && (
        <Modal content={modalContent} onClose={handleCloseModal} className="modal-content" />
      )}
    </>
  );
};

const BlogCard = ({
  image,
  date,
  CardTitle,
  CardDescription,
  fullDescription,
  onReadMore,
  className
}) => {
  return (
    <div className={`w-full px-4 md:w-1/2 lg:w-1/3 ${className}`}>
      <div className='mb-10 w-full shadow-lg rounded-[1rem] hover:scale-102 transition-transform'>
        <div className='mb-8 overflow-hidden rounded'>
          <img src={image} alt='' className='w-full' />
        </div>
        <div className='p-4'>
          {date && (
            <span className='font-poppins mb-5 inline-block rounded bg-[var(--color-btn-default)] px-4 py-1 text-center text-xs font-semibold leading-loose text-[var(--color-btn-text)]'>
              {date}
            </span>
          )}
          <h3 className='font-poppins mb-4 inline-block text-text-h2 font-semibold  sm:text-2xl lg:text-xl xl:text-2xl'>
            {CardTitle}
          </h3>
          <p className='font-poppins text-text-p '>
            {CardDescription}
            <button
              onClick={() =>
                onReadMore({
                  date,
                  CardTitle,
                  CardDescription,
                  fullDescription,
                  image
                })
              }
              className='font-poppins flex items-center gap-2 text-[var(--color-btn-default)] hover:cursor-pointer hover:text-[var(--color-btn-hover)]'
            >
              Read More
              <FaArrowRight
                size={15}
                className='text-[var(--color-btn-default)]'
              />
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

const Modal = ({ content, onClose, className }) => {
  const { date, CardTitle, fullDescription, image } = content;
  return (
    <div className={`font-poppins fixed inset-0 z-50 flex items-center justify-center backdrop-blur bg-opacity-80 ${className}`}>
      <div className='bg-[var(--color-bg-color)] rounded-lg shadow-lg w-[90%] max-w-3xl max-h-[90%] overflow-y-auto'>
        <div className='relative p-6'>
          <img src={image} alt={CardTitle} className='rounded mb-4 w-full' />
          <span className='inline-block text-sm font-semibold text-[var(--color-btn-default)] mb-2'>
            {date}
          </span>
          <h3 className='text-2xl font-bold mb-4 text-[var(--color-text-h2)]'>
            {CardTitle}
          </h3>
          <p className='text-text-p mb-6'>
            {fullDescription}
          </p>
          <button
            onClick={onClose}
            className='absolute mb-4 px-3 py-1 right-6 bottom-0 font-semibold text-[var(--color-btn-text)] bg-[var(--color-btn-default)] rounded hover:bg-[var(--color-btn-hover)] transition-transform'
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default News;