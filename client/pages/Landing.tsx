
import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/common/Footer';
import { Building, CheckCircle, LogIn, UserPlus } from '../components/icons';

const Landing: React.FC = () => {
    
    const features = [
        { name: 'Global Reach', description: 'Connect with verified buyers and sellers from around the world.' },
        { name: 'Secure Transactions', description: 'End-to-end encrypted payments and robust escrow services.' },
        { name: 'Streamlined Logistics', description: 'Integrated shipping and logistics solutions for seamless delivery.' },
        { name: 'Powerful Analytics', description: 'Gain insights into your sales, purchases, and market trends.' },
    ];

    return (
        <div className="bg-white dark:bg-gray-900">
            {/* Header */}
            <header className="absolute inset-x-0 top-0 z-50">
                <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
                    <div className="flex lg:flex-1">
                        <Link to="/" className="-m-1.5 p-1.5 flex items-center text-xl font-bold text-gray-900 dark:text-white">
                             <Building className="w-8 h-8 text-blue-600"/>
                             <span className="ml-2">Marketplace</span>
                        </Link>
                    </div>
                    <div className="flex flex-1 justify-end space-x-4">
                        <Link to="/login" className="flex items-center text-sm font-semibold leading-6 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                            Log in <LogIn className="ml-1 w-4 h-4" />
                        </Link>
                        <Link to="/register" className="flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                            Sign up <UserPlus className="ml-1 w-4 h-4" />
                        </Link>
                    </div>
                </nav>
            </header>

            <main className="isolate">
                {/* Hero section */}
                <div className="relative pt-14">
                    <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
                        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#80caff] to-[#4f46e5] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }} />
                    </div>
                    <div className="py-24 sm:py-32">
                        <div className="mx-auto max-w-7xl px-6 lg:px-8">
                            <div className="mx-auto max-w-2xl text-center">
                                <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">The Future of B2B Commerce</h1>
                                <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">Empowering businesses by simplifying global trade. Connect, transact, and grow with our secure and efficient B2B marketplace.</p>
                                <div className="mt-10 flex items-center justify-center gap-x-6">
                                    <Link to="/register" className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">Get started</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features section */}
                <div className="bg-gray-50 dark:bg-gray-800 py-24 sm:py-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl lg:text-center">
                            <h2 className="text-base font-semibold leading-7 text-blue-600 dark:text-blue-400">Everything You Need</h2>
                            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">A Better Way to Do Business</p>
                        </div>
                        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
                            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                                {features.map((feature) => (
                                    <div key={feature.name} className="relative pl-16">
                                        <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                                            <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                                                <CheckCircle className="h-6 w-6 text-white" />
                                            </div>
                                            {feature.name}
                                        </dt>
                                        <dd className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">{feature.description}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    </div>
                </div>

                {/* Testimonials section */}
                <section className="relative isolate overflow-hidden bg-white dark:bg-gray-900 px-6 py-24 sm:py-32 lg:px-8">
                     <div className="mx-auto max-w-2xl lg:max-w-4xl">
                        <figure className="mt-10">
                            <blockquote className="text-center text-xl font-semibold leading-8 text-gray-900 dark:text-white sm:text-2xl sm:leading-9">
                                <p>“This platform has revolutionized how we source materials. The efficiency and transparency are unmatched. It has saved us countless hours and significantly reduced our procurement costs.”</p>
                            </blockquote>
                            <figcaption className="mt-10">
                                <img className="mx-auto h-10 w-10 rounded-full" src="https://i.pravatar.cc/40?u=jane" alt="" />
                                <div className="mt-4 flex items-center justify-center space-x-3 text-base">
                                    <div className="font-semibold text-gray-900 dark:text-white">Jane Doe</div>
                                    <svg viewBox="0 0 2 2" width={3} height={3} aria-hidden="true" className="fill-gray-900 dark:fill-gray-300"><circle cx={1} cy={1} r={1} /></svg>
                                    <div className="text-gray-600 dark:text-gray-400">CEO of Innovate Inc.</div>
                                </div>
                            </figcaption>
                        </figure>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Landing;
