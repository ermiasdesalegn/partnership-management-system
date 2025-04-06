import { useState } from "react";

const BlogForm = ({ onSubmit }) => {
  const [blogData, setBlogData] = useState({
    title: "",
    description: "",
    date: "",
    author: "",
    category: "",
    fullText: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlogData({ ...blogData, [name]: value });
    validateField(name, value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: "File size must be less than 5MB.",
        }));
        return;
      }
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          image: "Only image files are allowed.",
        }));
        return;
      }
      setBlogData((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const validateField = (field, value) => {
    setErrors((prev) => ({
      ...prev,
      [field]: value.trim()
        ? ""
        : `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let isValid = true;
    const finalErrors = {};

    Object.entries(blogData).forEach(([key, value]) => {
      if (!value && key !== "image") {
        finalErrors[key] = `${
          key.charAt(0).toUpperCase() + key.slice(1)
        } is required.`;
        isValid = false;
      }
    });

    if (!isValid) {
      setErrors(finalErrors);
      return;
    }

    onSubmit(blogData);
  };

  return (
    <section className="w-full bg-white min-h-screen flex items-center justify-center">
      <div className="py-8 px-6 mx-auto max-w-6xl w-full lg:py-16">
        <h2 className="mb-4 text-xl font-bold text-gray-900">
          Publish Your Blog
        </h2>
        <form onSubmit={handleSubmit} className="w-full">
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            {["title", "author", "category"].map((field) => (
              <div key={field} className="w-full">
                <label
                  htmlFor={field}
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type="text"
                  name={field}
                  id={field}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder={`Enter ${field}`}
                  value={blogData[field]}
                  onChange={handleChange}
                  required
                />
                {errors[field] && (
                  <span className="text-red-500 text-xs">{errors[field]}</span>
                )}
              </div>
            ))}
            <div className="sm:col-span-2">
              <label
                htmlFor="description"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Short Description
              </label>
              <textarea
                id="description"
                name="description"
                rows="2"
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Short description"
                value={blogData.description}
                onChange={handleChange}
                required
              ></textarea>
              {errors.description && (
                <span className="text-red-500 text-xs">
                  {errors.description}
                </span>
              )}
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="fullText"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Full Blog Content
              </label>
              <textarea
                id="fullText"
                name="fullText"
                rows="4"
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Full blog content"
                value={blogData.fullText}
                onChange={handleChange}
                required
              ></textarea>
              {errors.fullText && (
                <span className="text-red-500 text-xs">{errors.fullText}</span>
              )}
            </div>
            <div className="sm:col-span-2">
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Upload Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
              />
              {imagePreview && (
                <div className="mt-4 relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-36 h-36 object-cover rounded-lg"
                  />
                </div>
              )}
              {errors.image && (
                <span className="text-red-500 text-xs mt-2 block">
                  {errors.image}
                </span>
              )}
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Publish Blog
          </button>
        </form>
      </div>
    </section>
  );
};

export default BlogForm;
