import { useState, useRef, useEffect } from 'react';
import type { FormEvent } from 'react';

type SubmitStatus = 'idle' | 'sending' | 'success' | 'error';

export default function Contact() {
  const [isTopicOpen, setIsTopicOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("General Inquiry");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState(""); // honeypot — must stay empty
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [feedback, setFeedback] = useState("");

  const topics = ["General Inquiry", "Bug Report", "Feature Request"];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsTopicOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;

    // Client-side validation (server re-validates independently).
    if (name.trim().length < 2) {
      setStatus('error');
      setFeedback('Please enter your name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setStatus('error');
      setFeedback('Please enter a valid email address.');
      return;
    }
    if (message.trim().length < 5) {
      setStatus('error');
      setFeedback('Please write a short message.');
      return;
    }

    setStatus('sending');
    setFeedback('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          topic: selectedTopic,
          message: message.trim(),
          company, // honeypot
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Something went wrong.');
      }

      setStatus('success');
      setFeedback("Thanks! Your message has been sent.");
      setName("");
      setEmail("");
      setMessage("");
      setSelectedTopic("General Inquiry");
    } catch (err) {
      setStatus('error');
      setFeedback(err instanceof Error ? err.message : 'Failed to send. Please try again.');
    }
  };

  return (
    <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-12 sm:py-20 animate-fade-in">
      <div className="max-w-5xl mx-auto space-y-16">

        {/* Hero Header */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/5 border border-accent/10">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-accent-ink font-mono text-[10px] tracking-[0.2em] uppercase font-semibold">Contact</span>
          </div>
          <div className="space-y-3">
            <h1 className="text-[36px] sm:text-[52px] font-semibold tracking-tight leading-[1.05] text-text-primary">
              Let's build something <span className="text-accent-ink italic">better.</span>
            </h1>
            <p className="text-text-secondary text-[16px] max-w-xl mx-auto leading-relaxed">
              Have a question, feature request, or found a bug? We'd love to hear from you.
            </p>
          </div>
        </div>

        {/* Content: Form + Info Side by Side */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">

          {/* Form */}
          <div className="flex-1">
            <div className="bg-bg-secondary border border-border-subtle rounded-2xl p-6 sm:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-accent/5 blur-[80px] rounded-full pointer-events-none" />
              <form className="space-y-5 relative z-10" onSubmit={handleSubmit}>
                {/* Honeypot: hidden from users, catches spam bots. */}
                <input
                  type="text"
                  name="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute -left-[9999px] top-0 h-0 w-0 opacity-0 pointer-events-none"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-text-secondary uppercase tracking-wider font-semibold">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      maxLength={100}
                      placeholder="Jane Doe"
                      className="w-full bg-bg-base border border-border-subtle rounded-xl px-4 py-3.5 text-sm text-text-primary focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/20 transition-all placeholder:text-text-muted hover:border-border-default"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-text-secondary uppercase tracking-wider font-semibold">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      maxLength={200}
                      placeholder="jane@example.com"
                      className="w-full bg-bg-base border border-border-subtle rounded-xl px-4 py-3.5 text-sm text-text-primary focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/20 transition-all placeholder:text-text-muted hover:border-border-default"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 relative" ref={dropdownRef}>
                  <label className="text-[10px] font-mono text-text-secondary uppercase tracking-wider font-semibold">Topic</label>
                  <div
                    onClick={() => setIsTopicOpen(!isTopicOpen)}
                    className={`w-full bg-bg-base border rounded-xl px-4 py-3.5 text-sm text-text-primary cursor-pointer flex items-center justify-between hover:border-border-default transition-all select-none ${
                      isTopicOpen ? 'border-accent/40 ring-1 ring-accent/20' : 'border-border-subtle'
                    }`}
                  >
                    <span>{selectedTopic}</span>
                    <svg className={`w-4 h-4 text-text-muted transition-transform duration-200 ${isTopicOpen ? 'rotate-180 text-accent-ink' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {isTopicOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1.5 bg-bg-secondary border border-border-subtle rounded-xl shadow-lg overflow-hidden z-20 animate-fade-in">
                      {topics.map((topic) => (
                        <div
                          key={topic}
                          onClick={() => { setSelectedTopic(topic); setIsTopicOpen(false); }}
                          className={`px-4 py-3 text-sm cursor-pointer transition-colors flex items-center justify-between ${
                            selectedTopic === topic
                              ? 'bg-accent/10 text-accent-ink font-medium'
                              : 'text-text-secondary hover:bg-bg-base hover:text-text-primary'
                          }`}
                        >
                          <span>{topic}</span>
                          {selectedTopic === topic && (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-text-secondary uppercase tracking-wider font-semibold">Message</label>
                  <textarea
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={4000}
                    placeholder="How can we help?"
                    className="w-full bg-bg-base border border-border-subtle rounded-xl px-4 py-3.5 text-sm text-text-primary focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/20 transition-all resize-none placeholder:text-text-muted hover:border-border-default"
                  />
                </div>

                {feedback && (
                  <div
                    className={`text-sm rounded-xl px-4 py-3 border ${
                      status === 'success'
                        ? 'bg-ok/10 border-ok/30 text-ok'
                        : 'bg-err/10 border-err/30 text-err'
                    }`}
                  >
                    {feedback}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full px-8 py-3.5 bg-accent text-on-accent rounded-xl font-bold hover:bg-accent-dim hover:scale-[1.01] active:scale-[0.98] transition-all text-[13px] uppercase tracking-wider shadow-[0_0_20px_rgba(215,207,190,0.15)] flex items-center justify-center gap-2 group/btn disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <span>{status === 'sending' ? 'Sending…' : 'Send Message'}</span>
                  {status !== 'sending' && (
                    <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Info Sidebar */}
          <div className="lg:w-72 space-y-6">
            <div className="bg-bg-secondary border border-border-subtle rounded-2xl p-6 space-y-5">
              <h3 className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest font-mono">Connect</h3>
              <a
                href="https://github.com/mosabbir-maruf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-bg-base border border-border-subtle flex items-center justify-center group-hover:border-accent/40 transition-colors">
                  <svg className="w-5 h-5 text-text-secondary group-hover:text-accent-ink transition-colors" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-[9px] font-mono text-text-tertiary font-bold tracking-widest uppercase">GitHub</div>
                  <div className="text-sm font-medium text-text-primary group-hover:text-accent-ink transition-colors">mosabbir-maruf</div>
                </div>
              </a>
            </div>

            <div className="bg-bg-secondary border border-border-subtle rounded-2xl p-6 space-y-3">
              <h3 className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest font-mono">Response Time</h3>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-ok animate-pulse" />
                <span className="text-sm text-text-secondary">Within 24 hours</span>
              </div>
              <p className="text-xs text-text-muted leading-relaxed">
                We typically respond to all inquiries within one business day.
              </p>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
