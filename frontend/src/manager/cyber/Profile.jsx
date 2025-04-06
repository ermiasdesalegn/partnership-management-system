

import React, {useState} from "react"
import {
  FaEdit,
  FaEnvelope,
  FaUserPlus,
  FaLock,
  FaBell,
  FaCreditCard,
  FaChartLine,
  FaCamera
} from "react-icons/fa"

const CyberProfile = () => {
  const [activeTab, setActiveTab] = useState("personal-info")
  const [editMode, setEditMode] = useState({
    firstName: false,
    lastName: false,
    email: false,
    phone: false
  })
  const [formData, setFormData] = useState({
    firstName: "Alex",
    lastName: "Johnson",
    email: "alex.johnson@example.com",
    phone: "+1 (555) 123-4567",
    profilePhoto: "https://randomuser.me/api/portraits/men/40.jpg", // Default profile photo
    coverPhoto: "https://via.placeholder.com/1200x300" // Default cover photo
  })

  // State for Security Tab
  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  // State for Two-Step Verification
  const [twoStepVerification, setTwoStepVerification] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const [generatedCode, setGeneratedCode] = useState("")
  const [isCodeSent, setIsCodeSent] = useState(false)

  // State for errors
  const [errors, setErrors] = useState({})

  // Handle Tab Click
  const handleTabClick = (tab) => {
    setActiveTab(tab)
  }

  // Handle Edit Click
  const handleEditClick = (field) => {
    setEditMode((prev) => ({...prev, [field]: true}))
  }

  // Handle Cancel Click
  const handleCancelClick = () => {
    setEditMode({
      firstName: false,
      lastName: false,
      email: false,
      phone: false
    })
    setErrors({}) // Clear errors on cancel
  }

  // Validate Form Data
  const validateForm = () => {
    const newErrors = {}
    if (!formData.firstName) newErrors.firstName = "First name is required."
    if (!formData.lastName) newErrors.lastName = "Last name is required."
    if (!formData.email.trim()) {
      newErrors.email = "Email is required."
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)
    ) {
      newErrors.email = "Enter a valid email address."
    }

    if (!formData.phone) newErrors.phone = "Phone is required."
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0 // Return true if no errors
  }

  // Handle Save Click
  const handleSaveClick = () => {
    if (!validateForm()) return // Stop if validation fails
    setEditMode({
      firstName: false,
      lastName: false,
      email: false,
      phone: false
    })
    alert("Profile updated successfully!")
  }

  // Handle Input Change
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({...prev, [field]: value}))
  }

  // Handle Profile Photo Upload
  const handleProfilePhotoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setFormData((prev) => ({...prev, profilePhoto: event.target.result}))
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle Cover Photo Upload
  const handleCoverPhotoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setFormData((prev) => ({...prev, coverPhoto: event.target.result}))
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle Security Input Changes
  const handleSecurityInputChange = (field, value) => {
    setSecurityData((prev) => ({...prev, [field]: value}))
  }

  // Handle Update Password
  const handleUpdatePassword = () => {
    const newErrors = {}

    // Validate current password
    if (!securityData.currentPassword) {
      newErrors.currentPassword = "Current password is required."
    }

    // Validate new password
    if (!securityData.newPassword) {
      newErrors.newPassword = "New password is required."
    } else if (securityData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters long."
    }

    // Validate confirm password
    if (!securityData.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required."
    } else if (securityData.newPassword !== securityData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match."
    }

    // If there are errors, set them and stop
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // If validation passes, proceed with password update
    alert("Password updated successfully!")
    setSecurityData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    })
    setErrors({}) // Clear errors
  }

  // Handle Two-Step Verification Toggle
  const handleTwoStepVerificationToggle = () => {
    if (!twoStepVerification) {
      // Generate a random 6-digit code
      const code = Math.floor(100000 + Math.random() * 900000).toString()
      setGeneratedCode(code)
      setIsCodeSent(true)
      alert(`Verification code sent to ${formData.email}: ${code}`)
    } else {
      setTwoStepVerification(false)
      setIsCodeSent(false)
      setVerificationCode("")
    }
  }

  // Handle Verification Code Submission
  const handleVerificationCodeSubmit = () => {
    if (verificationCode === generatedCode) {
      setTwoStepVerification(true)
      setIsCodeSent(false)
      setVerificationCode("")
      alert("Two-step verification enabled successfully!")
    } else {
      alert("Invalid verification code. Please try again.")
    }
  }

  return (
    <div className='bg-gray-50 min-h-screen w-full'>
      {/* Profile Header */}
      <div>
        {/* <div className='bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg overflow-hidden'>
          <div className='relative h-48'>
            <img
              src={formData.coverPhoto}
              alt='Cover'
              className='w-full h-full object-cover'
            />
            <div className='absolute top-4 right-4'>
              <label className='bg-gray-400 bg-opacity-20 hover:bg-opacity-30 text-white text-sm font-semibold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer'>
                <FaEdit className='inline mr-2' />
                Edit Cover
                <input
                  type='file'
                  accept='image/*'
                  className='hidden'
                  onChange={handleCoverPhotoUpload}
                />
              </label>
            </div>
          </div>
        </div> */}

        <div className='text-center mt-12'>
          <div className='relative inline-block'>
            <img
              src={formData.profilePhoto}
              alt='Profile'
              className='rounded-full border-4 border-white w-32 h-32 object-cover shadow-lg'
            />
            <label className='absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-110 cursor-pointer'>
              <FaCamera />
              <input
                type='file'
                accept='image/*'
                className='hidden'
                onChange={handleProfilePhotoUpload}
              />
            </label>
          </div>
          <h3 className='my-4 text-2xl font-bold text-gray-800'>
            {formData.firstName} {formData.lastName}
          </h3>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className='bg-white shadow-lg'>
        <div className='container mx-auto px-4'>
          <div className='flex justify-center items-center py-4'>
            <div className='flex flex-wrap gap-4'>
              <button
                className={`py-2 px-4 rounded-lg font-semibold ${
                  activeTab === "personal-info"
                    ? "bg-indigo-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => handleTabClick("personal-info")}
              >
                <FaEdit className='inline mr-2' />
                Personal Info
              </button>
              <button
                className={`py-2 px-4 rounded-lg font-semibold ${
                  activeTab === "security"
                    ? "bg-indigo-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => handleTabClick("security")}
              >
                <FaLock className='inline mr-2' />
                Security
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className='container mx-auto px-4 mt-8'>
        <div className='bg-white rounded-lg shadow-lg overflow-hidden'>
          <div className='p-6'>
            {/* Conditional Rendering Based on Active Tab */}
            {activeTab === "personal-info" && (
              <div>
                <h5 className='text-2xl font-bold text-gray-800 mb-6'>
                  Personal Information
                </h5>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                  {/* First Name */}
                  <div>
                    <label className='block text-gray-700 font-medium mb-2'>
                      First Name
                    </label>
                    <div className='relative'>
                      <input
                        type='text'
                        className={`w-full px-4 py-2 bg-white text-gray-800 border ${
                          errors.firstName
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                        value={formData.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        disabled={!editMode.firstName}
                      />
                      <button
                        className='absolute right-2 top-2 text-gray-600 hover:text-indigo-600'
                        onClick={() => handleEditClick("firstName")}
                      >
                        <FaEdit />
                      </button>
                    </div>
                    {errors.firstName && (
                      <p className='text-red-500 text-sm mt-1'>
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className='block text-gray-700 font-medium mb-2'>
                      Last Name
                    </label>
                    <div className='relative'>
                      <input
                        type='text'
                        className={`w-full px-4 py-2 bg-white text-gray-800 border ${
                          errors.lastName ? "border-red-500" : "border-gray-300"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                        value={formData.lastName}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                        disabled={!editMode.lastName}
                      />
                      <button
                        className='absolute right-2 top-2 text-gray-600 hover:text-indigo-600'
                        onClick={() => handleEditClick("lastName")}
                      >
                        <FaEdit />
                      </button>
                    </div>
                    {errors.lastName && (
                      <p className='text-red-500 text-sm mt-1'>
                        {errors.lastName}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className='block text-gray-700 font-medium mb-2'>
                      Email
                    </label>
                    <div className='relative'>
                      <input
                        type='email'
                        className={`w-full px-4 py-2 border bg-white text-gray-800 ${
                          errors.email ? "border-red-500" : "border-gray-300"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        disabled={!editMode.email}
                      />
                      <button
                        className='absolute right-2 top-2 text-gray-600 hover:text-indigo-600'
                        onClick={() => handleEditClick("email")}
                      >
                        <FaEdit />
                      </button>
                    </div>
                    {errors.email && (
                      <p className='text-red-500 text-sm mt-1'>
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className='block text-gray-700 font-medium mb-2'>
                      Phone
                    </label>
                    <div className='relative'>
                      <input
                        type='tel'
                        className={`w-full px-4 py-2 border bg-white text-gray-800 ${
                          errors.phone ? "border-red-500" : "border-gray-300"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        disabled={!editMode.phone}
                      />
                      <button
                        className='absolute right-2 top-2 text-gray-600 hover:text-indigo-600'
                        onClick={() => handleEditClick("phone")}
                      >
                        <FaEdit />
                      </button>
                    </div>
                    {errors.phone && (
                      <p className='text-red-500 text-sm mt-1'>
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Two-Step Verification */}
                  <div className='col-span-2'>
                    <label className='block text-gray-700 font-medium mb-2'>
                      Two-Step Verification
                    </label>
                    <div className='flex flex-col sm:flex-row items-center gap-4'>
                      <button
                        className={`px-4 py-2 rounded-lg font-semibold ${
                          twoStepVerification
                            ? "bg-red-500 text-white"
                            : "bg-indigo-600 text-white"
                        }`}
                        onClick={handleTwoStepVerificationToggle}
                      >
                        {twoStepVerification ? "Disable" : "Enable"}
                      </button>
                      {isCodeSent && (
                        <div className='flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto'>
                          <input
                            type='text'
                            placeholder='Enter verification code'
                            className='w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
                            value={verificationCode}
                            onChange={(e) =>
                              setVerificationCode(e.target.value)
                            }
                          />
                          <button
                            className='w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600'
                            onClick={handleVerificationCodeSubmit}
                          >
                            Confirm
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Save and Cancel Buttons */}
                <div className='flex flex-col sm:flex-row justify-end gap-4 mt-6'>
                  <button
                    className='bg-gray-500 text-white py-2 px-6 rounded-lg font-semibold hover:bg-gray-600 transition duration-300 ease-in-out'
                    onClick={handleCancelClick}
                  >
                    Cancel
                  </button>
                  <button
                    className='bg-indigo-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300 ease-in-out'
                    onClick={handleSaveClick}
                  >
                    Save
                  </button>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div>
                <h5 className='text-2xl font-bold text-gray-800 mb-6'>
                  Security
                </h5>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                  {/* Current Password */}
                  <div>
                    <label className='block text-gray-700 font-medium mb-2'>
                      Current Password
                    </label>
                    <input
                      type='password'
                      className={`w-full px-4 py-2 border bg-white text-gray-800 ${
                        errors.currentPassword
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                      value={securityData.currentPassword}
                      onChange={(e) =>
                        handleSecurityInputChange(
                          "currentPassword",
                          e.target.value
                        )
                      }
                    />
                    {errors.currentPassword && (
                      <p className='text-red-500 text-sm mt-1'>
                        {errors.currentPassword}
                      </p>
                    )}
                  </div>

                  {/* New Password */}
                  <div>
                    <label className='block text-gray-700 font-medium mb-2'>
                      New Password
                    </label>
                    <input
                      type='password'
                      className={`w-full px-4 py-2 border bg-white text-gray-800 ${
                        errors.newPassword
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                      value={securityData.newPassword}
                      onChange={(e) =>
                        handleSecurityInputChange("newPassword", e.target.value)
                      }
                    />
                    {errors.newPassword && (
                      <p className='text-red-500 text-sm mt-1'>
                        {errors.newPassword}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className='block text-gray-700 font-medium mb-2'>
                      Confirm Password
                    </label>
                    <input
                      type='password'
                      className={`w-full px-4 py-2 border bg-white text-gray-800 ${
                        errors.confirmPassword
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                      value={securityData.confirmPassword}
                      onChange={(e) =>
                        handleSecurityInputChange(
                          "confirmPassword",
                          e.target.value
                        )
                      }
                    />
                    {errors.confirmPassword && (
                      <p className='text-red-500 text-sm mt-1'>
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>

                {/* Update Password Button */}
                <div className='flex justify-end mt-6'>
                  <button
                    className='bg-indigo-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300 ease-in-out'
                    onClick={handleUpdatePassword}
                  >
                    Update Password
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CyberProfile
