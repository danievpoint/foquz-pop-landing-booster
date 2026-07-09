import visa from "@/assets/payments/visa.svg";
import mastercard from "@/assets/payments/mastercard.svg";
import amex from "@/assets/payments/amex.svg";
import paypal from "@/assets/payments/paypal.svg";
import googlepay from "@/assets/payments/googlepay.svg";
import shoppay from "@/assets/payments/shoppay.svg";

const methods = [
  { src: visa, label: "Visa" },
  { src: mastercard, label: "Mastercard" },
  { src: amex, label: "American Express" },
  { src: paypal, label: "PayPal" },
  { src: googlepay, label: "Google Pay" },
  { src: shoppay, label: "Shop Pay" },
];

const PaymentLogos = ({ compact = false }: { compact?: boolean }) => {
  if (compact) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
        {methods.map(({ src, label }) => (
          <div
            key={label}
            aria-label={label}
            title={label}
            className="bg-white border-2 border-foreground rounded-md flex items-center justify-center h-8 w-12 shadow-sm overflow-hidden"
          >
            <img src={src} alt={label} className="max-h-6 max-w-full object-contain" />
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
