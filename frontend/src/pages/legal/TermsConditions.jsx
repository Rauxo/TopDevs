import React from "react";

const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-[#0ff4ce] py-24 px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight">Terms & <br className="hidden md:block" /> Conditions</h1>
        <p className="text-slate-700 font-bold uppercase tracking-widest text-sm">Last Updated: May 2026</p>
      </div>

      <div className="max-w-4xl mx-auto py-20 px-6">
        <div className="space-y-16">
          <section className="relative group">
            <span className="absolute -left-8 top-0 text-4xl font-black text-emerald-100 group-hover:text-emerald-200 transition-colors">01</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-6">Acceptance of Terms</h2>
            <p className="text-slate-600 leading-relaxed text-lg">
              By accessing and using TopDevs, you agree to be bound by these Terms and Conditions. Our platform is designed to connect talented developers with premium opportunities. If you do not agree with any part of these terms, you must not use our services.
            </p>
          </section>

          <section className="relative group">
             <span className="absolute -left-8 top-0 text-4xl font-black text-emerald-100 group-hover:text-emerald-200 transition-colors">02</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-6">User Accounts</h2>
            <p className="text-slate-600 leading-relaxed text-lg mb-4">
              To access certain features, you must create an account. You are responsible for maintaining the confidentiality of your credentials.
            </p>
            <ul className="space-y-3 text-slate-600">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2.5 flex-shrink-0"></span>
                <span>Provide accurate and complete information during registration.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2.5 flex-shrink-0"></span>
                <span>You must be at least 18 years old to use this platform.</span>
              </li>
            </ul>
          </section>

          <section className="relative group">
             <span className="absolute -left-8 top-0 text-4xl font-black text-emerald-100 group-hover:text-emerald-200 transition-colors">03</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-6">Intellectual Property</h2>
            <p className="text-slate-600 leading-relaxed text-lg">
              All content, including but not limited to logos, text, graphics, and software, is the property of TopDevs or its licensors and is protected by copyright laws. You may not reproduce, distribute, or create derivative works without explicit permission.
            </p>
          </section>

          <section className="relative group p-10 bg-slate-50 rounded-[40px] border border-slate-100">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-6">Termination</h2>
            <p className="text-slate-600 leading-relaxed text-lg">
              We reserve the right to suspend or terminate your account at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users or our business interests.
            </p>
          </section>

          <section className="relative group">
             <span className="absolute -left-8 top-0 text-4xl font-black text-emerald-100 group-hover:text-emerald-200 transition-colors">04</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-6">Limitation of Liability</h2>
            <p className="text-slate-600 leading-relaxed text-lg">
              TopDevs provides this platform on an "as is" basis. We do not guarantee that the service will be uninterrupted or error-free. In no event shall we be liable for any indirect, incidental, or consequential damages arising out of your use of the platform.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
