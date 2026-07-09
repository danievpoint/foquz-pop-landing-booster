import {
  SiVisa,
  SiMastercard,
  SiPaypal,
  SiGooglepay,
  SiAmericanexpress,
} from "react-icons/si";

const ShopPayIcon = ({ size = 22 }: { size?: number }) => (
  <svg
    viewBox="0 0 60 24"
    height={size}
    width={size * (60 / 24)}
    aria-hidden="true"
  >
    <rect width="60" height="24" rx="4" fill="#5A31F4" />
    <text
      x="30"
      y="16"
      textAnchor="middle"
      fontFamily="Helvetica, Arial, sans-serif"
      fontWeight="700"
      fontSize="11"
      fill="#ffffff"
      letterSpacing="0.5"
    >
      shop
    </text>
    <text
      x="47"
      y="16"
      textAnchor="middle"
      fontFamily="Helvetica, Arial, sans-serif"
      fontWeight="700"
      fontSize="11"
      fill="#ffffff"
      letterSpacing="0.5"
    >
      Pay
    </text>
  </svg>
);

const methods: { label: string; render: (size: number) => JSX.Element }[] = [
  { label: "Visa", render: (s) => <SiVisa size={s} color="#1A1F71" /> },
  { label: "Mastercard", render: (s) => <SiMastercard size={s} color="#EB001B" /> },
  { label: "American Express", render: (s) => <SiAmericanexpress size={s} color="#2E77BC" /> },
  { label: "PayPal", render: (s) => <SiPaypal size={s} color="#003087" /> },
  { label: "Google Pay", render: (s) => <SiGooglepay size={s} color="#5F6368" /> },
  { label: "Shop Pay", render: () => <ShopPayIcon size={22} /> },
];

const PaymentLogos = ({ compact = false }: { compact?: boolean }) => {
  if (compact) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
        {methods.map(({ render, label }) => (
          <div
            key={label}
            aria-label={label}
            title={label}
            className="bg-white border-2 border-foreground rounded-md px-2.5 py-1 flex items-center justify-center h-8 shadow-sm"
          >
            {render(22)}
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
