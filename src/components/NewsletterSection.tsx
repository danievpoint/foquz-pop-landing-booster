import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || loading) return;

    setLoading(true);
    try {
      // Save to Supabase
      const { error: dbError } = await supabase
        .from("newsletter_subscribers")
        .insert({ email: email.trim().toLowerCase() });

      if (dbError && dbError.code !== "23505") {
        throw dbError;
      }

      // Send to Shopify
      const { error: fnError } = await supabase.functions.invoke("shopify-newsletter", {
        body: { email: email.trim().toLowerCase() },
      });

      if (fnError) {
        console.error("Shopify newsletter error:", fnError);
      }

      if (dbError?.code === "23505") {
        toast({ title: "Du bist bereits dabei! 💪", description: "Diese E-Mail ist schon angemeldet." });
      } else {
        toast({ title: "Willkommen im Squad! 🎉", description: "Du erhältst deinen 10%-Code per E-Mail." });
      }
      setEmail("");
    } catch {
      toast({ title: "Fehler", description: "Bitte versuche es später erneut.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-primary py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-5xl font-black text-primary-foreground mb-3 tracking-tight">
          JOIN THE SQUAD
        </h2>
        <p className="text-lg md:text-xl text-primary-foreground/80 mb-8">
          Hol dir 10% Rabatt auf deinen nächsten Drop
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Deine E-Mail-Adresse"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 bg-primary-foreground text-foreground border-none rounded-full px-5 text-base"
            required
          />
          <Button
            type="submit"
            disabled={loading}
            className="h-12 rounded-full px-8 font-extrabold text-base bg-secondary text-secondary-foreground hover:bg-secondary/90 comic-outline"
          >
            {loading ? "..." : "JETZT JOINEN"}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default NewsletterSection;
