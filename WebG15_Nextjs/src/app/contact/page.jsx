"use client"

const ContactUsPage = () => {
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-slate-900 flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
                {/* Left Section */}
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
                                <img src="/icons/envelope-at-fill.svg" alt="e-mail" className="w-6 h-6"></img>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-700 dark:text-gray-200">Email</h3>
                                <p className="text-gray-500 dark:text-gray-400">kfir.amoyal@e.braude.ac.il</p>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-blue-100 rounded-full">
                                <img src="/icons/geo-alt-fill.svg" alt="location" className="w-6 h-6"></img>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-700 dark:text-gray-200">Location</h3>
                                <p className="text-gray-500 dark:text-gray-400">Snunit St 51, Karmiel, 2161002, Israel</p>
                            </div>
                        </div>

                        {/* Working Hours */}
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-blue-100 rounded-full">
                                <img src="/icons/clock-fill.svg" alt="clock" className="w-6 h-6"></img>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-700 dark:text-gray-200">Working Hours</h3>
                                <p className="text-gray-500 dark:text-gray-400">Monday to Saturday</p>
                                <p className="text-gray-500 dark:text-gray-400">9:00 AM to 6:00 PM</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Section */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white text-center">Contact Us</h2>
                    <form className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="First Name *"
                                className="p-3 w-full rounded border border-gray-300 dark:border-gray-600 dark:bg-slate-700"
                            />
                            <input
                                type="text"
                                placeholder="Last Name *"
                                className="p-3 w-full rounded border border-gray-300 dark:border-gray-600 dark:bg-slate-700"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Mobile No *"
                                className="p-3 w-full rounded border border-gray-300 dark:border-gray-600 dark:bg-slate-700"
                            />
                            <input
                                type="email"
                                placeholder="Email ID *"
                                className="p-3 w-full rounded border border-gray-300 dark:border-gray-600 dark:bg-slate-700"
                            />
                        </div>
                        <textarea
                            placeholder="Message"
                            rows="4"
                            className="p-3 w-full rounded border border-gray-300 dark:border-gray-600 dark:bg-slate-700"
                        ></textarea>
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Please type the characters *"
                                className="p-3 w-full rounded border border-gray-300 dark:border-gray-600 dark:bg-slate-700"
                            />
                            <div className="flex items-center justify-center bg-gray-200 dark:bg-slate-700 p-3 rounded">
                                <span className="text-gray-800 dark:text-white">p s t 5 s</span>
                            </div>
                        </div>
                        <button type="submit" className="w-full p-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all">
                            Submit <i className="fas fa-paper-plane"></i>
                        </button>
                    </form>
                </div>
            </div>

            {/* Penguin Image at the Bottom */}
            <div className="w-32 h-auto mx-auto flex justify-center items-center">
                <img src="/pingwingSimple.png" alt="Pingwing Simple" className="w-full h-auto rounded-lg p-9" />
            </div>
        </div>
    )
}

export default ContactUsPage
