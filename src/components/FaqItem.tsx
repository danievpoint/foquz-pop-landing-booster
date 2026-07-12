import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { type Faq, categoryColors } from "@/data/faqs";

const FaqItem = ({ faq, index }: { faq: Faq; index: number }) => {
  const [open, setOpen] = useState(false);
  const Icon = faq.icon;
  const chipColor = categoryColors[faq.category] ?? "bg-foquz-thai-light";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.2) }}
      className={`comic-card bg-card overflow-hidden transition-transform duration-150 ${
        open ? "" : "hover:-translate-y-0.5"
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center gap-3 md:gap-4 px-4 py-4 md:px-5 md:py-5 text-left"
      >
        <span
          className={`shrink-0 grid place-items-center w-10 h-10 md:w-12 md:h-12 rounded-full comic-outline ${chipColor}`}
        >
          <Icon size={20} className="text-foreground" />
        </span>
        <span className="flex-1 min-w-0">
          <span className="block text-[10px] md:text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
            {faq.category}
          </span>
          <span className="block font-extrabold text-base md:text-lg leading-tight">
            {faq.q}
          </span>
        </span>
        <span
          className={`shrink-0 grid place-items-center w-8 h-8 md:w-9 md:h-9 rounded-full comic-outline bg-background transition-transform duration-200 ${
            open ? "rotate-45 bg-primary" : ""
          }`}
          aria-hidden
        >
          <Plus size={18} className={open ? "text-primary-foreground" : ""} />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-5 md:px-5 md:pb-6 pl-[68px] md:pl-[76px]">
              <div className="border-t-2 border-foreground/10 pt-3 md:pt-4">
                <p className="text-sm md:text-base text-foreground/80 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FaqItem;
