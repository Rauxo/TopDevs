import React from "react";
import { FileText } from "lucide-react";

const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Page Header ── */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-900 text-white rounded">
              <FileText size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900">Terms & Conditions</h1>
              <p className="text-slate-500 mt-1">Last Updated: May 2026</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white border border-slate-200 rounded p-8 md:p-12 space-y-12">
          
          <section className="border-b border-slate-100 pb-8 last:border-0 last:pb-0">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded bg-blue-100 text-blue-600 flex items-center justify-center text-sm">01</span>
              Acceptance of Terms
            </h2>
            <p className="text-slate-600 leading-relaxed text-sm">
              By accessing and using TopDevs, you agree to be bound by these Terms and Conditions. Our platform is designed to connect talented developers with premium opportunities. If you do not agree with any part of these terms, you must not use our services.
            </p>
          </section>

          <section className="border-b border-slate-100 pb-8 last:border-0 last:pb-0">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded bg-blue-100 text-blue-600 flex items-center justify-center text-sm">02</span>
              User Accounts
            </h2>
            <p className="text-slate-600 leading-relaxed text-sm mb-4">
              To access certain features, you must create an account. You are responsible for maintaining the confidentiality of your credentials.
            </p>
            <ul className="space-y-3 text-slate-600 text-sm">
              <li className="flex items-start gap-3 bg-slate-50 p-3 rounded border border-slate-100">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></span>
                <span>Provide accurate and complete information during registration.</span>
              </li>
              <li className="flex items-start gap-3 bg-slate-50 p-3 rounded border border-slate-100">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></span>
                <span>You must be at least 18 years old to use this platform.</span>
              </li>
            </ul>
          </section>

          <section className="border-b border-slate-100 pb-8 last:border-0 last:pb-0">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded bg-blue-100 text-blue-600 flex items-center justify-center text-sm">03</span>
              Intellectual Property
            </h2>
            <p className="text-slate-600 leading-relaxed text-sm">
              All content, including but not limited to logos, text, graphics, and software, is the property of TopDevs or its licensors and is protected by copyright laws. You may not reproduce, distribute, or create derivative works without explicit permission.
            </p>
          </section>

          <section className="border-b border-slate-100 pb-8 last:border-0 last:pb-0">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded bg-red-100 text-red-600 flex items-center justify-center text-sm">!</span>
              Termination
            </h2>
            <p className="text-slate-600 leading-relaxed text-sm">
              We reserve the right to suspend or terminate your account at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users or our business interests.
            </p>
          </section>

          <section className="border-b border-slate-100 pb-8 last:border-0 last:pb-0">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded bg-blue-100 text-blue-600 flex items-center justify-center text-sm">04</span>
              Limitation of Liability
            </h2>
            <p className="text-slate-600 leading-relaxed text-sm">
              TopDevs provides this platform on an "as is" basis. We do not guarantee that the service will be uninterrupted or error-free. In no event shall we be liable for any indirect, incidental, or consequential damages arising out of your use of the platform.
            </p>
          </section>

        </div>
      </main>
    </div>
  );
};

export default TermsConditions;
