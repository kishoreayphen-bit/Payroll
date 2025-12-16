import { ArrowRight, CheckCircle2, Users, DollarSign, FileText, Shield, Clock, TrendingUp } from 'lucide-react';

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
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'}}>
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold" style={{background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'}}>
                PayrollPro
              </span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">Features</a>
              <a href="#benefits" className="text-gray-700 hover:text-blue-600 transition-colors">Benefits</a>
              <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition-colors">Pricing</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors">Contact</a>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-700 hover:text-indigo-600 font-medium transition-colors px-4 py-2">
                Sign In
              </button>
              <button className="text-white px-6 py-2.5 rounded-lg hover:shadow-lg transition-all duration-200 font-medium" style={{background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)'}}>
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-32 px-4 sm:px-6 lg:px-8" style={{background: 'linear-gradient(180deg, #ffffff 0%, #f8f7ff 50%, #f5f3ff 100%)'}}>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full" style={{background: 'linear-gradient(90deg, #ede9fe 0%, #ddd6fe 100%)'}}>
                <span className="text-sm font-medium" style={{color: '#6366f1'}}>🚀 Modern Payroll Management</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-tight tracking-tight">
                Simplify Your
                <span style={{background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'}}> Payroll </span>
                Process
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                Streamline payroll, automate compliance, and empower your workforce with our comprehensive payroll management solution.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="text-white px-8 py-4 rounded-lg hover:shadow-xl transition-all duration-200 font-semibold text-lg flex items-center justify-center group" style={{background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)'}}>
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:border-indigo-600 hover:text-indigo-600 transition-all duration-200 font-semibold text-lg">
                  Watch Demo
                </button>
              </div>
              <div className="flex items-center space-x-8 pt-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-gray-600">No credit card required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-gray-600">14-day free trial</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl transform rotate-2 opacity-10" style={{background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', filter: 'blur(20px)'}}></div>
              <div className="relative bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
                <div className="space-y-5">
                  <div className="flex items-center justify-between p-5 rounded-2xl border border-indigo-100" style={{background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)'}}>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{background: '#6366f1'}}>
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Employees</p>
                        <p className="text-2xl font-bold text-gray-900">1,247</p>
                      </div>
                    </div>
                    <div className="text-green-600 text-sm font-medium">+12%</div>
                  </div>
                  <div className="flex items-center justify-between p-5 rounded-2xl border border-green-100" style={{background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)'}}>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{background: '#10b981'}}>
                        <DollarSign className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Payroll Processed</p>
                        <p className="text-2xl font-bold text-gray-900">$2.4M</p>
                      </div>
                    </div>
                    <div className="text-green-600 text-sm font-medium">On Time</div>
                  </div>
                  <div className="flex items-center justify-between p-5 rounded-2xl border border-purple-100" style={{background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)'}}>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{background: '#a855f7'}}>
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Time Saved</p>
                        <p className="text-2xl font-bold text-gray-900">240 hrs</p>
                      </div>
                    </div>
                    <div className="text-green-600 text-sm font-medium">Monthly</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
              Everything You Need for
              <span style={{background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'}}> Payroll Excellence</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive features designed to automate and simplify your entire payroll workflow
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                icon: Users,
                title: "Employee Management",
                description: "Centralized employee database with complete profile management and document storage",
                color: "blue"
              },
              {
                icon: DollarSign,
                title: "Automated Payroll",
                description: "Process payroll in minutes with automated calculations and tax deductions",
                color: "green"
              },
              {
                icon: FileText,
                title: "Compliance & Tax",
                description: "Stay compliant with automated tax calculations and statutory reporting",
                color: "purple"
              },
              {
                icon: Clock,
                title: "Time & Attendance",
                description: "Track attendance, manage shifts, and handle leave requests seamlessly",
                color: "indigo"
              },
              {
                icon: Shield,
                title: "Secure & Reliable",
                description: "Bank-grade security with role-based access and complete audit trails",
                color: "red"
              },
              {
                icon: TrendingUp,
                title: "Analytics & Reports",
                description: "Powerful insights with customizable reports and real-time dashboards",
                color: "orange"
              }
            ].map((feature, index) => (
              <div key={index} className="group p-8 bg-gradient-to-br from-white to-gray-50 rounded-3xl border border-gray-200 hover:shadow-2xl hover:border-indigo-200 transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg" style={{background: getFeatureGradient(feature.color)}}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed text-base">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 relative overflow-hidden" style={{background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)'}}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: "10K+", label: "Active Users" },
              { number: "99.9%", label: "Uptime" },
              { number: "500M+", label: "Processed Monthly" },
              { number: "4.9/5", label: "Customer Rating" }
            ].map((stat, index) => (
              <div key={index} className="text-white transform hover:scale-110 transition-transform duration-300">
                <div className="text-6xl font-extrabold mb-3">{stat.number}</div>
                <div className="text-indigo-100 text-xl font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-5xl font-extrabold text-gray-900 tracking-tight">
                Why Choose
                <span style={{background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'}}> PayrollPro?</span>
              </h2>
              <div className="space-y-6">
                {[
                  "Save 80% of time spent on payroll processing",
                  "Eliminate manual errors with automated calculations",
                  "Ensure 100% tax compliance automatically",
                  "Access payroll data anytime, anywhere",
                  "Seamless integration with existing systems",
                  "24/7 customer support and training"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 rounded-xl hover:bg-white transition-colors duration-200">
                    <div className="flex-shrink-0 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center mt-0.5 shadow-md">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-lg text-gray-700 font-medium">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl transform -rotate-2 opacity-10" style={{background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', filter: 'blur(20px)'}}></div>
              <div className="relative bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
                <div className="space-y-4">
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded-full w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded-full w-full animate-pulse" style={{animationDelay: '0.1s'}}></div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded-full w-5/6 animate-pulse" style={{animationDelay: '0.2s'}}></div>
                  <div className="mt-8 p-6 rounded-2xl border border-green-200" style={{background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)'}}>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Payroll Status</span>
                      <span className="px-3 py-1 text-white text-sm rounded-full" style={{background: '#10b981'}}>Completed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden" style={{background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)'}}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-white rounded-full filter blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-5xl font-extrabold text-white mb-6 tracking-tight">
            Ready to Transform Your Payroll?
          </h2>
          <p className="text-xl text-indigo-100 mb-12 max-w-2xl mx-auto">
            Join thousands of companies already using PayrollPro to streamline their payroll operations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white px-10 py-5 rounded-xl hover:shadow-2xl transition-all duration-200 font-bold text-lg transform hover:scale-105" style={{color: '#6366f1'}}>
              Start Free Trial
            </button>
            <button className="border-2 border-white text-white px-10 py-5 rounded-xl hover:bg-white hover:text-indigo-600 transition-all duration-200 font-bold text-lg transform hover:scale-105">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'}}>
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">PayrollPro</span>
              </div>
              <p className="text-sm">
                Modern payroll management solution for businesses of all sizes.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Compliance</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
            <p>&copy; 2024 PayrollPro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
