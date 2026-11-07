import React from 'react';
import { motion } from 'framer-motion';
import LiveTicker from './LiveTicker';

const CheckIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

const ShieldIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
);

const LandingPage: React.FC<{ onStartConfigurator: () => void }> = ({ onStartConfigurator }) => {
    return (
        <div>
            <LiveTicker />
            <nav>
                <div className="container nav-inner">
                    <a href="#" className="logo">
                        <span>Tech To You</span>
                    </a>
                    <div className="nav-links">
                        <a href="#pricing" className="nav-link">Pricing</a>
                        <a href="#managed-it" className="nav-link">Security</a>
                        <a href="#addons" className="nav-link">Add-ons</a>
                        <a href="tel:2399084889" className="nav-cta">Call (239) 908-4889</a>
                    </div>
                </div>
            </nav>

            <main>
                <section className="hero">
                    <div className="container">
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }} 
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            Professional IT. Flat Pricing.<br/>Total Compliance.
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }} 
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            The modern infrastructure standard for fiduciary, tax, and business professionals.
                        </motion.p>
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }} 
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <button onClick={onStartConfigurator} className="btn-primary">
                                Build Your Solution →
                            </button>
                        </motion.div>
                    </div>
                </section>

                <section className="value-prop">
                    <div className="container">
                        <div className="value-grid">
                            <div className="value-card">
                                <h3>Predictable Cost</h3>
                                <p>No surprise bills. Flat monthly pricing for everything from email to security.</p>
                            </div>
                            <div className="value-card">
                                <h3>Audit-Ready</h3>
                                <p>Compliance-first architecture designed for the strictest regulatory environments.</p>
                            </div>
                            <div className="value-card">
                                <h3>Zero Friction</h3>
                                <p>We handle the migrations, the hardware, and the maintenance. You just work.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="pricing" className="pricing">
                    <div className="container">
                        <div className="pricing-header">
                            <h2>Simple, Transparent Plans</h2>
                            <p>Choose the foundation that fits your business model.</p>
                        </div>
                        <div className="pricing-grid">
                            <div className="price-card">
                                <h3>Business Base</h3>
                                <div className="price">$39</div>
                                <span className="period">per user / month</span>
                                <ul className="feature-list">
                                    <li className="feature-item"><CheckIcon /> Unlimited Email Users</li>
                                    <li className="feature-item"><CheckIcon /> 25 GB Team Storage</li>
                                    <li className="feature-item"><CheckIcon /> HD VoIP System</li>
                                    <li className="feature-item"><CheckIcon /> Standard Security Pack</li>
                                </ul>
                                <button onClick={onStartConfigurator} className="btn-primary">Get Started</button>
                            </div>
                            <div className="price-card featured">
                                <div className="featured-badge">Recommended</div>
                                <h3>Fiduciary & Tax</h3>
                                <div className="price">$69</div>
                                <span className="period">per user / month</span>
                                <ul className="feature-list">
                                    <li className="feature-item"><CheckIcon /> Audit-Ready Exchange P1</li>
                                    <li className="feature-item"><CheckIcon /> Encrypted Tax Vault</li>
                                    <li className="feature-item"><CheckIcon /> IRS/FTC Compliance Pack</li>
                                    <li className="feature-item"><CheckIcon /> Priority Support</li>
                                </ul>
                                <button onClick={onStartConfigurator} className="btn-primary">Get Started</button>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="managed-it" className="managed-it">
                    <div className="container">
                        <h2>Managed IT: The Gold Standard</h2>
                        <p>Complete peace of mind. We monitor, patch, and secure every endpoint in your office 24/7/365.</p>
                        <div className="it-pricing">Starting at $25 / device / month</div>
                    </div>
                </section>

                <section id="addons" className="addons">
                    <div className="container">
                        <div className="addons-header">
                            <h2>Tailor Your Setup</h2>
                            <p>Powerful add-ons to extend your business capabilities.</p>
                        </div>
                        <div className="addons-grid">
                            <div className="addon-card">
                                <div>
                                    <h4>Desk Phone Lease</h4>
                                    <p>Professional Grandstream IP hardware.</p>
                                </div>
                                <div className="addon-price">$10/mo</div>
                            </div>
                            <div className="addon-card">
                                <div>
                                    <h4>Dedicated DID</h4>
                                    <p>Additional dedicated business lines.</p>
                                </div>
                                <div className="addon-price">$20/mo</div>
                            </div>
                            <div className="addon-card">
                                <div>
                                    <h4>Virtual Attendant</h4>
                                    <p>Professional call routing & menus.</p>
                                </div>
                                <div className="addon-price">$10/mo</div>
                            </div>
                            <div className="addon-card">
                                <div>
                                    <h4>Cloud e-Fax</h4>
                                    <p>Paperless faxing via your email.</p>
                                </div>
                                <div className="addon-price">$10/mo</div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="compliance">
                    <div className="container">
                        <div className="compliance-inner">
                            <div className="compliance-text">
                                <h2>Built for Compliance</h2>
                                <p>We understand the stakes. Our infrastructure is designed to meet the rigorous demands of financial and legal professionals.</p>
                                <div className="badge-grid">
                                    <div className="badge"><ShieldIcon /> HIPAA Ready</div>
                                    <div className="badge"><ShieldIcon /> FTC Compliant</div>
                                    <div className="badge"><ShieldIcon /> SEC Compliant</div>
                                    <div className="badge"><ShieldIcon /> IRS Standards</div>
                                </div>
                            </div>
                            <div className="compliance-image">
                                <div className="badge" style={{ fontSize: '1.5rem', padding: '3rem', borderStyle: 'dashed' }}>
                                    Compliance Framework v1.5
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="cta-section">
                    <div className="container">
                        <h2>Ready to Upgrade Your Office?</h2>
                        <p>Stop worrying about IT. Start focusing on your clients.</p>
                        <button onClick={onStartConfigurator} className="btn-primary">
                            Configure Your Solution →
                        </button>
                    </div>
                </section>
            </main>

            <footer>
                <div className="container">
                    &copy; {new Date().getFullYear()} Tech To You LLC. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
