import {
  SiVisa,
  SiMastercard,
  SiPaypal,
  SiApplepay,
  SiGooglepay,
  SiAmericanexpress,
  SiKlarna,
} from "react-icons/si";

const methods = [
  { Icon: SiVisa, label: "Visa" },
  { Icon: SiMastercard, label: "Mastercard" },
  { Icon: SiAmericanexpress, label: "American Express" },
  { Icon: SiPaypal, label: "PayPal" },
  { Icon: SiApplepay, label: "Apple Pay" },
  { Icon: SiGooglepay, label: "Google Pay" },
  { Icon: SiKlarna, label: "Klarna" },
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
