import { useNavigate } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
    const navigate = useNavigate();

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="landing-container">
            {/* Navigation */}
            <nav className="landing-navbar">
                <div className="landing-navbar-brand">TILARS</div>
                <ul className="landing-navbar-links">
                    <li><a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>Features</a></li>
                    <li><a href="#how-it-works" onClick={(e) => { e.preventDefault(); scrollToSection('how-it-works'); }}>How it works</a></li>
                    <li><a href="#stats" onClick={(e) => { e.preventDefault(); scrollToSection('stats'); }}>Stats</a></li>
                </ul>
                <button className="landing-navbar-cta" onClick={() => navigate('/login')}>Start Free</button>
                <button className="landing-hamburger" aria-label="Menu">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </nav>

            {/* Hero Section */}
            <section className="landing-hero" id="hero">
                <h1>Track Your Gains</h1>
                <p>Crush your fitness goals with TILARS. Log workouts, track progress, dominate your training.</p>

                <div className="landing-hero-cta">
                    <button className="landing-btn-primary" onClick={() => navigate('/login')}>Start Now</button>
                    <button className="landing-btn-secondary" onClick={() => scrollToSection('features')}>Learn more</button>
                </div>

                <img src="/ilusgim.png" alt="TILARS" className="landing-hero-image" />
            </section>

            {/* Features Section */}
            <section className="landing-features" id="features">
                <h2 className="landing-section-title">Designed for Gym Warriors</h2>
                <p className="landing-section-subtitle">Everything you need to dominate your training</p>

                <div className="landing-features-grid">
                    <div className="landing-feature-card">
                        <span className="landing-feature-icon">📊</span>
                        <h3>Smart Progress Tracking</h3>
                        <p>Visual charts show your strength gains over time. Watch your PRs climb week by week.</p>
                    </div>

                    <div className="landing-feature-card">
                        <span className="landing-feature-icon">🏋️</span>
                        <h3>Exercise Library</h3>
                        <p>Browse 200+ exercises with detailed muscle groups, equipment, and form guides.</p>
                    </div>

                    <div className="landing-feature-card">
                        <span className="landing-feature-icon">⚡</span>
                        <h3>Quick Logging</h3>
                        <p>One-tap workout logging. Input sets, reps, weight in seconds. Built for gym speed.</p>
                    </div>

                    {/* <div className="landing-feature-card">
                        <span className="landing-feature-icon">🎯</span>
                        <h3>Personal Records</h3>
                        <p>Auto-track your best performances. Never miss a PR moment again.</p>
                    </div>

                    <div className="landing-feature-card">
                        <span className="landing-feature-icon">📱</span>
                        <h3>Mobile-First Design</h3>
                        <p>Built for gym floor. Works offline. Syncs when connected. Zero distractions.</p>
                    </div>

                    <div className="landing-feature-card">
                        <span className="landing-feature-icon">🔥</span>
                        <h3>Community Vibes</h3>
                        <p>Share your achievements. Celebrate progress with your gym crew. Stay motivated.</p>
                    </div> */}
                </div>
            </section>

            {/* How It Works */}
            <section className="landing-how-it-works" id="how-it-works">
                <h2 className="landing-section-title">Get Started in 3 Steps</h2>
                <p className="landing-section-subtitle">Simple. Fast. Effective.</p>

                <div className="landing-steps-container">
                    <div className="landing-step">
                        <div className="landing-step-number">1</div>
                        <h3>Sign In</h3>
                        <p>Login to your account. Email + password or Google.</p>
                    </div>

                    <div className="landing-step">
                        <div className="landing-step-number">2</div>
                        <h3>Add Exercises</h3>
                        <p>Browse our library. Select your favorite exercises. Build your gym playlist.</p>
                    </div>

                    <div className="landing-step">
                        <div className="landing-step-number">3</div>
                        <h3>Log & Track</h3>
                        <p>Hit the gym. Log sets. Watch your progress climb. Dominate.</p>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="landing-stats-section" id="stats">
                <h2 className="landing-section-title">By The Numbers</h2>
                <p className="landing-section-subtitle">Join thousands crushing their goals</p>

                <div className="landing-stats-grid">
                    <div className="landing-stat-card">
                        <div className="landing-stat-number">10K+</div>
                        <div className="landing-stat-label">Active users</div>
                    </div>

                    <div className="landing-stat-card">
                        <div className="landing-stat-number">500K+</div>
                        <div className="landing-stat-label">Workouts logged</div>
                    </div>

                    <div className="landing-stat-card">
                        <div className="landing-stat-number">200+</div>
                        <div className="landing-stat-label">Exercises</div>
                    </div>

                    <div className="landing-stat-card">
                        <div className="landing-stat-number">98%</div>
                        <div className="landing-stat-label">User satisfaction</div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="landing-cta-final">
                <h2>Ready to Level Up?</h2>
                <p>Start tracking your fitness journey today. Free forever. No credit card.</p>
                <button className="landing-btn-primary" onClick={() => navigate('/login')}>Start Your Journey</button>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="landing-footer-content">
                    <p className="landing-footer-copyright">TILARS © 2026. Built with 💪 for gym warriors everywhere.</p>
                    <ul className="landing-footer-links">
                        <li><a href="#privacy">Privacy</a></li>
                        <li><a href="#terms">Terms</a></li>
                        <li><a href="#contact">Contact</a></li>
                        <li><a href="#github">GitHub</a></li>
                    </ul>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
