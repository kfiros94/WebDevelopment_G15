"use client"

import { useState } from "react"
import { db } from "../../utils/firebaseConfig"
import { collection, addDoc } from "firebase/firestore"

const ContactUsPage = () => {
    // State to hold form input data
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        mobile: "",
        email: "",
        message: "",
    })

    // State for status messages (success or error)
    const [status, setStatus] = useState("")

    /**
     * handleChange:
     * Updates the corresponding field in formData
     * whenever a user types in an input or textarea.
     */
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    /**
     * handleSubmit:
     * Called when the user submits the form.
     * It saves the form data to the 'contactRequests' collection in Firestore.
     */
    const handleSubmit = async (e) => {
        e.preventDefault()
        setStatus("")

        try {
            // Add a new doc to 'contactRequests' in Firestore, including a timestamp
            await addDoc(collection(db, "contactRequests"), {
                ...formData,
                timestamp: new Date(),
            })
            // Show success message, reset form inputs
            setStatus("Your message has been sent successfully!")
            setFormData({
                firstName: "",
                lastName: "",
                mobile: "",
                email: "",
                message: "",
            })
        } catch (error) {
            console.error("Error submitting request: ", error)
            setStatus("Failed to send your message. Please try again.")
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-slate-900 flex flex-col items-center justify-center px-4 py-8 sm:px-6 md:px-8">
            {/*
        Main container with a grid that splits into two columns (left info, right form) on md+ screens.
        On smaller screens, it's a single column.
      */}
            <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-8 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
                {/* Left Section: Contact details, location, working hours, etc. */}
                <div className="space-y-8">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Get In Touch With Us Now!</h2>
                    <div className="space-y-6">
                        {/* Phone */}
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-blue-100 rounded-full">
                                <img src="/icons/telephone-fill.svg" alt="Phone Icon" className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-700 dark:text-gray-200">Phone Number</h3>
                                <p className="text-gray-500 dark:text-gray-400">+972 52707 6342</p>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-blue-100 rounded-full">
                                <img src="/icons/envelope-at-fill.svg" alt="e-mail" className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-700 dark:text-gray-200">Email</h3>
                                <p className="text-gray-500 dark:text-gray-400">kfir.amoyal@e.braude.ac.il</p>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-blue-100 rounded-full">
                                <img src="/icons/geo-alt-fill.svg" alt="location" className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-700 dark:text-gray-200">Location</h3>
                                <p className="text-gray-500 dark:text-gray-400">Snunit St 51, Karmiel, 2161002, Israel</p>
                            </div>
                        </div>

                        {/* Working Hours */}
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-blue-100 rounded-full">
                                <img src="/icons/clock-fill.svg" alt="clock" className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-700 dark:text-gray-200">Working Hours</h3>
                                <p className="text-gray-500 dark:text-gray-400">Monday to Saturday</p>
                                <p className="text-gray-500 dark:text-gray-400">9:00 AM to 6:00 PM</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Section: Contact Form */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white text-center">Contact Us</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/*
              Two rows of inputs, each row can become 2 columns on sm+ screens.
              First row: First Name, Last Name
              Second row: Mobile No, Email
            */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First Name *"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="p-3 w-full rounded border border-gray-300 dark:border-gray-600 dark:bg-slate-700"
                                required
                            />
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last Name *"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="p-3 w-full rounded border border-gray-300 dark:border-gray-600 dark:bg-slate-700"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input
                                type="text"
                                name="mobile"
                                placeholder="Mobile No *"
                                value={formData.mobile}
                                onChange={handleChange}
                                className="p-3 w-full rounded border border-gray-300 dark:border-gray-600 dark:bg-slate-700"
                                required
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email ID *"
                                value={formData.email}
                                onChange={handleChange}
                                className="p-3 w-full rounded border border-gray-300 dark:border-gray-600 dark:bg-slate-700"
                                required
                            />
                        </div>
                        <textarea
                            name="message"
                            placeholder="Message"
                            rows="4"
                            value={formData.message}
                            onChange={handleChange}
                            className="p-3 w-full rounded border border-gray-300 dark:border-gray-600 dark:bg-slate-700"
                            required
                        />
                        <button type="submit" className="w-full p-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all">
                            Submit <i className="fas fa-paper-plane"></i>
                        </button>
                    </form>
                    {/* Status message: success or error */}
                    {status && <p className="text-center mt-4 text-blue-600">{status}</p>}
                </div>
            </div>

            {/*
        Penguin Image at the bottom 
        (responsive width: 24px on tiny screens, 32px on sm+ screens)
      */}
            <div className="w-24 sm:w-32 h-auto mx-auto flex justify-center items-center mt-4">
                <img src="/pingwingSimple.png" alt="Pingwing Simple" className="w-full h-auto rounded-lg p-6 sm:p-9" />
            </div>
        </div>
    )
}

export default ContactUsPage
