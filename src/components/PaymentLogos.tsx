const paymentMethods = [
  "Amex", "Apple Pay", "Bancontact", "eps", "Google Pay",
  "iDEAL", "Mastercard", "PayPal", "TWINT", "UnionPay", "VISA",
];

const PaymentLogos = () => {
  return (
    <section className="bg-card py-8 border-t-2 border-foreground">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
          {paymentMethods.map((method) => (
            <div
              key={method}
              className="bg-background comic-outline rounded-md px-4 py-2 text-xs font-bold text-muted-foreground select-none"
            >
              {method}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PaymentLogos;
