import React, { useState, useEffect } from 'react';
import {
  Home,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  Menu,
  X,
  ChevronRight,
  Loader2,
  MailCheck
} from 'lucide-react';

const App = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [rentValue, setRentValue] = useState(1800);

  // Links
  const dmLink = "https://www.instagram.com/direct/t/17842404066666262/";
  const instagramProfile = "https://www.instagram.com/casaadu";

  // Form State (goal default now matches select options)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    goal: 'CASH FLOW / RENTAL'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const annualIncome = rentValue * 12;

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const handleCtaClick = () => window.open(dmLink, '_blank');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ✅ NEW: send form to backend endpoint that emails both recipients
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/submit-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.error || 'Failed to submit. Please try again.');
      }

      setIsSubmitting(false);
      setIsSubmitted(true);

      // keep submitted state visible briefly, then reset
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: '', email: '', address: '', goal: 'CASH FLOW / RENTAL' });
      }, 5000);
    } catch (err) {
      setIsSubmitting(false);
      setSubmitError(err?.message || 'Something went wrong. Please try again.');
    }
  };

  const handleImgError = (e, fallbackUrl) => {
    e.target.src = fallbackUrl || "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=1000";
  };

  return (
    <div className="min-h-screen bg-white text-[#111111] selection:bg-[#B2FF00] selection:text-black font-sans">

      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md py-4 shadow-md' : 'bg-transparent py-8'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => scrollTo('hero')}>
            <div className="w-10 h-10 bg-[#B2FF00] flex items-center justify-center rounded-sm transition-all group-hover:shadow-[0_0_20px_rgba(178,255,0,0.4)]">
              <Home className="text-black w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-[0.15em] uppercase font-sans">CASA</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-12">
            {['Process', 'Units', 'ROI', 'Contact'].map((item) => (
              <button
                key={item}
                onClick={() => scrollTo(item.toLowerCase())}
                className="text-xs font-bold uppercase tracking-widest hover:text-[#B2FF00] transition-colors"
              >
                {item}
              </button>
            ))}
            <button
              onClick={handleCtaClick}
              className="bg-[#111111] text-white px-8 py-3 text-xs font-bold uppercase tracking-widest rounded-none hover:bg-[#B2FF00] hover:text-black transition-all"
            >
              Get Assessment
            </button>
          </div>

          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white border-t border-gray-100 flex flex-col p-8 gap-6 md:hidden shadow-2xl">
            {['Process', 'Units', 'ROI', 'Contact'].map((item) => (
              <button key={item} onClick={() => scrollTo(item.toLowerCase())} className="text-left text-xl font-bold uppercase tracking-widest">{item}</button>
            ))}
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative pt-40 pb-20 lg:pt-56 lg:pb-32 overflow-hidden bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div className="z-10">
            <div className="w-20 h-1 bg-[#B2FF00] mb-8"></div>
            <h1 className="text-6xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-8">
              Backyard <br />
              <span className="bg-[#B2FF00] px-2">Intelligent</span> <br />
              Living.
            </h1>
            <p className="text-xl text-gray-500 mb-12 max-w-lg leading-relaxed font-light">
              Premium ADU architecture designed for Charlotte's new urban landscape. High-yield, turnkey backyard developments.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <button onClick={handleCtaClick} className="bg-[#B2FF00] text-black px-10 py-5 font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#111111] hover:text-white transition-all shadow-xl shadow-lime-500/20">
                Start Assessment <ArrowRight className="w-5 h-5" />
              </button>
              <button onClick={() => scrollTo('units')} className="bg-white border-2 border-[#111111] text-[#111111] px-10 py-5 font-bold uppercase tracking-widest hover:bg-[#111111] hover:text-white transition-all">
                View Specs
              </button>
            </div>
          </div>
          <div className="relative group">
            <div className="aspect-[4/5] rounded-none overflow-hidden shadow-[40px_40px_0px_rgba(178,255,0,0.15)] bg-gray-200">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000"
                alt="Modern Architecture"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                onError={(e) => handleImgError(e)}
              />
            </div>
            <div className="absolute -bottom-10 -right-6 bg-[#111111] text-white p-8 shadow-2xl hidden md:block border-l-4 border-[#B2FF00]">
              <div className="flex flex-col gap-1">
                <span className="text-[#B2FF00] font-black text-4xl">35%</span>
                <span className="text-[10px] uppercase tracking-[3px] font-bold text-gray-400">Equity Increase</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Value Prop */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-20">
            {[
              { label: "Maximize", title: "Rental Yield", desc: "Our units are optimized for high-end short-term and long-term rental performance.", icon: <TrendingUp /> },
              { label: "Design", title: "Modernist ADU", desc: "Clean lines, floor-to-ceiling glass, and premium sustainable materials come standard.", icon: <Home /> },
              { label: "Manage", title: "Total Turnkey", desc: "We handle the entire Charlotte UDO permitting process from start to finish.", icon: <ShieldCheck /> },
            ].map((prop, i) => (
              <div key={i} className="group cursor-default">
                <div className="text-[#B2FF00] mb-6 bg-black w-12 h-12 flex items-center justify-center rounded-sm group-hover:scale-110 transition-transform">{prop.icon}</div>
                <span className="text-[10px] font-black uppercase tracking-[4px] text-gray-400 block mb-2">{prop.label}</span>
                <h3 className="text-3xl font-black uppercase mb-4">{prop.title}</h3>
                <p className="text-gray-500 leading-relaxed font-light">{prop.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Signature Models Grid */}
      <section id="units" className="py-32 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20">
            <span className="text-black bg-[#B2FF00] font-black tracking-widest uppercase text-xs px-2 py-1">The Collection</span>
            <h2 className="text-5xl font-black uppercase mt-4">Standard Builds</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[
              { name: "Unit 01", type: "STUDIO", img: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800" },
              { name: "Unit 02", type: "1-BEDROOM", img: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=800" },
              { name: "Unit 03", type: "CUSTOM ESTATE", img: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800" }
            ].map((unit, i) => (
              <div key={i} className="group">
                <div className="relative aspect-square overflow-hidden mb-6 bg-gray-200">
                  <img src={unit.img} alt={unit.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-[#111111]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button onClick={handleCtaClick} className="bg-[#B2FF00] text-black px-8 py-3 font-black text-xs uppercase tracking-widest shadow-xl">Get Quote</button>
                  </div>
                </div>
                <div className="flex justify-between items-end border-b-2 border-gray-100 pb-4 group-hover:border-[#B2FF00] transition-colors">
                  <div>
                    <h4 className="text-2xl font-black uppercase">{unit.name}</h4>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1 group-hover:text-black transition-colors">{unit.type}</p>
                  </div>
                  <ChevronRight className="text-gray-300 group-hover:text-[#B2FF00] transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Impact */}
      <section id="roi" className="py-32 bg-[#111111] text-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-20 items-center">
          <div className="flex-1">
            <h2 className="text-5xl font-black uppercase mb-8 leading-tight">Investment <br /><span className="text-[#B2FF00]">Forecasting</span></h2>
            <p className="text-gray-400 text-lg mb-12 font-light">Charlotte's real estate market is accelerating. A backyard unit isn't just space—it's a financial asset.</p>

            <div className="space-y-10">
              <div className="space-y-4">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                  <span>Anticipated Rent</span>
                  <span className="text-[#B2FF00] font-black">${rentValue}/mo</span>
                </div>
                <input
                  type="range" min="1200" max="4500" step="100" value={rentValue}
                  onChange={(e) => setRentValue(parseInt(e.target.value))}
                  className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#B2FF00]"
                />
              </div>
              <div className="grid grid-cols-2 gap-10 border-t border-gray-800 pt-10">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-bold">Annual Revenue</p>
                  <p className="text-4xl font-black">${annualIncome.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-bold">Appreciation</p>
                  <p className="text-4xl font-black text-[#B2FF00]">+$150k+</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 w-full">
            <div className="bg-white text-[#111111] p-12 relative shadow-[20px_20px_0px_rgba(178,255,0,1)]">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#B2FF00] flex items-center justify-center">
                <TrendingUp className="text-black w-10 h-10" />
              </div>
              <h3 className="text-3xl font-black uppercase mb-6">Market Report</h3>
              <ul className="space-y-6">
                {[
                  "Charlotte UDO Compliant",
                  "Short-term Rental Ready",
                  "Energy Star Certified",
                  "High-Quality Modular Tech"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-sm font-bold uppercase tracking-tighter">
                    <div className="w-2 h-2 bg-[#B2FF00]"></div>
                    {item}
                  </li>
                ))}
              </ul>
              <button onClick={handleCtaClick} className="w-full mt-12 bg-[#111111] text-white py-5 font-black uppercase tracking-widest hover:bg-[#B2FF00] hover:text-black transition-all">
                Get Full Strategy
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Assessment Form */}
      <section id="contact" className="py-32 bg-[#F8F9FA]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black uppercase mb-4">Site Assessment</h2>
            <p className="text-gray-500 font-light">Let our analysts check your lot's feasibility for free.</p>
          </div>

          <div className="bg-white shadow-2xl p-10 lg:p-16 border-t-8 border-[#B2FF00]">
            {isSubmitted ? (
              <div className="text-center py-20 space-y-6">
                <div className="w-24 h-24 bg-lime-50 text-black rounded-full flex items-center justify-center mx-auto border-2 border-[#B2FF00]">
                  <MailCheck className="w-12 h-12" />
                </div>
                <h3 className="text-4xl font-black uppercase">Request Received</h3>
                <p className="text-gray-500 max-w-sm mx-auto">
                  Our team is reviewing {formData.address}. We will contact you at {formData.email} within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Owner Name</label>
                    <input
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      type="text"
                      placeholder="FULL NAME"
                      className="w-full p-4 border-b-2 border-gray-100 focus:border-[#B2FF00] outline-none font-bold placeholder:text-gray-300 transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Contact</label>
                    <input
                      required
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      type="email"
                      placeholder="EMAIL ADDRESS"
                      className="w-full p-4 border-b-2 border-gray-100 focus:border-[#B2FF00] outline-none font-bold placeholder:text-gray-300 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Property Location</label>
                  <input
                    required
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    type="text"
                    placeholder="123 STREET, CHARLOTTE, NC"
                    className="w-full p-4 border-b-2 border-gray-100 focus:border-[#B2FF00] outline-none font-bold placeholder:text-gray-300 transition-all"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Investment Goal</label>
                  <select
                    name="goal"
                    value={formData.goal}
                    onChange={handleInputChange}
                    className="w-full p-4 border-b-2 border-gray-100 focus:border-[#B2FF00] outline-none font-bold text-gray-400 cursor-pointer"
                  >
                    <option>CASH FLOW / RENTAL</option>
                    <option>FAMILY / MULTI-GEN</option>
                    <option>CREATIVE STUDIO</option>
                  </select>
                </div>

                {submitError && (
                  <div className="border-l-4 border-red-500 bg-red-50 p-4">
                    <p className="text-sm font-bold text-red-700">Submission failed</p>
                    <p className="text-sm text-red-600">{submitError}</p>
                  </div>
                )}

                <button
                  disabled={isSubmitting}
                  className="w-full bg-[#111111] text-white py-6 font-black uppercase tracking-widest hover:bg-[#B2FF00] hover:text-black transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                >
                  {isSubmitting ? <><Loader2 className="animate-spin" /> Sending...</> : 'Send Assessment Request'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Brand Footer */}
      <footer className="py-20 bg-[#111111] text-white border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#B2FF00] rounded-sm"></div>
              <span className="text-3xl font-black tracking-[0.2em] uppercase">CASA</span>
            </div>
            <div className="flex gap-12 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
              <a href={instagramProfile} target="_blank" rel="noreferrer" className="hover:text-[#B2FF00]">Instagram</a>
              <a href="#" className="hover:text-[#B2FF00]">LinkedIn</a>
              <a href="#" className="hover:text-[#B2FF00]">Pinterest</a>
            </div>
            <p className="text-[10px] uppercase tracking-widest text-gray-600">© 2024 CASA ADU DEVELOPMENTS</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
