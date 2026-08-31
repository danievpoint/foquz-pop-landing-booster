import { Link, useSearchParams } from "react-router-dom";

const MESSAGES: Record<string, { title: string; text: string }> = {
  ok: {
    title: "ANMELDUNG BESTÄTIGT! 🎉",
    text: "Perfekt — du bist jetzt im Newsletter und beim Gewinnspiel um 250 € dabei. Deinen 10 % Rabattcode bekommst du gleich per E-Mail.",
  },
  already: {
    title: "Du bist bereits dabei! 💪",
    text: "Diese E-Mail-Adresse ist schon bestätigt. Du bekommst unseren Newsletter wie gewohnt.",
  },
  expired: {
    title: "Link abgelaufen",
    text: "Dieser Bestätigungslink ist nicht mehr gültig. Melde dich einfach erneut für den Newsletter an.",
  },
  invalid: {
    title: "Link ungültig",
    text: "Wir konnten diesen Bestätigungslink nicht zuordnen. Bitte melde dich erneut an.",
  },
  error: {
    title: "Etwas ist schiefgelaufen",
    text: "Bitte versuche es später noch einmal oder melde dich erneut an.",
  },
};

const NewsletterConfirmed = () => {
  const [params] = useSearchParams();
  const status = params.get("status") ?? "ok";
  const message = MESSAGES[status] ?? MESSAGES.error;

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4 py-20">
      <div className="w-full max-w-md rounded-3xl border-2 border-foreground/10 bg-card p-8 text-center shadow-2xl">
        <h1 className="mb-3 text-2xl font-extrabold">{message.title}</h1>
        <p className="mb-6 text-sm leading-relaxed text-muted-foreground">{message.text}</p>
        <Link
          to="/"
          className="comic-btn inline-block bg-primary px-8 py-3 text-sm font-black text-primary-foreground"
        >
          ZURÜCK ZUM SHOP
        </Link>
      </div>
    </main>
  );
};

export default NewsletterConfirmed;
