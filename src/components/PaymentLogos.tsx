import {
  SiVisa,
  SiMastercard,
  SiPaypal,
  SiGooglepay,
  SiAmericanexpress,
} from "react-icons/si";

const ShopPayIcon = ({ className, size }: { className?: string; size?: number }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <path d="M3 6h18" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const methods = [
  { Icon: SiVisa, label: "Visa" },
  { Icon: SiMastercard, label: "Mastercard" },
  { Icon: SiAmericanexpress, label: "American Express" },
  { Icon: SiPaypal, label: "PayPal" },
  { Icon: SiGooglepay, label: "Google Pay" },
  { Icon: ShopPayIcon, label: "Shop Pay" },
];

const PaymentLogos = ({ compact = false }: { compact?: boolean }) => {
  if (compact) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
        {methods.map(({ Icon, label }) => (
          <div
            key={label}
            aria-label={label}
            title={label}
            className="bg-white border-2 border-foreground rounded-md px-2.5 py-1 flex items-center justify-center h-8 shadow-sm"
          >
            <Icon className="text-foreground" size={22} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <section className="bg-card py-8 border-t-2 border-foreground">
      <div className="container mx-auto px-4">
        <PaymentLogos compact />
      </div>
    </section>
  );
};

export default PaymentLogos;
