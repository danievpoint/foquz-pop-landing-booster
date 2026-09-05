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

const PaymentLogos = ({
  compact = false,
  size = "sm",
}: {
  compact?: boolean;
  size?: "sm" | "md";
}) => {
  if (compact) {
    const isMd = size === "md";
    return (
      <div className="flex flex-nowrap items-center justify-center gap-1.5 sm:gap-2 md:gap-3">
        {methods.map(({ src, label }) => (
          <div
            key={label}
            aria-label={label}
            title={label}
            className={`flex items-center justify-center shrink-0 overflow-hidden ${
              isMd ? "h-6 md:h-8" : "h-5 md:h-8"
            }`}
          >
            <img
              src={src}
              alt={label}
              className={`w-auto object-contain ${
                isMd
                  ? "h-4 md:h-6 max-w-[46px] md:max-w-[52px]"
                  : "h-3.5 md:h-6 max-w-[40px] md:max-w-[52px]"
              }`}
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
