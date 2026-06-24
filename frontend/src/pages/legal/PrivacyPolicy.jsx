import React from "react";
import { User, Mail, ShieldCheck, Shield } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Page Header ── */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-900 text-white rounded">
              <Shield size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900">Privacy Policy</h1>
              <p className="text-slate-500 mt-1">Our commitment to protecting your data</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Sidebar Navigation */}
          <aside className="hidden md:block md:col-span-1 sticky top-32 h-fit">
             <nav className="space-y-2 bg-white border border-slate-200 p-4 rounded">
                <a href="#collection" className="block text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors py-2">Data Collection</a>
                <a href="#usage" className="block text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors py-2 border-t border-slate-100">Data Usage</a>
                <a href="#security" className="block text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors py-2 border-t border-slate-100">Security Measures</a>
             </nav>
          </aside>

          {/* Main Content */}
          <div className="md:col-span-3 space-y-12">
            <section id="collection" className="bg-white border border-slate-200 p-8 rounded">
              <h2 className="text-2xl font-black text-slate-900 mb-6">01. What We Collect</h2>
              <div className="space-y-6 text-slate-600 leading-relaxed text-sm">
                <p>
                  When you register on TopDevs, we collect personal information such as your name, email address, and professional background to create your profile and match you with relevant opportunities.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 border border-slate-200 rounded">
                    <span className="text-blue-600 mb-3 block"><User size={20} /></span>
                    <h3 className="font-bold text-slate-900 mb-1">Identity Data</h3>
                    <p className="text-xs text-slate-500">Username, full name, and profile images.</p>
                  </div>
                  <div className="p-4 border border-slate-200 rounded">
                    <span className="text-blue-600 mb-3 block"><Mail size={20} /></span>
                    <h3 className="font-bold text-slate-900 mb-1">Contact Data</h3>
                    <p className="text-xs text-slate-500">Email address and phone number.</p>
                  </div>
                </div>
              </div>
            </section>

            <section id="usage" className="bg-white border border-slate-200 p-8 rounded">
              <h2 className="text-2xl font-black text-slate-900 mb-6">02. How We Use It</h2>
              <p className="text-slate-600 leading-relaxed text-sm mb-6">
                Your data is primarily used to provide and improve our services. This includes:
              </p>
              <ul className="space-y-3">
                {[
                  "Personalizing your dashboard experience.",
                  "Connecting you with potential employers or developers.",
                  "Ensuring platform security and preventing fraud.",
                  "Communicating important updates and newsletters."
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 p-3 bg-slate-50 border border-slate-100 rounded">
                    <span className="w-6 h-6 rounded bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">{i+1}</span>
                    <span className="text-slate-700 text-sm font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section id="security" className="p-8 bg-slate-900 rounded text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-10 text-white pointer-events-none">
                <ShieldCheck size={100} />
              </div>
              <h2 className="text-2xl font-black mb-4 relative z-10">03. Security First</h2>
              <p className="text-slate-400 leading-relaxed text-sm relative z-10">
                We implement industry-standard encryption and security protocols to protect your personal data from unauthorized access, disclosure, or destruction. Your data is stored on secure servers with restricted access.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
