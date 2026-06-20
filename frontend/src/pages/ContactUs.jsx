import React, { useState } from "react";
import { MapPin, Mail, PartyPopper } from "lucide-react";

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-24 px-6 overflow-hidden relative">
      {/* Decorative Circles */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#0ff4ce]/20 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left Column: Content */}
          <div>
            <span className="text-blue-600 font-black text-xs uppercase tracking-[0.3em] mb-6 block">Get in Touch</span>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 leading-none">Let's build <br /> something <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-500">incredible.</span></h1>
            
            <p className="text-lg text-slate-500 mb-12 max-w-md font-medium">
              Have a question about the platform? Or just want to say hi? We'd love to hear from you.
            </p>

            <div className="space-y-8">
               <div className="flex items-center gap-6 group cursor-pointer">
                  <div className="w-16 h-16 rounded-3xl bg-white shadow-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900">Our Studio</h3>
                    <p className="text-sm text-slate-400 font-medium">123 Tech Avenue, Silicon Valley, CA</p>
                  </div>
               </div>
               <div className="flex items-center gap-6 group cursor-pointer">
                  <div className="w-16 h-16 rounded-3xl bg-white shadow-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900">Email Us</h3>
                    <p className="text-sm text-slate-400 font-medium">hello@topdevs.com</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="bg-white p-10 md:p-16 rounded-[48px] shadow-[0_32px_80px_rgba(0,0,0,0.08)] border border-slate-100">
            {submitted ? (
              <div className="text-center py-20 animate-bounce-in">
                 <div className="text-blue-500 mb-6 flex justify-center">
                    <PartyPopper size={64} />
                  </div>
                 <h2 className="text-3xl font-black text-slate-900 mb-4">Message Sent!</h2>
                 <p className="text-slate-500 font-medium">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Your Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="John Doe"
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-slate-800"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                    <input 
                      type="email" 
                      required
                      placeholder="john@example.com"
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-slate-800"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subject</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Inquiry about jobs"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-slate-800"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Message</label>
                  <textarea 
                    rows="5"
                    required
                    placeholder="Tell us more..."
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-slate-800 resize-none"
                  ></textarea>
                </div>
                
                <button 
                  type="submit"
                  className="w-full py-5 bg-slate-900 text-white font-black text-sm uppercase tracking-widest rounded-[20px] hover:bg-blue-600 hover:-translate-y-1 shadow-xl shadow-slate-200 active:scale-95 transition-all"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
