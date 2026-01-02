import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Construction, Home } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function ComingSoon({ title = "Feature Coming Soon", description }) {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-white flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                {/* Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-pink-100 p-8 md:p-12 text-center">
                    {/* Icon */}
                    <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Construction className="w-10 h-10 text-rose-600" />
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        {title}
                    </h1>

                    {/* Description */}
                    <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
                        {description || "We're working hard to bring you this feature. Stay tuned for updates!"}
                    </p>

                    {/* Status Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-200 rounded-full mb-8">
                        <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                        <span className="text-sm font-medium text-orange-700">Under Development</span>
                    </div>

                    {/* Features List */}
                    <div className="bg-slate-50 rounded-xl p-6 mb-8 text-left">
                        <h3 className="text-sm font-semibold text-slate-900 mb-3">What's Coming:</h3>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li className="flex items-start gap-2">
                                <span className="text-rose-500 mt-0.5">✓</span>
                                <span>Intuitive user interface</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-rose-500 mt-0.5">✓</span>
                                <span>Comprehensive functionality</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-rose-500 mt-0.5">✓</span>
                                <span>Seamless integration with existing features</span>
                            </li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Go Back
                        </Button>
                        <Link to="/dashboard">
                            <Button className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-lg hover:from-pink-600 hover:to-rose-700 transition-colors shadow-lg">
                                <Home className="w-4 h-4" />
                                Back to Dashboard
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Footer Note */}
                <p className="text-center text-sm text-slate-500 mt-6">
                    Have questions? Contact our support team for more information.
                </p>
            </div>
        </div>
    );
}
