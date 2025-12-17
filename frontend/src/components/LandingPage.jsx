import { ArrowRight, CheckCircle2, Users, DollarSign, FileText, Shield, Clock, TrendingUp, Menu, X, Star, Zap, BarChart } from 'lucide-react';
import { useState } from 'react';

const getFeatureGradient = (color) => {
  const gradients = {
    blue: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    green: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    purple: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
    indigo: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    red: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    orange: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
  };
  return gradients[color] || gradients.blue;
};

export default function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-lg border-b border-slate-200/60 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20"
                style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' }}>
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">PayrollPro</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Features</a>
              <a href="#benefits" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Benefits</a>
              <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Pricing</a>
              <a href="#contact" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Contact</a>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              <button className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors px-5 py-2.5">
                Log in
              </button>
              <button className="text-sm font-semibold text-white px-5 py-2.5 rounded-lg hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all duration-300"
                style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' }}>
                Get Started
              </button>
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
                <a href="#features" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-xl text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors">Features</a>
                <a href="#benefits" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-xl text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors">Benefits</a>
                <a href="#pricing" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-xl text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors">Pricing</a>
              </div>
              <div className="pt-4 grid gap-3">
                <button className="w-full py-3 rounded-xl font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors">
                  Log in
                </button>
                <button className="w-full py-3 rounded-xl font-semibold text-white shadow-lg shadow-indigo-500/20"
                  style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' }}>
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative pt-24 pb-12 lg:pt-32 lg:pb-20 overflow-hidden z-0">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100/50 via-slate-50 to-white"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              <div className="space-y-8 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100">
                  <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
                  <span className="text-sm font-semibold text-indigo-700 tracking-wide">New: Auto-Tax Filing 2.0</span>
                </div>

                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1]">
                  Payroll made <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">effortless.</span>
                </h1>

                <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  Automate your entire payroll process, manage benefits, and ensure compliance with a platform built for modern businesses.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <button className="px-8 py-4 rounded-xl text-white font-semibold text-lg shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 group"
                    style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' }}>
                    Start Free Trial
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="px-8 py-4 rounded-xl bg-white text-slate-700 font-semibold text-lg border border-slate-200 shadow-sm hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50/50 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                      <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[6px] border-l-indigo-600 border-b-[4px] border-b-transparent ml-0.5"></div>
                    </div>
                    Watch Demo
                  </button>
                </div>

                <div className="pt-8 flex items-center justify-center lg:justify-start gap-8">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 bg-cover" style={{ backgroundImage: `url(https://i.pravatar.cc/100?img=${i + 10})` }}></div>
                    ))}
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-indigo-50 flex items-center justify-center text-xs font-bold text-indigo-600">+2k</div>
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
              <div className="relative mt-12 lg:mt-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl -z-10"></div>

                <div className="relative bg-white rounded-3xl shadow-2xl shadow-indigo-100 p-8 border border-white/50 backdrop-blur-sm transition-transform duration-500 overflow-hidden">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Payroll Overview</h3>
                      <p className="text-sm text-slate-500">October 2024</p>
                    </div>
                    <button className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-semibold hover:bg-indigo-100 transition-colors">Export</button>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100">
                        <div className="text-sm text-slate-500 mb-1">Total Processed</div>
                        <div className="text-2xl font-bold text-slate-900">$142,308</div>
                        <div className="text-xs text-green-600 flex items-center gap-1 mt-2 font-medium">
                          <TrendingUp className="w-3 h-3" /> +12.5% vs last month
                        </div>
                      </div>
                      <div className="p-4 rounded-2xl bg-violet-50/50 border border-violet-100">
                        <div className="text-sm text-slate-500 mb-1">Active Employees</div>
                        <div className="text-2xl font-bold text-slate-900">124</div>
                        <div className="text-xs text-slate-600 flex items-center gap-1 mt-2 font-medium">
                          <Users className="w-3 h-3" /> All profiles updated
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="text-sm font-medium text-slate-900">Recent Activity</div>
                      {[
                        { name: "Tech Team Payroll", status: "Completed", amount: "$45,200", date: "Today, 2:30 PM" },
                        { name: "Bonus Distribution", status: "Processing", amount: "$12,500", date: "Today, 11:15 AM" },
                        { name: "Contractor Payout", status: "Scheduled", amount: "$8,450", date: "Tomorrow" },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group cursor-default">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${i === 0 ? 'bg-green-100 text-green-600' : i === 1 ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
                              {i === 0 ? <CheckCircle2 className="w-5 h-5" /> : i === 1 ? <Clock className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-slate-900">{item.name}</div>
                              <div className="text-xs text-slate-500">{item.date}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-slate-900">{item.amount}</div>
                            <div className={`text-xs font-medium ${i === 0 ? 'text-green-600' : i === 1 ? 'text-amber-600' : 'text-slate-500'}`}>{item.status}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-8 border-y border-slate-100 bg-slate-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm font-semibold text-slate-500 uppercase tracking-widest mb-8">Trusted by industry leaders</p>
            <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              {/* Placeholders for logos, using text for now but styled properly */}
              {['Acme Corp', 'GlobalTech', 'Nebula', 'Velocity', 'Trio', 'FoxRun'].map((logo) => (
                <span key={logo} className="text-xl font-bold text-slate-800">{logo}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase mb-2">Features</h2>
              <p className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6 tracking-tight">Everything you need to <br />run payroll like a pro.</p>
              <p className="text-lg text-slate-600 leading-relaxed">
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
                <div key={i} className="group p-8 rounded-3xl border border-slate-100 bg-white hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300"
                    style={{ background: getFeatureGradient(feature.color) }}>
                    <feature.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section with Bento Grid Style */}
        <section id="benefits" className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Why businesses switch to PayrollPro</h2>
              <p className="text-xl text-slate-600">Join the modern era of workforce management.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Large Card */}
              <div className="md:col-span-2 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="relative z-10 max-w-sm">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Save 80% of your time on admin tasks</h3>
                  <p className="text-slate-600 mb-6">Stop fussing with spreadsheets. our automated workflows handle the boring stuff so you can focus on growth.</p>
                  <div className="flex items-center gap-2 text-indigo-600 font-semibold cursor-pointer hover:gap-3 transition-all">
                    Learn more <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
                <div className="absolute right-0 bottom-0 w-1/2 h-full bg-gradient-to-l from-indigo-50 to-transparent"></div>
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
              <div className="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-4">24/7 Expert Support</h3>
                  <p className="text-indigo-100 mb-6">Our certified payroll experts are always just a chat away.</p>
                  <div className="flex -space-x-3 mb-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-indigo-600 bg-indigo-400 bg-cover" style={{ backgroundImage: `url(https://i.pravatar.cc/100?img=${i + 20})` }}></div>
                    ))}
                  </div>
                  <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-md rounded-lg text-sm font-medium">
                    Typically replies in 2m
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              </div>

              {/* Medium Card */}
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Bank-grade Security</h3>
                <p className="text-slate-600">SOC2 Type II certified. Your data is encrypted at rest and in transit.</p>
              </div>

              {/* Medium Card */}
              <div className="md:col-span-2 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row items-center gap-8 overflow-hidden">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Seamless Integrations</h3>
                  <p className="text-slate-600 mb-6">Connects with your favorite accounting, HR, and time-tracking tools.</p>
                  <div className="flex gap-4">
                    {['Q', 'X', 'Z', 'S'].map((l, i) => (
                      <div key={i} className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-400">{l}</div>
                    ))}
                  </div>
                </div>
                <div className="w-full md:w-1/3 bg-slate-50 rounded-2xl p-6 border border-slate-100 border-dashed">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg"></div>
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

        {/* CTA Section */}
        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6 tracking-tight">Ready to transform your payroll?</h2>
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">Join over 10,000 companies that trust PayrollPro to pay their teams on time, every time.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-10 py-4 rounded-xl text-white font-bold text-lg shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:-translate-y-1 transition-all duration-300"
                style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' }}>
                Get Started for Free
              </button>
              <button className="px-10 py-4 rounded-xl text-slate-700 font-bold text-lg border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-300">
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
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' }}>
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold text-white tracking-tight">PayrollPro</span>
              </div>
              <p className="text-slate-400 leading-relaxed max-w-xs mb-6">
                Making payroll simple, fast, and compliant for modern businesses everywhere.
              </p>
              <div className="flex gap-4">
                {/* Social placeholders */}
                {[1, 2, 3, 4].map(i => <div key={i} className="w-10 h-10 rounded-full bg-slate-800 hover:bg-indigo-600 transition-colors flex items-center justify-center cursor-pointer"></div>)}
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-6">Product</h4>
              <ul className="space-y-4">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Updates</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-6">Company</h4>
              <ul className="space-y-4">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-6">Legal</h4>
              <ul className="space-y-4">
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
    </div>
  );
}
