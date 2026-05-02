import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Background Shapes */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-100/50 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[10%] left-[-5%] w-[400px] h-[400px] bg-blue-100/40 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto py-24 px-6">
        <header className="mb-20 text-center md:text-left">
          <span className="text-emerald-600 font-black text-xs uppercase tracking-widest mb-4 block">Privacy First</span>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8">Our Privacy <br className="hidden md:block" /> Commitment.</h1>
          <p className="text-xl text-slate-500 max-w-2xl leading-relaxed font-medium">
            We value your trust. This policy explains how we collect, use, and protect your data when you join the TopDevs community.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <aside className="hidden md:block sticky top-32 h-fit">
             <nav className="space-y-4">
                <a href="#collection" className="block text-sm font-bold text-slate-400 hover:text-emerald-600 transition-colors">01. Data Collection</a>
                <a href="#usage" className="block text-sm font-bold text-slate-400 hover:text-emerald-600 transition-colors">02. Data Usage</a>
                <a href="#security" className="block text-sm font-bold text-slate-400 hover:text-emerald-600 transition-colors">03. Security Measures</a>
                <a href="#rights" className="block text-sm font-bold text-slate-400 hover:text-emerald-600 transition-colors">04. Your Rights</a>
             </nav>
          </aside>

          <main className="md:col-span-2 space-y-24">
            <section id="collection">
              <h2 className="text-2xl font-black text-slate-900 mb-6">01. What We Collect</h2>
              <div className="space-y-6 text-slate-600 leading-relaxed font-medium">
                <p>
                  When you register on TopDevs, we collect personal information such as your name, email address, and professional background to create your profile and match you with relevant opportunities.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
                    <span className="text-xl mb-3 block">👤</span>
                    <h3 className="font-bold text-slate-900 mb-1">Identity Data</h3>
                    <p className="text-xs text-slate-400">Username, full name, and profile images.</p>
                  </div>
                  <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
                    <span className="text-xl mb-3 block">✉️</span>
                    <h3 className="font-bold text-slate-900 mb-1">Contact Data</h3>
                    <p className="text-xs text-slate-400">Email address and phone number.</p>
                  </div>
                </div>
              </div>
            </section>

            <section id="usage">
              <h2 className="text-2xl font-black text-slate-900 mb-6">02. How We Use It</h2>
              <p className="text-slate-600 leading-relaxed font-medium mb-6">
                Your data is primarily used to provide and improve our services. This includes:
              </p>
              <ul className="space-y-4">
                {[
                  "Personalizing your dashboard experience.",
                  "Connecting you with potential employers or developers.",
                  "Ensuring platform security and preventing fraud.",
                  "Communicating important updates and newsletters."
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-white">
                    <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs">{i+1}</span>
                    <span className="text-slate-700 text-sm font-bold">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section id="security" className="p-10 bg-slate-900 rounded-[48px] text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 p-10 opacity-10 text-9xl font-black">🔒</div>
              <h2 className="text-2xl font-black mb-6 relative z-10">03. Security First</h2>
              <p className="text-slate-400 leading-relaxed font-medium relative z-10">
                We implement industry-standard encryption and security protocols to protect your personal data from unauthorized access, disclosure, or destruction. Your data is stored on secure servers with restricted access.
              </p>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
