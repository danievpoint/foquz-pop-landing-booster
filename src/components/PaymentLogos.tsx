import {
  SiVisa,
  SiMastercard,
  SiPaypal,
  SiGooglepay,
  SiAmericanexpress,
} from "react-icons/si";

const ShopPayIcon = ({ className, size }: { className?: string; size?: number }) => (
  <svg
    viewBox="0 0 512 512"
    width={size}
    height={size}
    className={className}
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M128 64h256a64 64 0 0 1 64 64v256a64 64 0 0 1-64 64H128a64 64 0 0 1-64-64V128a64 64 0 0 1 64-64z" opacity="0.15" />
    <path d="M160.5 194.6c-4.1-19.4 10.2-36.6 31.8-36.6 18.5 0 31.6 12.2 31.6 31.3 0 9.3-4.2 17.9-12.2 26.2l-20.6 21.3c-8.6 8.9-14.3 19.6-16.3 31.5h48.2v15.2h-66.4c1.2-20.7 8.9-38.6 24.8-54.9l17.5-18.2c5.5-5.7 8.4-12.2 8.4-19.4 0-10.6-7.4-17.3-18.4-17.3-11.5 0-18.9 7.6-20.6 18.8l-17.8-1.8zm93.8-32.4h19.4v87.7h48.8v15.2h-68.2v-102.9zm94 32.9c-2.4-10.5-10.8-17.5-22-17.5-14.2 0-23.3 11.2-23.3 28.9 0 17.5 9.1 28.8 23.3 28.8 11.2 0 19.6-7 22-17.5h17.8c-3.2 20.6-19.4 33.6-39.8 33.6-24.2 0-41.2-17.7-41.2-44.9 0-27.3 17-44.9 41.2-44.9 20.4 0 36.6 13.1 39.8 33.6h-17.8z" />
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
