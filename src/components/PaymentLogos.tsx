import visa from "@/assets/payments/visa.svg";
import mastercard from "@/assets/payments/mastercard.svg";
import amex from "@/assets/payments/amex.svg";
import paypal from "@/assets/payments/paypal.svg";
import googlepay from "@/assets/payments/googlepay.svg";

const methods = [
  { src: visa, label: "Visa" },
  { src: mastercard, label: "Mastercard" },
  { src: amex, label: "American Express" },
  { src: paypal, label: "PayPal" },
  { src: googlepay, label: "Google Pay" },
];

const PaymentLogos = ({ compact = false }: { compact?: boolean }) => {
  if (compact) {
    return (
      <div className="flex flex-nowrap items-center justify-center gap-1.5 sm:gap-2 md:gap-3">
        {methods.map(({ src, label }) => (
          <div
            key={label}
            aria-label={label}
            title={label}
            className="flex items-center justify-center h-7 md:h-8 shrink-0 overflow-hidden"
          >
            <img
              src={src}
              alt={label}
              className="h-5 md:h-6 w-auto max-w-[52px] object-contain"
            />
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
