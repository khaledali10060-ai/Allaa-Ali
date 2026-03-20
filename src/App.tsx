import { motion, useScroll, useSpring, AnimatePresence } from "motion/react";
import { 
  Rocket, 
  Target, 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  BarChart3, 
  Palette, 
  Megaphone, 
  ChevronRight,
  Menu,
  X,
  Linkedin,
  Twitter,
  Instagram,
  AlertCircle,
  ShieldCheck,
  Clock,
  Users,
  Quote,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Code2,
  TrendingUp
} from "lucide-react";
import { useState, useEffect, ReactNode, FormEvent } from "react";
import { Button, Card, Section, Counter, Notification, Modal } from "./components/UI";
import { translations } from "./translations";

export default function App() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const t = translations[lang];

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [hasShownExitIntent, setHasShownExitIntent] = useState(false);
  const [exitIntentStatus, setExitIntentStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [currentNotification, setCurrentNotification] = useState<{ message: string; icon?: ReactNode } | null>(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = t.dir;
  }, [lang, t.dir]);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      // Trigger when mouse leaves the top of the window (intent to close/change tab)
      if (e.clientY <= 0 && !hasShownExitIntent) {
        setShowExitIntent(true);
        setHasShownExitIntent(true);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [hasShownExitIntent]);

  useEffect(() => {
    const activities = t.notifications.map((msg) => ({
      message: msg,
      icon: <Rocket className="w-5 h-5 text-brand" />
    }));

    const showNotification = () => {
      const randomActivity = activities[Math.floor(Math.random() * activities.length)];
      setCurrentNotification(randomActivity);
      
      setTimeout(() => {
        setCurrentNotification(null);
      }, 4000);
    };

    const interval = setInterval(() => {
      showNotification();
    }, 12000);

    // Initial delay
    const initialTimeout = setTimeout(showNotification, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimeout);
    };
  }, [lang, t.notifications]);

  const services = t.services.items.map((item, i) => ({
    ...item,
    icon: [
      <Palette className="w-6 h-6 text-brand" />,
      <Rocket className="w-6 h-6 text-brand" />,
      <Megaphone className="w-6 h-6 text-brand" />,
      <BarChart3 className="w-6 h-6 text-brand" />
    ][i],
    image: [
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=500",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=500",
      "https://images.unsplash.com/photo-1493612276216-ee3925520721?auto=format&fit=crop&q=80&w=500",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=500"
    ][i]
  }));

  const steps = t.howItWorks.steps.map((step, i) => ({
    ...step,
    icon: [
      <Target className="w-8 h-8 text-brand" />,
      <Code2 className="w-8 h-8 text-brand" />,
      <TrendingUp className="w-8 h-8 text-brand" />
    ][i]
  }));

  const usps = t.usps.items.map((usp, i) => ({
    ...usp,
    icon: [
      <ShieldCheck className="w-8 h-8 text-brand" />,
      <Clock className="w-8 h-8 text-brand" />,
      <Users className="w-8 h-8 text-brand" />
    ][i]
  }));

  const testimonials = t.testimonials.items.map((t, i) => ({
    ...t,
    image: [
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200"
    ][i]
  }));

  const caseStudies = t.portfolio.items.map((cs, i) => ({
    ...cs,
    image: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800"
    ][i]
  }));

  const pricingPlans = t.pricing.plans.map((plan, i) => ({
    ...plan,
    popular: i === 1,
    waMessage: [
      "عايز أبدأ في الباقة الأولى (7000)",
      "عايز أبدأ في الباقة التانية (10000)",
      "عايز أبدأ في الباقة التالتة (15000)"
    ][i]
  }));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTimedModalOpen, setIsTimedModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    hasIdea: "Yes",
    businessType: "",
    budget: ""
  });
  const [timedFormData, setTimedFormData] = useState({
    name: "",
    phone: ""
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      // Only show if no other modal is open and hasn't been shown before in this session
      const hasShown = sessionStorage.getItem('yalla_timed_popup_shown');
      if (!isModalOpen && !hasShown) {
        setIsTimedModalOpen(true);
        sessionStorage.setItem('yalla_timed_popup_shown', 'true');
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [isModalOpen]);

  const handleTimedFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    const leads = JSON.parse(localStorage.getItem('yalla_timed_leads') || '[]');
    leads.push({
      ...timedFormData,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('yalla_timed_leads', JSON.stringify(leads));
    
    setIsTimedModalOpen(false);
    setTimedFormData({ name: "", phone: "" });
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Save data to localStorage (Mock saving)
    const leads = JSON.parse(localStorage.getItem('yalla_leads') || '[]');
    leads.push({
      ...formData,
      plan: selectedPlan.name,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('yalla_leads', JSON.stringify(leads));

    // Wait for 1.5 seconds for the loading animation
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Redirect to WhatsApp
    const phone = "201115360175";
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(selectedPlan.waMessage)}`;
    window.open(url, '_blank');
    
    setIsSubmitting(false);
    setIsModalOpen(false);
    // Reset form
    setFormData({
      name: "",
      phone: "",
      hasIdea: "Yes",
      businessType: "",
      budget: ""
    });
  };

  return (
    <div className="min-h-screen selection:bg-brand/10 selection:text-brand scroll-smooth">
      {/* Lead Form Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => !isSubmitting && setIsModalOpen(false)}
        title={isSubmitting ? "" : t.modal.title}
      >
        {isSubmitting ? (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                scale: { duration: 1, repeat: Infinity }
              }}
              className="w-20 h-20 border-4 border-brand/20 border-t-brand rounded-full mb-8"
            />
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold text-slate-900"
              dir={t.dir}
            >
              {t.modal.preparing}
            </motion.p>
            <p className="text-slate-500 mt-2">{t.modal.preparingDesc}</p>
          </div>
        ) : (
          <form onSubmit={handleFormSubmit} className="space-y-5">
            <div className="p-4 bg-brand/5 border border-brand/10 rounded-2xl text-center mb-6">
              <p className="text-sm font-bold text-brand" dir={t.dir}>
                {t.modal.trust}
              </p>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">{t.modal.fields.name}</label>
              <input 
                required
                type="text"
                placeholder={t.modal.fields.namePlaceholder}
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-brand focus:ring-2 focus:ring-brand/10 outline-none transition-all"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">{t.modal.fields.phone}</label>
              <input 
                required
                type="tel"
                placeholder={t.modal.fields.phonePlaceholder}
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-brand focus:ring-2 focus:ring-brand/10 outline-none transition-all"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">{t.modal.fields.hasIdea}</label>
              <div className="flex gap-4">
                {["Yes", "No"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setFormData({...formData, hasIdea: option})}
                    className={`flex-1 py-3 rounded-xl border font-bold transition-all ${
                      formData.hasIdea === option 
                      ? "bg-brand text-white border-brand" 
                      : "bg-white text-slate-500 border-slate-100 hover:bg-slate-50"
                    }`}
                  >
                    {lang === 'ar' ? (option === 'Yes' ? 'نعم' : 'لا') : option}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">{t.modal.fields.businessType}</label>
              <input 
                type="text"
                placeholder={t.modal.fields.businessPlaceholder}
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-brand focus:ring-2 focus:ring-brand/10 outline-none transition-all"
                value={formData.businessType}
                onChange={(e) => setFormData({...formData, businessType: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">{t.modal.fields.budget}</label>
              <select 
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-brand focus:ring-2 focus:ring-brand/10 outline-none transition-all appearance-none"
                value={formData.budget}
                onChange={(e) => setFormData({...formData, budget: e.target.value})}
              >
                <option value="">{t.modal.fields.budgetPlaceholder}</option>
                {t.modal.fields.budgets.map((b, idx) => (
                  <option key={idx} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div className="pt-2">
              <p className="text-xs text-center text-slate-400 font-bold mb-3 uppercase tracking-widest" dir={t.dir}>
                {t.modal.urgency}
              </p>
              <Button type="submit" className="w-full py-5 text-lg">
                {t.modal.cta}
              </Button>
            </div>
          </form>
        )}
      </Modal>
      {/* Progress Bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-brand z-[60] origin-left" style={{ scaleX }} />

      {/* Timed Popup */}
      <Modal
        isOpen={isTimedModalOpen}
        onClose={() => setIsTimedModalOpen(false)}
        title={t.timedPopup.headline}
      >
        <div className="space-y-6">
          <p className="text-slate-600 text-center text-lg">{t.timedPopup.text}</p>
          <form onSubmit={handleTimedFormSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2 text-slate-700">{t.timedPopup.nameLabel}</label>
              <input 
                type="text" 
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all outline-none"
                placeholder={t.modal.fields.namePlaceholder}
                value={timedFormData.name}
                onChange={(e) => setTimedFormData({...timedFormData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-slate-700">{t.timedPopup.phoneLabel}</label>
              <input 
                type="tel" 
                required
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all outline-none"
                placeholder={t.modal.fields.phonePlaceholder}
                value={timedFormData.phone}
                onChange={(e) => setTimedFormData({...timedFormData, phone: e.target.value})}
              />
            </div>
            <Button variant="primary" className="w-full py-5 text-lg" type="submit">
              {t.timedPopup.button}
            </Button>
          </form>
        </div>
      </Modal>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "glass py-4 shadow-sm" : "bg-transparent py-6"}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center">
              <Rocket className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-display font-bold tracking-tight">Yalla Founder</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-brand transition-colors">{t.nav.howItWorks}</a>
            <a href="#services" className="text-sm font-medium text-slate-600 hover:text-brand transition-colors">{t.nav.services}</a>
            <a href="#portfolio" className="text-sm font-medium text-slate-600 hover:text-brand transition-colors">{t.nav.portfolio}</a>
            <a href="#contact" className="text-sm font-medium text-slate-600 hover:text-brand transition-colors">{t.nav.contact}</a>
            
            <button 
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="px-3 py-1 rounded-lg border border-slate-200 text-xs font-bold hover:bg-slate-50 transition-colors"
            >
              {lang === 'ar' ? 'EN' : 'AR'}
            </button>

            <Button variant="primary" className="text-sm py-2 px-5" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>{t.nav.startNow}</Button>
          </div>

          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full left-0 right-0 glass p-6 flex flex-col gap-4 md:hidden"
          >
            <a href="#how-it-works" className="text-lg font-medium" onClick={() => setIsMenuOpen(false)}>{t.nav.howItWorks}</a>
            <a href="#services" className="text-lg font-medium" onClick={() => setIsMenuOpen(false)}>{t.nav.services}</a>
            <a href="#portfolio" className="text-lg font-medium" onClick={() => setIsMenuOpen(false)}>{t.nav.portfolio}</a>
            <a href="#contact" className="text-lg font-medium" onClick={() => setIsMenuOpen(false)}>{t.nav.contact}</a>
            
            <button 
              onClick={() => {
                setLang(lang === 'ar' ? 'en' : 'ar');
                setIsMenuOpen(false);
              }}
              className="px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold text-left"
            >
              {lang === 'ar' ? 'Switch to English' : 'تغيير للغة العربية'}
            </button>

            <Button variant="primary" className="w-full">{t.nav.getStarted}</Button>
          </motion.div>
        )}
      </nav>

      {/* 1. Hero Section */}
      <Section className="pt-40 pb-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
          <img 
            src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=1920" 
            alt="Background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white/80 to-white" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand/5 text-brand text-xs font-bold uppercase tracking-widest mb-6">
            <Zap className="w-3 h-3 fill-brand" /> {t.hero.badge}
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl mb-8 leading-[1.1] max-w-4xl mx-auto">
            {t.hero.title1} <br />
            <span className="text-gradient">{t.hero.title2}</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t.hero.description}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="primary" className="w-full sm:w-auto px-8 py-4 text-lg" onClick={() => setIsModalOpen(true)}>
              {t.hero.ctaPrimary} <ArrowRight className={`w-5 h-5 ${lang === 'ar' ? 'rotate-180' : ''}`} />
            </Button>
            <Button variant="outline" className="w-full sm:w-auto px-8 py-4 text-lg" onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}>
              {t.hero.ctaSecondary}
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-20 max-w-5xl mx-auto rounded-[3rem] overflow-hidden shadow-2xl border border-slate-100 relative group"
        >
          <img 
            src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=1920" 
            alt="Confident Egyptian entrepreneur" 
            className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent pointer-events-none" />
          <div className="absolute bottom-12 left-12 text-left">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
              <div className="w-12 h-12 bg-brand rounded-xl flex items-center justify-center">
                <Rocket className="text-white w-6 h-6" />
              </div>
              <div>
                <p className="text-white font-bold">First Sale Secured</p>
                <p className="text-white/70 text-xs">28 days from idea</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 flex flex-wrap justify-center items-center gap-8 md:gap-16 grayscale opacity-50"
        >
          <div className="flex items-center gap-2 font-bold text-slate-400"><Zap className="w-5 h-5" /> STRIPE</div>
          <div className="flex items-center gap-2 font-bold text-slate-400"><Rocket className="w-5 h-5" /> AWS</div>
          <div className="flex items-center gap-2 font-bold text-slate-400"><Target className="w-5 h-5" /> META</div>
          <div className="flex items-center gap-2 font-bold text-slate-400"><BarChart3 className="w-5 h-5" /> GOOGLE</div>
          <div className="flex items-center gap-2 font-bold text-slate-400"><ShieldCheck className="w-5 h-5" /> VERIFIED</div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-20 relative"
        >
          <div className="aspect-video max-w-5xl mx-auto rounded-[2rem] overflow-hidden bg-slate-100 border border-slate-200 shadow-2xl relative group">
            <img 
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1920" 
              alt="Modern Cairo Startup Office" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white/40 to-transparent" />
          </div>
        </motion.div>
      </Section>

      {/* 2. Problem Section */}
      <Section className="bg-slate-50 rounded-[4rem] my-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="rounded-[3rem] overflow-hidden shadow-xl border border-white relative group">
              <img 
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1000" 
                alt="Stressed entrepreneur in Cairo" 
                className="w-full aspect-[4/5] object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-red-500/10 mix-blend-overlay" />
            </div>
            <div className={`absolute -bottom-8 ${lang === 'ar' ? '-left-8' : '-right-8'} glass p-8 rounded-[2rem] shadow-xl border border-white/50 max-w-[240px]`}>
              <p className="text-slate-600 italic text-sm">{t.problem.quote}</p>
            </div>
          </motion.div>
          <div>
            <span className="text-brand font-bold uppercase tracking-widest text-sm mb-4 block">{t.problem.badge}</span>
            <h2 className="text-4xl md:text-5xl mb-8">{t.problem.title}</h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              {t.problem.description}
            </p>
            <div className="space-y-4">
              {t.problem.points.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <AlertCircle className="text-red-500 w-5 h-5 shrink-0 mt-1" />
                  <span className="font-medium text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Before/After Transformation Section */}
      <Section className="bg-slate-900 text-white rounded-[4rem] my-20 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <Rocket className="w-64 h-64 rotate-12" />
        </div>
        <div className="text-center mb-16 relative z-10">
          <span className="text-brand font-bold uppercase tracking-widest text-sm mb-4 block">{t.transformation.badge}</span>
          <h2 className="text-4xl md:text-5xl mb-6">{t.transformation.title}</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">{t.transformation.description}</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 relative z-10">
          <div className="p-10 rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-red-500/10 transition-colors" />
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 text-red-400">
              <X className="w-6 h-6" /> {t.transformation.before.title}
            </h3>
            <ul className="space-y-8">
              {t.transformation.before.items.map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0 border border-red-500/20">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <p className="font-bold text-lg text-white mb-1">{item.title}</p>
                    <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="p-10 rounded-3xl bg-brand/10 border border-brand/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-brand/20 transition-colors" />
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 text-brand">
              <CheckCircle2 className="w-6 h-6" /> {t.transformation.after.title}
            </h3>
            <ul className="space-y-8">
              {t.transformation.after.items.map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand/20 flex items-center justify-center shrink-0 border border-brand/30">
                    <Zap className="w-5 h-5 text-brand" />
                  </div>
                  <div>
                    <p className="font-bold text-lg text-white mb-1">{item.title}</p>
                    <p className="text-sm text-slate-300 leading-relaxed">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <Button variant="primary" className="px-12 py-5 text-xl" onClick={() => setIsModalOpen(true)}>
            {t.transformation.cta.primary}
          </Button>
          <p className="text-sm text-slate-500 mt-4">{t.transformation.cta.secondary}</p>
        </div>
      </Section>

      {/* 3. Solution Section */}
      <Section>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <span className="text-brand font-bold uppercase tracking-widest text-sm mb-4 block">{t.usps.badge}</span>
            <h2 className="text-4xl md:text-5xl mb-8">{t.usps.title}</h2>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed">
              {t.usps.description}
            </p>
            <div className="grid gap-6">
              {usps.map((usp, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex items-start gap-5 p-6 rounded-3xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
                >
                  <div className="shrink-0">{usp.icon}</div>
                  <div>
                    <h4 className="font-bold text-xl mb-2">{usp.title}</h4>
                    <p className="text-slate-500">{usp.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2 relative"
          >
            <div className="rounded-[3rem] overflow-hidden shadow-2xl border border-slate-100 relative group">
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1000" 
                alt="Team working together in Cairo" 
                className="w-full aspect-[4/5] object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-brand/5 mix-blend-overlay" />
            </div>
            <div className={`absolute -top-8 ${lang === 'ar' ? '-right-8' : '-left-8'} glass p-8 rounded-[2rem] shadow-xl border border-white/50 max-w-[240px]`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-brand rounded-full flex items-center justify-center">
                  <CheckCircle2 className="text-white w-5 h-5" />
                </div>
                <span className="font-bold text-sm">{t.solution.launchReady}</span>
              </div>
              <p className="text-xs text-slate-500">{t.solution.launchDesc}</p>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* 4. Services Section */}
      <div className="bg-slate-900 py-24 text-white" id="services">
        <Section>
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl md:text-6xl mb-8 leading-tight">
                {t.services.title} <br />
                <span className="text-brand">{t.services.titleAccent}</span>
              </h2>
              <p className="text-slate-400 text-lg mb-12 max-w-lg">
                {t.services.description}
              </p>
              <div className="grid sm:grid-cols-2 gap-6">
                {services.map((service, i) => (
                  <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
                    <div className="mb-4 flex items-center justify-between">
                      {service.icon}
                      <div className="w-12 h-12 rounded-xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity">
                        <img src={service.image} alt={service.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                    </div>
                    <h4 className="text-lg font-bold mb-2">{service.title}</h4>
                    <p className="text-sm text-slate-400">{service.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-[3rem] overflow-hidden group">
                <img 
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1000" 
                  alt="Team working in Cairo" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className={`absolute -bottom-10 ${lang === 'ar' ? '-right-10' : '-left-10'} glass p-8 rounded-3xl text-slate-900 max-w-xs shadow-2xl`}>
                <p className="text-3xl font-display font-bold mb-2">100%</p>
                <p className="text-sm text-slate-500 font-medium">{t.services.successRate}</p>
              </div>
            </div>
          </div>
        </Section>
      </div>

      {/* 5. How It Works */}
      <Section id="how-it-works">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl mb-6">{t.howItWorks.title}</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">{t.howItWorks.description}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <Card key={i} className="relative overflow-hidden group p-10">
              <span className={`text-8xl font-display font-black text-slate-50 absolute -top-4 ${lang === 'ar' ? '-left-4' : '-right-4'} group-hover:text-brand/5 transition-colors`}>
                {step.number}
              </span>
              <div className="w-16 h-16 bg-brand/5 rounded-2xl flex items-center justify-center mb-8 relative z-10 group-hover:bg-brand group-hover:text-white transition-colors">
                {step.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 relative z-10">{step.title}</h3>
              <p className="text-slate-500 relative z-10 leading-relaxed">{step.description}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* 5.5 Philosophy Section (New) */}
      <Section className="bg-[#fdfbf7] rounded-[4rem] my-20 border border-orange-100/50">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[3/4] rounded-[3rem] overflow-hidden shadow-xl border-8 border-white bg-white rotate-2 hover:rotate-0 transition-transform duration-500">
              <img 
                src="https://picsum.photos/seed/philosophy/800/1200" 
                alt="Our Philosophy" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-orange-900/5 mix-blend-multiply pointer-events-none" />
            </div>
            {/* Decorative elements to match the sketch style */}
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-brand/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-brand/5 rounded-full blur-3xl" />
          </motion.div>
          <div>
            <span className="text-brand font-bold uppercase tracking-widest text-sm mb-4 block">{t.philosophy.badge}</span>
            <h2 className="text-4xl md:text-5xl mb-8 font-serif italic">{t.philosophy.title}</h2>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed font-medium">
              {t.philosophy.description}
            </p>
            <div className="grid grid-cols-2 gap-6">
              {[
                { title: "التحقق السريع", desc: "بنجرب الفكرة في السوق فوراً." },
                { title: "النمو المستدام", desc: "بنبني أساس قوي للبيزنس." },
                { title: "الشراكة الحقيقية", desc: "نجاحنا من نجاحك." },
                { title: "الشفافية المطلقة", desc: "كل خطوة واضحة ومعروفة." }
              ].map((item, i) => (
                <div key={i} className="p-6 rounded-2xl bg-white/50 border border-orange-100">
                  <h4 className="font-bold mb-2 text-brand">{item.title}</h4>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* 6. Why Choose Us (USP) */}
      <Section className="bg-slate-50 rounded-[4rem] my-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl mb-6">{t.usps.title}</h2>
          <p className="text-slate-500">{t.usps.description}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-12">
          {usps.map((usp, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center mx-auto mb-8">
                {usp.icon}
              </div>
              <h3 className="text-xl font-bold mb-4">{usp.title}</h3>
              <p className="text-slate-500 leading-relaxed">{usp.description}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* 7. Testimonials */}
      <Section>
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl mb-6">{t.testimonials.title}</h2>
          <p className="text-slate-500">{t.testimonials.description}</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((t, i) => (
            <Card key={i} className="bg-slate-50 border-none p-12">
              <Quote className={`w-10 h-10 text-brand/20 mb-6 ${lang === 'ar' ? 'scale-x-[-1]' : ''}`} />
              <p className="text-xl text-slate-700 mb-8 italic leading-relaxed">"{t.quote}"</p>
              <div className="flex items-center gap-4">
                <img src={t.image} alt={t.author} className="w-12 h-12 rounded-full object-cover" referrerPolicy="no-referrer" />
                <div>
                  <p className="font-bold">{t.author}</p>
                  <p className="text-sm text-slate-500">{t.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* 8. Portfolio / Case Studies */}
      <Section id="portfolio">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl mb-6">{t.portfolio.title}</h2>
            <p className="text-slate-500">{t.portfolio.description}</p>
          </div>
          <Button variant="outline">{t.portfolio.cta}</Button>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {caseStudies.map((caseStudy, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="group cursor-pointer"
            >
              <div className="aspect-video rounded-3xl overflow-hidden mb-6 relative">
                <img 
                  src={caseStudy.image} 
                  alt={caseStudy.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className={`absolute top-4 ${lang === 'ar' ? 'left-4' : 'right-4'} glass px-4 py-2 rounded-full text-xs font-bold text-brand`}>
                  {caseStudy.result}
                </div>
              </div>
              <p className="text-sm font-bold text-brand uppercase tracking-widest mb-2">{caseStudy.category}</p>
              <h3 className="text-2xl font-bold flex items-center gap-2">
                {caseStudy.title} <ExternalLink className={`w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity ${lang === 'ar' ? 'scale-x-[-1]' : ''}`} />
              </h3>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* 9. Call To Action (Pricing/Model) */}
      <Section id="pricing" className="text-center">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-4xl md:text-6xl mb-8">{t.pricing.title}</h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">
              {t.pricing.description}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {pricingPlans.map((plan, i) => (
              <Card 
                key={i} 
                className={`p-10 relative flex flex-col h-full transition-all duration-300 ${
                  plan.popular ? "border-brand border-2 shadow-2xl scale-105 z-10" : "border-slate-100"
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand text-white text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full">
                    {t.pricing.popular}
                  </div>
                )}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-slate-500 text-sm">{plan.description}</p>
                </div>
                <div className="mb-8">
                  <div className="flex items-baseline gap-2 justify-center">
                    <span className="text-5xl font-display font-black text-slate-900">{plan.price}</span>
                    <span className="text-slate-500 font-bold">{t.pricing.currency}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 uppercase font-bold tracking-widest">{t.pricing.feeType}</p>
                </div>
                <ul className={`space-y-4 mb-10 flex-grow ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm font-medium text-slate-600">
                      <CheckCircle2 className="text-brand w-5 h-5 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button 
                  variant={plan.popular ? "primary" : "outline"} 
                  className="w-full py-4"
                  onClick={() => {
                    setSelectedPlan(plan);
                    setIsModalOpen(true);
                  }}
                >
                  {t.pricing.cta}
                </Button>
              </Card>
            ))}
          </div>

          <div className="mt-12 p-8 rounded-[2rem] bg-brand/5 border border-brand/10 inline-block">
            <p className="text-2xl md:text-3xl font-bold text-brand mb-2">
              {t.pricing.guarantee.title}
            </p>
            <p className="text-slate-500 text-sm">{t.pricing.guarantee.subtitle}</p>
          </div>
          
          <p className="text-xs text-slate-400 mt-8 italic">{t.pricing.urgency}</p>
        </div>
      </Section>

      {/* 10. Contact Section */}
      <Section id="contact">
        <div className="grid lg:grid-cols-2 gap-20">
          <div>
            <h2 className="text-4xl md:text-5xl mb-8">{t.contact.title}</h2>
            <p className="text-lg text-slate-500 mb-12">
              {t.contact.description}
            </p>
            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center shrink-0">
                  <Mail className="text-brand w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{t.contact.emailLabel}</p>
                  <p className="text-lg font-bold">hello@yallafounder.com</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center shrink-0">
                  <MessageSquare className="text-brand w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{t.contact.phoneLabel}</p>
                  <p className="text-lg font-bold">{t.contact.phoneValue}</p>
                </div>
              </div>
            </div>
          </div>
          <Card className="p-10">
            {formStatus === 'success' ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{t.contact.successTitle}</h3>
                <p className="text-slate-500">{t.contact.successSubtitle}</p>
                <Button variant="outline" className="mt-8" onClick={() => setFormStatus('idle')}>{t.contact.sendAnother}</Button>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={(e) => {
                e.preventDefault();
                setFormStatus('submitting');
                setTimeout(() => setFormStatus('success'), 1500);
              }}>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">{t.contact.nameLabel}</label>
                    <input required type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-all" placeholder={t.contact.namePlaceholder} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">{t.contact.emailLabel}</label>
                    <input required type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-all" placeholder={t.contact.emailPlaceholder} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">{t.contact.messageLabel}</label>
                  <textarea required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-all h-32" placeholder={t.contact.messagePlaceholder}></textarea>
                </div>
                <Button type="submit" variant="primary" className="w-full py-4" disabled={formStatus === 'submitting'}>
                  {formStatus === 'submitting' ? t.contact.submitting : t.contact.submitBtn}
                </Button>
              </form>
            )}
          </Card>
        </div>
      </Section>

      {/* 11. FAQ Section */}
      <Section className="bg-slate-50 rounded-[4rem] my-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl mb-12 text-center">{t.faq.title}</h2>
          <div className="space-y-6">
            {t.faq.items.map((faq, i) => (
              <div key={i} className="p-8 rounded-2xl bg-white border border-slate-100">
                <h4 className={`text-lg font-bold mb-3 flex items-center justify-between ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                  {faq.q}
                  <ChevronRight className={`w-5 h-5 text-slate-300 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                </h4>
                <p className="text-slate-500">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Footer */}
      <footer className="py-20 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
                  <Rocket className="text-white w-5 h-5" />
                </div>
                <span className="text-xl font-display font-bold tracking-tight">Yalla Founder</span>
              </div>
              <p className="text-slate-500 max-w-xs mb-8">
                Building the next generation of online businesses. Risk-free venture building for ambitious founders.
              </p>
              <div className="flex gap-4">
                <a href="#" className="p-2 rounded-full bg-slate-50 text-slate-400 hover:text-brand transition-colors"><Twitter className="w-5 h-5" /></a>
                <a href="#" className="p-2 rounded-full bg-slate-50 text-slate-400 hover:text-brand transition-colors"><Linkedin className="w-5 h-5" /></a>
                <a href="#" className="p-2 rounded-full bg-slate-50 text-slate-400 hover:text-brand transition-colors"><Instagram className="w-5 h-5" /></a>
              </div>
            </div>
            <div>
              <h5 className="font-bold mb-6">{t.footer.links.title}</h5>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a href="#services" className="hover:text-brand transition-colors">{t.nav.services}</a></li>
                <li><a href="#how-it-works" className="hover:text-brand transition-colors">{t.nav.howItWorks}</a></li>
                <li><a href="#portfolio" className="hover:text-brand transition-colors">{t.nav.portfolio}</a></li>
                <li><a href="#pricing" className="hover:text-brand transition-colors">{t.nav.pricing}</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-6">{t.footer.legal.title}</h5>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a href="#" className="hover:text-brand transition-colors">{t.footer.legal.privacy}</a></li>
                <li><a href="#" className="hover:text-brand transition-colors">{t.footer.legal.terms}</a></li>
                <li><a href="#" className="hover:text-brand transition-colors">{t.footer.legal.cookies}</a></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-12 border-t border-slate-50 text-xs text-slate-400 font-medium uppercase tracking-widest">
            <p>{t.footer.copyright}</p>
            <p>{t.footer.madeWith}</p>
          </div>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <a 
        href={`https://wa.me/201115360175?text=${encodeURIComponent(t.whatsapp.defaultMessage)}`}
        target="_blank" 
        rel="noopener noreferrer"
        className={`fixed bottom-8 ${lang === 'ar' ? 'left-8' : 'right-8'} z-[100] w-16 h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 group`}
      >
        <MessageSquare className="w-8 h-8" />
        <span className={`absolute ${lang === 'ar' ? 'left-full ml-4' : 'right-full mr-4'} px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none`}>
          {t.whatsapp.chatLabel}
        </span>
      </a>

      {/* Real-time Notifications */}
      <Notification 
        isVisible={!!currentNotification} 
        message={currentNotification?.message || ""} 
        icon={currentNotification?.icon}
        lang={lang}
        label={t.notificationLabel}
      />

      {/* Exit Intent Popup */}
      <AnimatePresence>
        {showExitIntent && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowExitIntent(false)}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <button 
                onClick={() => setShowExitIntent(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 transition-colors z-10"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>

              <div className="p-8 md:p-12 text-center">
                <div className="w-20 h-20 bg-brand/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
                  <Rocket className="w-10 h-10 text-brand" />
                </div>
                
                <h3 className="text-3xl font-bold mb-4 leading-tight">
                  {t.exitIntent.title}
                </h3>
                <p className="text-slate-500 text-lg mb-10">
                  {t.exitIntent.description}
                </p>

                {exitIntentStatus === 'success' ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100"
                  >
                    <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                    <p className="font-bold text-emerald-900">{t.exitIntent.success}</p>
                  </motion.div>
                ) : (
                  <form 
                    className="space-y-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      setExitIntentStatus('submitting');
                      setTimeout(() => setExitIntentStatus('success'), 1500);
                    }}
                  >
                    <div className="space-y-2 text-start">
                      <label className="text-sm font-bold text-slate-700 px-1">
                        {t.exitIntent.phoneLabel}
                      </label>
                      <input 
                        required
                        type="tel"
                        className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition-all text-lg"
                        placeholder={t.exitIntent.phonePlaceholder}
                      />
                    </div>
                    <Button 
                      type="submit" 
                      variant="primary" 
                      className="w-full py-5 text-lg shadow-xl shadow-brand/20"
                      disabled={exitIntentStatus === 'submitting'}
                    >
                      {exitIntentStatus === 'submitting' ? t.modal.preparing : t.exitIntent.button}
                    </Button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
