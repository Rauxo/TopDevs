import React, { useState } from "react";
import { MapPin, Mail, CheckCircle2, MessageSquare, Loader2 } from "lucide-react";
import API from "../API/api";

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await API.post("/contact", formData);
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Page Header ── */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-900 text-white rounded">
              <MessageSquare size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900">Contact Us</h1>
              <p className="text-slate-500 mt-1">Get in touch with the TopDevs team</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column: Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white border border-slate-200 p-6 rounded">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <MapPin size={18} className="text-blue-600" /> Our Studio
              </h3>
              <p className="text-slate-600 text-sm">
                123 Tech Avenue<br />
                Silicon Valley, CA 94025<br />
                United States
              </p>
            </div>

            <div className="bg-white border border-slate-200 p-6 rounded">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Mail size={18} className="text-blue-600" /> Email Us
              </h3>
              <p className="text-slate-600 text-sm">
                hello@topdevs.com<br />
                support@topdevs.com
              </p>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-slate-200 rounded p-8">
              {submitted ? (
                <div className="text-center py-16">
                  <div className="text-blue-600 mb-4 flex justify-center">
                    <CheckCircle2 size={48} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Message Sent!</h2>
                  <p className="text-slate-500">We've received your message and will get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Your Name</label>
                      <input 
                        type="text" 
                        required
                        placeholder="John Doe"
                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors text-slate-900"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Email Address</label>
                      <input 
                        type="email" 
                        required
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors text-slate-900"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Subject</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Inquiry about jobs"
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors text-slate-900"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Message</label>
                    <textarea 
                      rows="5"
                      required
                      placeholder="Tell us more..."
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors text-slate-900 resize-y"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    ></textarea>
                  </div>
                  
                  {error && (
                    <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded text-sm font-medium">
                      {error}
                    </div>
                  )}
                  
                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition-colors disabled:bg-blue-400 flex justify-center items-center gap-2"
                  >
                    {loading ? <><Loader2 size={18} className="animate-spin" /> Sending...</> : "Send Message"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContactUs;
