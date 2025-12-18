import { ArrowRight, CheckCircle2, Users, DollarSign, FileText, Shield, Clock, TrendingUp, Menu, X, Star, Zap, BarChart } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const getFeatureGradient = (color) => {
  const gradients = {
    blue: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)', // Pink
    green: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    purple: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
    indigo: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)', // Pink
    red: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    orange: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
  };
  return gradients[color] || gradients.blue;
};

export default function LandingPage() {
  /* Marquee Animation Style Injection */
  const [mobileOpen, setMobileOpen] = useState(false);

  // Handle smooth scroll with offset for fixed navbar
  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      const navbarHeight = 128; // h-32 = 128px
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setMobileOpen(false); // Close mobile menu if open
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden selection:bg-pink-100 selection:text-pink-900">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        html {
          scroll-behavior: smooth;
          scroll-padding-top: 128px;
        }
      `}</style>
      {/* Navigation */}
      <nav className="fixed w-full bg-white/95 backdrop-blur-md border-b border-slate-100/50 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-32">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Ayphen Technologies" className="h-28 w-auto object-contain py-1" />
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" onClick={(e) => handleNavClick(e, 'features')} className="text-xs font-semibold text-slate-500 hover:text-pink-600 transition-colors uppercase tracking-wide cursor-pointer">Features</a>
              <a href="#benefits" onClick={(e) => handleNavClick(e, 'benefits')} className="text-xs font-semibold text-slate-500 hover:text-pink-600 transition-colors uppercase tracking-wide cursor-pointer">Benefits</a>
              <a href="#pricing" onClick={(e) => handleNavClick(e, 'pricing')} className="text-xs font-semibold text-slate-500 hover:text-pink-600 transition-colors uppercase tracking-wide cursor-pointer">Pricing</a>
              <a href="#faq" onClick={(e) => handleNavClick(e, 'faq')} className="text-xs font-semibold text-slate-500 hover:text-pink-600 transition-colors uppercase tracking-wide cursor-pointer">FAQ</a>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              <Link to="/login" className="text-xs font-bold text-slate-600 hover:text-pink-600 transition-colors px-4 py-2">
                Log in
              </Link>
              <Link to="/signup" className="text-xs font-bold text-white px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-pink-500/30 hover:-translate-y-0.5 transition-all duration-300" style={{ background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)' }}>
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-xl absolute w-full">
            <div className="px-4 py-6 space-y-4">
              <div className="grid gap-2">
                <a href="#features" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-xl text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-pink-600 transition-colors">Features</a>
                <a href="#benefits" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-xl text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-pink-600 transition-colors">Benefits</a>
                <a href="#pricing" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-xl text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-pink-600 transition-colors">Pricing</a>
              </div>
              <div className="pt-4 grid gap-3">
                <Link to="/login" className="w-full py-3 rounded-xl font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors text-center">
                  Log in
                </Link>
                <Link to="/signup" className="w-full py-3 rounded-xl font-semibold text-white shadow-lg shadow-pink-500/20 text-center" style={{ background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)' }}>
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative pt-36 pb-8 lg:pt-40 lg:pb-12 overflow-hidden z-0">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-pink-100/50 via-slate-50 to-white"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              <div className="space-y-8 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-50 border border-pink-100">
                  <span className="flex h-2 w-2 rounded-full bg-pink-500 animate-pulse"></span>
                  <span className="text-xs font-bold text-pink-700 tracking-wide">New: Auto-Tax Filing 2.0</span>
                </div>

                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
                  Payroll made <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-600">effortless.</span>
                </h1>

                <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  Automate your entire payroll process, manage benefits, and ensure compliance with a platform built for modern businesses.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <button className="px-6 py-3 rounded-xl text-white font-bold text-base shadow-xl shadow-pink-500/20 hover:shadow-pink-500/30 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 group"
                    style={{ background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)' }}>
                    Start Free Trial
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="px-6 py-3 rounded-xl bg-white text-slate-700 font-bold text-base border border-slate-200 shadow-sm hover:border-pink-200 hover:text-pink-600 hover:bg-pink-50/50 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-pink-100 flex items-center justify-center">
                      <div className="w-0 h-0 border-t-[3px] border-t-transparent border-l-[5px] border-l-pink-600 border-b-[3px] border-b-transparent ml-0.5"></div>
                    </div>
                    Watch Demo
                  </button>
                </div>

                <div className="pt-8 flex items-center justify-center lg:justify-start gap-8">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 bg-cover" style={{ backgroundImage: `url(https://i.pravatar.cc/100?img=${i + 10})` }}></div>
                    ))}
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-pink-50 flex items-center justify-center text-xs font-bold text-pink-600">+2k</div>
                  </div>
                  <div className="text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
                    </div>
                    <span className="font-medium text-slate-700">4.9/5</span> from happy teams
                  </div>
                </div>
              </div>

              {/* Hero Visual - FIXED: Removed 3D perspective to avoid collapse */}
              <div className="relative mt-12 lg:mt-0 perspective-1000">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/10 rounded-full blur-3xl -z-10"></div>

                {/* Dashboard Mockup */}
                <div className="relative z-10 bg-white rounded-2xl shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden transform rotate-y-6 rotate-x-6 hover:rotate-0 transition-all duration-500">
                  {/* Fake Browser Header */}
                  <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                    </div>
                    <div className="ml-4 h-6 bg-white rounded-md border border-slate-200 w-64"></div>
                  </div>

                  {/* Dashboard Content */}
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-8">
                      <div>
                        <div className="h-4 w-32 bg-slate-100 rounded mb-2"></div>
                        <div className="h-8 w-48 bg-slate-900 rounded-lg"></div>
                      </div>
                      <div className="px-4 py-2 bg-pink-600 text-white text-xs font-bold rounded-lg shadow-lg shadow-pink-500/20">
                        Run Payroll
                      </div>
                    </div>

                    {/* Table */}
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-slate-50 hover:bg-slate-50 hover:border-slate-100 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100"></div>
                            <div>
                              <div className="h-3 w-24 bg-slate-200 rounded mb-1"></div>
                              <div className="h-2 w-16 bg-slate-100 rounded"></div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="h-3 w-16 bg-slate-200 rounded mb-1 ml-auto"></div>
                            <div className="px-2 py-0.5 rounded-full bg-green-50 text-[10px] font-bold text-green-600 inline-block">Paid</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -right-6 top-24 bg-white p-4 rounded-xl shadow-xl border border-slate-50 animate-bounce-slow z-20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Success</div>
                      <div className="text-[10px] text-slate-500">Payroll sent</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* Features Section */}
        <section id="features" className="py-12 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-sm font-bold text-pink-600 tracking-wide uppercase mb-2">Features</h2>
              <p className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Everything you need to <br />run payroll like a pro.</p>
              <p className="text-base text-slate-600 leading-relaxed">
                We've thought of everything so you don't have to. From automated tax filings to employee self-service, PayrollPro handles the heavy lifting.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Users,
                  title: "Employee Management",
                  desc: "Manage profiles, documents, and roles in one secure, centralized database.",
                  color: "blue"
                },
                {
                  icon: DollarSign,
                  title: "Automated Payroll",
                  desc: "Run payroll in minutes. We handle calculations, deductions, and deposits automatically.",
                  color: "green"
                },
                {
                  icon: Shield,
                  title: "Tax Compliance",
                  desc: "Never worry about fines. We automatically calculate, file, and pay your payroll taxes.",
                  color: "purple"
                },
                {
                  icon: Clock,
                  title: "Time Tracking",
                  desc: "Integrated digital timesheets that sync directly with payroll. No manual entry needed.",
                  color: "indigo"
                },
                {
                  icon: Zap,
                  title: "Instant Payments",
                  desc: "Pay your team faster with same-day direct deposit options available.",
                  color: "orange"
                },
                {
                  icon: BarChart,
                  title: "Deep Analytics",
                  desc: "Get real-time insights into your labor costs and payroll trends with custom reports.",
                  color: "red"
                }
              ].map((feature, i) => (
                <div key={i} className="group p-6 rounded-3xl border border-slate-100 bg-white hover:border-pink-100 hover:shadow-xl hover:shadow-pink-500/10 transition-all duration-300">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300"
                    style={{ background: getFeatureGradient(feature.color) }}>
                    <feature.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Compliance Section */}
        <section id="compliance" className="py-16 bg-gradient-to-br from-pink-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-sm font-bold text-pink-600 tracking-wide uppercase mb-2">Compliance</h2>
              <p className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Stay compliant, <br />stay stress-free</p>
              <p className="text-base text-slate-600 leading-relaxed">
                Automated tax calculations and filings keep you compliant with federal, state, and local regulations.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Auto Tax Filing",
                  desc: "We calculate, file, and pay your federal and state payroll taxes automatically.",
                  icon: FileText
                },
                {
                  title: "W-2 & 1099 Forms",
                  desc: "Generate and distribute year-end tax forms with a single click.",
                  icon: Shield
                },
                {
                  title: "Audit Support",
                  desc: "Get expert help if you're ever audited. We keep detailed records for 7+ years.",
                  icon: CheckCircle2
                }
              ].map((item, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-pink-100 hover:shadow-lg hover:shadow-pink-500/10 transition-all">
                  <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-xl flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section id="how-it-works" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-sm font-bold text-pink-600 tracking-wide uppercase mb-2">How it Works</h2>
              <p className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Get started in minutes</p>
              <p className="text-base text-slate-600 leading-relaxed">
                Three simple steps to modernize your payroll process.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connection line */}
              <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-200 via-pink-300 to-pink-200 -z-10"></div>

              {[
                {
                  step: "01",
                  title: "Connect Your Data",
                  desc: "Import your employee information and connect your bank account securely."
                },
                {
                  step: "02",
                  title: "Set Up Payroll",
                  desc: "Configure pay schedules, deductions, and benefits in our intuitive dashboard."
                },
                {
                  step: "03",
                  title: "Run & Relax",
                  desc: "Hit 'Run Payroll' and we handle the rest—calculations, taxes, and payments."
                }
              ].map((item, i) => (
                <div key={i} className="relative">
                  <div className="bg-white p-8 rounded-2xl border-2 border-pink-100 hover:border-pink-300 transition-all">
                    <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 text-white rounded-2xl flex items-center justify-center mb-6 text-2xl font-bold shadow-lg shadow-pink-500/30">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section with Bento Grid Style */}
        <section id="benefits" className="py-12 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Why businesses <span className="text-pink-600">switch</span> to PayrollPro</h2>
              <p className="text-lg text-slate-600">Join the modern era of workforce management with tools designed for speed.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Large Card */}
              <div className="md:col-span-2 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-pink-500/10 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                <div className="relative z-10 max-w-sm">
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Save 80% of your time on admin tasks</h3>
                  <p className="text-sm text-slate-600 mb-4">Stop fussing with spreadsheets. our automated workflows handle the boring stuff so you can focus on growth.</p>
                  <div className="flex items-center gap-2 text-pink-600 text-sm font-bold cursor-pointer hover:gap-3 transition-all">
                    Learn more <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
                <div className="absolute right-0 bottom-0 w-1/2 h-full bg-gradient-to-l from-pink-50 to-transparent"></div>
                <div className="absolute right-8 bottom-8 md:bottom-12 md:right-12 bg-white p-4 rounded-xl shadow-lg border border-slate-100 rotate-3 group-hover:rotate-6 transition-transform duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600"><CheckCircle2 className="w-6 h-6" /></div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">Task Completed</div>
                      <div className="text-xs text-slate-500">Payroll run in 45s</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tall Card */}
              <div className="bg-pink-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-pink-600/20 hover:-translate-y-1 transition-transform duration-300 group">
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-3">24/7 Expert Support</h3>
                  <p className="text-pink-100 text-sm mb-6">Our certified payroll experts are always just a chat away.</p>
                  <div className="flex -space-x-3 mb-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-pink-600 bg-pink-400 bg-cover transform group-hover:scale-110 transition-transform origin-bottom" style={{ backgroundImage: `url(https://i.pravatar.cc/100?img=${i + 20})` }}></div>
                    ))}
                  </div>
                  <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-md rounded-lg text-sm font-medium">
                    Typically replies in 2m
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              </div>

              {/* Medium Card */}
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-pink-500/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
                <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-300">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Bank-grade Security</h3>
                <p className="text-sm text-slate-600">SOC2 Type II certified. Your data is encrypted at rest and in transit.</p>
              </div>

              {/* Medium Card */}
              <div className="md:col-span-2 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-pink-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col md:flex-row items-center gap-8 overflow-hidden group">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Seamless Integrations</h3>
                  <p className="text-sm text-slate-600 mb-6">Connects with your favorite accounting, HR, and time-tracking tools.</p>
                  <div className="flex gap-4">
                    {['Q', 'X', 'Z', 'S'].map((l, i) => (
                      <div key={i} className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center font-bold text-slate-300 group-hover:bg-pink-50 group-hover:text-pink-400 transition-colors delay-75">{l}</div>
                    ))}
                  </div>
                </div>
                <div className="w-full md:w-1/3 bg-slate-50 rounded-2xl p-6 border border-slate-100 border-dashed">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-pink-500 rounded-lg"></div>
                    <div className="h-2 w-20 bg-slate-200 rounded"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-full bg-slate-200 rounded"></div>
                    <div className="h-2 w-2/3 bg-slate-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section id="security" className="py-16 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-sm font-bold text-pink-400 tracking-wide uppercase mb-2">Security</h2>
                <p className="text-3xl sm:text-4xl font-bold mb-6 tracking-tight">Your data is protected by enterprise-grade security</p>
                <p className="text-slate-300 mb-8 leading-relaxed">
                  We take security seriously. Your sensitive payroll data is encrypted, monitored, and protected 24/7.
                </p>
                <div className="space-y-4">
                  {[
                    "256-bit AES encryption",
                    "SOC 2 Type II certified",
                    "GDPR & CCPA compliant",
                    "Regular security audits",
                    "Two-factor authentication"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-pink-400 flex-shrink-0" />
                      <span className="text-slate-200">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-slate-700/50 rounded-lg">
                    <Shield className="w-8 h-8 text-pink-400" />
                    <div>
                      <div className="font-bold">Bank-Level Encryption</div>
                      <div className="text-sm text-slate-400">All data encrypted in transit & at rest</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-slate-700/50 rounded-lg">
                    <Shield className="w-8 h-8 text-green-400" />
                    <div>
                      <div className="font-bold">Continuous Monitoring</div>
                      <div className="text-sm text-slate-400">24/7 threat detection & response</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-slate-700/50 rounded-lg">
                    <Shield className="w-8 h-8 text-blue-400" />
                    <div>
                      <div className="font-bold">Compliance Ready</div>
                      <div className="text-sm text-slate-400">Meets all major regulatory standards</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-sm font-bold text-pink-600 tracking-wide uppercase mb-2">Pricing</h2>
              <p className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Simple, transparent pricing</p>
              <p className="text-base text-slate-600 leading-relaxed">
                No hidden fees. No surprises. Just straightforward pricing that scales with your business.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  name: "Starter",
                  price: "$40",
                  period: "/month + $6/employee",
                  features: [
                    "Up to 10 employees",
                    "Automated payroll",
                    "Tax filing",
                    "Direct deposit",
                    "Email support"
                  ],
                  highlighted: false
                },
                {
                  name: "Professional",
                  price: "$80",
                  period: "/month + $8/employee",
                  features: [
                    "Up to 50 employees",
                    "Everything in Starter",
                    "Time tracking",
                    "Benefits management",
                    "Priority support",
                    "Custom reports"
                  ],
                  highlighted: true
                },
                {
                  name: "Enterprise",
                  price: "Custom",
                  period: "Contact sales",
                  features: [
                    "Unlimited employees",
                    "Everything in Professional",
                    "Dedicated account manager",
                    "API access",
                    "Custom integrations",
                    "SLA guarantee"
                  ],
                  highlighted: false
                }
              ].map((plan, i) => (
                <div key={i} className={`relative p-8 rounded-2xl border-2 ${plan.highlighted ? 'border-pink-500 shadow-2xl shadow-pink-500/20 scale-105' : 'border-slate-200'} bg-white`}>
                  {plan.highlighted && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-rose-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                      Most Popular
                    </div>
                  )}
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                      <span className="text-slate-500 text-sm">{plan.period}</span>
                    </div>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-pink-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${plan.highlighted ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-500/30 hover:shadow-xl' : 'border-2 border-slate-200 text-slate-700 hover:border-pink-500 hover:text-pink-600'}`}>
                    {plan.price === "Custom" ? "Contact Sales" : "Start Free Trial"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-sm font-bold text-pink-600 tracking-wide uppercase mb-2">Testimonials</h2>
              <p className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Loved by teams everywhere</p>
              <p className="text-base text-slate-600 leading-relaxed">
                See what our customers have to say about their experience with PayrollPro.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  quote: "PayrollPro cut our payroll processing time from 4 hours to 15 minutes. It's been a game-changer for our HR team.",
                  author: "Sarah Johnson",
                  role: "HR Director",
                  company: "TechStart Inc.",
                  rating: 5
                },
                {
                  quote: "The automated tax filing feature alone has saved us thousands in accountant fees. Best investment we've made.",
                  author: "Michael Chen",
                  role: "CFO",
                  company: "GrowthCo",
                  rating: 5
                },
                {
                  quote: "Customer support is incredible. They helped us migrate from our old system in just two days with zero downtime.",
                  author: "Emily Rodriguez",
                  role: "Operations Manager",
                  company: "Retail Plus",
                  rating: 5
                }
              ].map((testimonial, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition-shadow">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <Star key={j} className="w-5 h-5 fill-pink-500 text-pink-500" />
                    ))}
                  </div>
                  <p className="text-slate-700 mb-6 leading-relaxed">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full"></div>
                    <div>
                      <div className="font-bold text-slate-900">{testimonial.author}</div>
                      <div className="text-sm text-slate-500">{testimonial.role}, {testimonial.company}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-sm font-bold text-pink-600 tracking-wide uppercase mb-2">FAQ</h2>
              <p className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Frequently asked questions</p>
              <p className="text-base text-slate-600 leading-relaxed">
                Everything you need to know about PayrollPro.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: "How long does it take to set up?",
                  a: "Most customers are up and running within 24 hours. Our onboarding team will guide you through every step."
                },
                {
                  q: "Do you handle tax filings?",
                  a: "Yes! We automatically calculate, file, and pay all federal, state, and local payroll taxes on your behalf."
                },
                {
                  q: "Can I switch from my current payroll provider?",
                  a: "Absolutely. We offer free migration assistance and will help you transfer all your data securely."
                },
                {
                  q: "What if I need help?",
                  a: "Our support team is available 24/7 via chat, email, and phone. Professional and Enterprise plans include priority support."
                },
                {
                  q: "Is there a contract?",
                  a: "No long-term contracts required. You can cancel anytime with 30 days notice."
                },
                {
                  q: "How secure is my data?",
                  a: "We use bank-level 256-bit encryption and are SOC 2 Type II certified. Your data is protected with the highest security standards."
                }
              ].map((faq, i) => (
                <details key={i} className="group bg-slate-50 rounded-xl border border-slate-200 hover:border-pink-200 transition-colors">
                  <summary className="flex justify-between items-center cursor-pointer p-6 font-bold text-slate-900">
                    {faq.q}
                    <ArrowRight className="w-5 h-5 text-pink-500 transform group-open:rotate-90 transition-transform" />
                  </summary>
                  <div className="px-6 pb-6 text-slate-600 leading-relaxed">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Ready to transform your payroll?</h2>
            <p className="text-base text-slate-600 mb-8 max-w-2xl mx-auto">Join over 10,000 companies that trust PayrollPro to pay their teams on time, every time.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 rounded-xl text-white font-bold text-base shadow-xl shadow-pink-500/20 hover:shadow-pink-500/30 hover:-translate-y-1 transition-all duration-300"
                style={{ background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)' }}>
                Get Started for Free
              </button>
              <button className="px-8 py-3 rounded-xl text-slate-700 font-bold text-base border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-300">
                Contact Sales
              </button>
            </div>
            <p className="mt-6 text-sm text-slate-500">No credit card required • 14-day free trial • Cancel anytime</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-12">
            <div className="col-span-2 lg:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <img src="/logo.png" alt="Ayphen Technologies" className="h-12 w-auto brightness-0 invert" />
              </div>
              <p className="text-slate-400 leading-relaxed max-w-xs mb-6">
                Making payroll simple, fast, and compliant for modern businesses everywhere.
              </p>
              <div className="flex gap-4">
                {/* Social placeholders */}
                {[1, 2, 3, 4].map(i => <div key={i} className="w-10 h-10 rounded-full bg-slate-800 hover:bg-pink-600 transition-colors flex items-center justify-center cursor-pointer"></div>)}
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Product</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Updates</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Legal</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
            <p>&copy; 2024 PayrollPro Inc. All rights reserved.</p>
            <div className="flex gap-6">
              <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div> Systems Operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div >
  );
}
