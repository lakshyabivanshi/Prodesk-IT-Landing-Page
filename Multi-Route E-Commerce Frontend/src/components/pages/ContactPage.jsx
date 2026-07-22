function ContactPage(){
    return(
        <div className="max-w-2xl mx-auto mt-10 p-8 bg-white shadow-lg rounded-lg">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Contact Us</h2>
            <form className="space-y-4">
                <div>
                    <label className="block font-semibold">Name</label>
                    <input type="text" className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="Your Name"/>
                </div>
                <div>
                    <label className="block font-semibold">Email</label>
                    <input type="email" className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="Your Email"/>
                </div>
                <div>
                    <label className="block font-semibold">Message</label>
                    <textarea className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="How Can We Help?"/>
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-800 transition">Send Message</button>
            </form>
        </div>
    )
}
export default ContactPage;
