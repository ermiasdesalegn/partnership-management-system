import  {useState} from "react"
import {
  FaSearch,
  FaStar,
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaCommentDots,
  FaUser,
  FaEnvelope,
  FaComment,
  FaInfoCircle,
  FaCalendarAlt
} from "react-icons/fa"

const Feedbacks = () => {
  const [feedback, setFeedback] = useState([
    {
      id: 1,
      user: "John Doe",
      email: "john.doe@example.com",
      rating: 5,
      message: "Great service! Very satisfied with the support.",
      date: "2023-10-01",
      details:
        "The support team was very helpful and resolved my issue quickly."
    },
    {
      id: 2,
      user: "Jane Smith",
      email: "jane.smith@example.com",
      rating: 4,
      message: "Good experience, but the app could be faster.",
      date: "2023-10-05",
      details: "The app is user-friendly but lags when loading large datasets."
    },
    {
      id: 3,
      user: "Jane Smith",
      email: "jane.smith@example.com",
      rating: 4,
      message: "Good experience, but the app could be faster.",
      date: "2023-10-05",
      details: "The app is user-friendly but lags when loading large datasets."
    },
    {
      id: 4,
      user: "Jane Smith",
      email: "jane.smith@example.com",
      rating: 4,
      message: "Good experience, but the app could be faster.",
      date: "2023-10-05",
      details: "The app is user-friendly but lags when loading large datasets."
    },
    {
      id: 5,
      user: "Jane Smith",
      email: "jane.smith@example.com",
      rating: 4,
      message: "Good experience, but the app could be faster.",
      date: "2023-10-05",
      details: "The app is user-friendly but lags when loading large datasets."
    },
    {
      id: 6,
      user: "Jane Smith",
      email: "jane.smith@example.com",
      rating: 4,
      message: "Good experience, but the app could be faster.",
      date: "2023-10-05",
      details: "The app is user-friendly but lags when loading large datasets."
    },
    {
      id: 7,
      user: "Jane Smith",
      email: "jane.smith@example.com",
      rating: 4,
      message: "Good experience, but the app could be faster.",
      date: "2023-10-05",
      details: "The app is user-friendly but lags when loading large datasets."
    }
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedFeedback, setSelectedFeedback] = useState(null)
  const itemsPerPage = 10

  const filteredFeedback = feedback.filter(
    (item) =>
      item.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.message.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // ==============================================
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentFeedback = filteredFeedback.slice(
    indexOfFirstItem,
    indexOfLastItem
  )

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber)
  const handleDeleteFeedback = (id) =>
    setFeedback((prev) => prev.filter((item) => item.id !== id))
  const handleRowClick = (item) => setSelectedFeedback(item)
  const closeDetails = () => setSelectedFeedback(null)

  return (
    <div className='p-6 bg-gray-100 min-h-screen w-full'>
      <h1 className='text-2xl font-bold text-gray-800 mb-6'>Feedback</h1>

      <div className='relative mb-6'>
        <input
          type='text'
          placeholder='Search feedback...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='w-full px-4 py-2 pl-10 border bg-white border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500'
        />
        <FaSearch className='absolute left-3 top-3 text-gray-500' />
      </div>

      <div className='bg-white rounded-lg shadow-lg overflow-x-auto'>
        <table className='w-full'>
          <thead className='bg-gray-100'>
            <tr>
              <th className='px-4 py-3 text-left text-sm font-medium text-gray-700'>
                No.
              </th>
              <th className='px-4 py-3 text-left text-sm font-medium text-gray-700'>
                User
              </th>
              <th className='px-4 py-3 text-left text-sm font-medium text-gray-700'>
                Email
              </th>
              <th className='px-4 py-3 text-left text-sm font-medium text-gray-700'>
                Rating
              </th>
              <th className='px-4 py-3 text-left text-sm font-medium text-gray-700'>
                Message
              </th>
              <th className='px-4 py-3 text-left text-sm font-medium text-gray-700'>
                Date
              </th>
              <th className='px-4 py-3 text-left text-sm font-medium text-gray-700'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200'>
            {currentFeedback.map((item, index) => (
              <tr
                key={item.id}
                className='hover:bg-gray-50 cursor-pointer'
                onClick={() => handleRowClick(item)}
              >
                <td className='px-4 py-4 text-sm text-gray-800'>
                  {indexOfFirstItem + index + 1}
                </td>

                <td className='px-4 py-4 text-sm text-gray-800'>{item.user}</td>
                <td className='px-4 py-4 text-sm text-gray-800'>
                  {item.email}
                </td>
                <td className='px-4 py-4 text-sm text-gray-800 flex items-center'>
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={
                        i < item.rating ? "text-yellow-400" : "text-gray-300"
                      }
                    />
                  ))}
                </td>
                <td className='px-4 py-4 text-sm text-gray-800'>
                  {item.message}
                </td>
                <td className='px-4 py-4 text-sm text-gray-800'>{item.date}</td>
                <td className='px-4 py-4 text-sm text-gray-800'>
                  <button
                    className='text-red-500 hover:text-red-700'
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteFeedback(item.id)
                    }}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className='flex justify-center items-center mt-6'>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className='px-4 py-2 bg-gray-300 rounded-lg '
        >
          <FaChevronLeft />
        </button>
        <span className='text-sm text-gray-700 mx-6'>
          Page {currentPage} of
          {Math.ceil(filteredFeedback.length / itemsPerPage)}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={
            currentPage === Math.ceil(filteredFeedback.length / itemsPerPage)
          }
          className='px-4 py-2 bg-gray-300 rounded-lg'
        >
          <FaChevronRight />
        </button>
      </div>

      {selectedFeedback && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4'>
          <div className='bg-white rounded-lg shadow-lg w-full max-w-2xl p-6'>
            {/* Modal Header */}
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-xl font-bold text-gray-800 flex items-center'>
                <FaCommentDots className='text-indigo-600 mr-2' /> Feedback
                Details
              </h2>
              <button
                onClick={closeDetails}
                className='text-gray-500 hover:text-gray-700'
              >
                <FaTimes />
              </button>
            </div>

            {/* Modal Content */}
            <div className='space-y-4'>
              {/* User Section */}
              <div className='flex items-center space-x-4'>
                <div className='p-3 bg-indigo-50 rounded-full'>
                  <FaUser className='text-indigo-600' />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    User
                  </label>
                  <p className='mt-1 text-sm text-gray-900'>
                    {selectedFeedback.user}
                  </p>
                </div>
              </div>

              {/* Email Section */}
              <div className='flex items-center space-x-4'>
                <div className='p-3 bg-indigo-50 rounded-full'>
                  <FaEnvelope className='text-indigo-600' />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Email
                  </label>
                  <p className='mt-1 text-sm text-gray-900'>
                    {selectedFeedback.email}
                  </p>
                </div>
              </div>

              {/* Rating Section */}
              <div className='flex items-center space-x-4'>
                <div className='p-3 bg-indigo-50 rounded-full'>
                  <FaStar className='text-indigo-600' />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Rating
                  </label>
                  <div className='flex items-center mt-1'>
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`${
                          i < selectedFeedback.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Message Section */}
              <div className='flex items-center space-x-4'>
                <div className='p-3 bg-indigo-50 rounded-full'>
                  <FaComment className='text-indigo-600' />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Message
                  </label>
                  <p className='mt-1 text-sm text-gray-900'>
                    {selectedFeedback.message}
                  </p>
                </div>
              </div>

              {/* Details Section */}
              <div className='flex items-center space-x-4'>
                <div className='p-3 bg-indigo-50 rounded-full'>
                  <FaInfoCircle className='text-indigo-600' />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Details
                  </label>
                  <p className='mt-1 text-sm text-gray-900'>
                    {selectedFeedback.details}
                  </p>
                </div>
              </div>

              {/* Date Section */}
              <div className='flex items-center space-x-4'>
                <div className='p-3 bg-indigo-50 rounded-full'>
                  <FaCalendarAlt className='text-indigo-600' />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Date
                  </label>
                  <p className='mt-1 text-sm text-gray-900'>
                    {selectedFeedback.date}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className='mt-6 flex justify-end space-x-4'>
              <button
                onClick={() => {
                  handleDeleteFeedback(selectedFeedback.id)
                  closeDetails()
                }}
                className='flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300'
              >
                <FaTrash className='mr-2' /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Feedbacks
