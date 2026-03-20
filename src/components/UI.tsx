import { motion, HTMLMotionProps, useInView, useMotionValue, useTransform, animate, AnimatePresence } from "motion/react";
import { ReactNode, HTMLAttributes, FC, useEffect, useRef } from "react";
import { Zap, X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export const Modal: FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <div className="p-8 md:p-10">
              <div className="flex items-center justify-between mb-8">
                {title && <h3 className="text-2xl font-bold text-slate-900">{title}</h3>}
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors ml-auto"
                >
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

interface NotificationProps {
  message: string;
  icon?: ReactNode;
  isVisible: boolean;
  lang?: 'ar' | 'en';
  label?: string;
}

export const Notification: FC<NotificationProps> = ({ message, icon, isVisible, lang = 'ar', label = 'Live Activity' }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: lang === 'ar' ? -50 : 50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: lang === 'ar' ? -20 : 20, scale: 0.9 }}
          dir={lang === 'ar' ? 'rtl' : 'ltr'}
          className={`fixed bottom-28 ${lang === 'ar' ? 'left-8' : 'right-8'} z-[110] glass p-4 rounded-2xl shadow-2xl border border-brand/20 flex items-center gap-3 min-w-[280px]`}
        >
          <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center shrink-0">
            {icon || <Zap className="w-5 h-5 text-brand" />}
          </div>
          <div>
            <p className="text-xs font-bold text-brand uppercase tracking-widest mb-0.5">{label}</p>
            <p className="text-sm font-medium text-slate-700">{message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface CounterProps {
  value: number;
  duration?: number;
  suffix?: string;
  className?: string;
}

export const Counter: FC<CounterProps> = ({ value, duration = 2, suffix = "", className = "" }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, { duration });
      return controls.stop;
    }
  }, [isInView, count, value, duration]);

  return (
    <span ref={ref} className={className}>
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
};

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'outline';
}

export const Button: FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = "px-6 py-3 rounded-full font-medium transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer";
  const variants = {
    primary: "bg-brand text-white hover:bg-brand-dark shadow-lg shadow-brand/20",
    secondary: "bg-slate-900 text-white hover:bg-slate-800",
    outline: "border border-slate-200 text-slate-900 hover:bg-slate-50"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export const Card: FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-shadow duration-300 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

interface SectionProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

export const Section: FC<SectionProps> = ({ children, className = '', ...props }) => {
  return (
    <section className={`py-24 px-6 md:px-12 max-w-7xl mx-auto ${className}`} {...props}>
      {children}
    </section>
  );
};
