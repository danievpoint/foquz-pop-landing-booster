/**
 * Klaviyo "Added to Cart" – pro erfolgreicher Aktion genau ein Event, gebunden an den
 * Warenkorb-Schlüssel, den genau diese Aktion erzeugt hat. Gesendet wird erst, wenn Shopify
 * GENAU diesen Schlüssel bestätigt hat. Ohne Marketing-Einwilligung zum Aktionszeitpunkt
 * wird nichts gesammelt; Widerruf verwirft alles endgültig.
 */
export interface TrackerConfirmation { value: number; checkoutUrl: string }
export interface PendingAction<A, S> { actionId: number; added: A; key: string | null; snapshot: S | null }
export interface ReadyEvent<A, S> { actionId: number; added: A; snapshot: S; confirmed: TrackerConfirmation }

export class AddToCartTracker<A, S> {
  private nextId = 1;
  private pending: PendingAction<A, S>[] = [];
  private confirmed = new Map<string, TrackerConfirmation>();

  /** Nur mit Einwilligung zum Aktionszeitpunkt; sonst kein Eintrag (kein Nachsenden). */
  enqueue(added: A, marketingConsent: boolean): number | null {
    if (!marketingConsent) return null;
    const actionId = this.nextId++;
    this.pending.push({ actionId, added, key: null, snapshot: null });
    return actionId;
  }

  /** Erster Render nach der Aktion: Aktion an den daraus entstandenen Warenkorb binden. */
  bind(key: string, snapshot: S, trackable: boolean) {
    for (const p of this.pending) if (p.key === null) { p.key = key; p.snapshot = snapshot; }
    if (!trackable) this.pending = this.pending.filter((p) => p.key !== key);
  }

  /** Shopify hat genau diesen Schlüssel bestätigt (auch wenn er inzwischen veraltet ist). */
  confirm(key: string, confirmation: TrackerConfirmation, marketingConsent: boolean): ReadyEvent<A, S>[] {
    if (!marketingConsent) { this.clear(); return []; }
    this.confirmed.set(key, confirmation);
    const ready = this.pending.filter((p) => p.key === key && p.snapshot !== null);
    this.pending = this.pending.filter((p) => p.key !== key);
    if (this.confirmed.size > 20) this.confirmed.delete(this.confirmed.keys().next().value as string);
    return ready.map((p) => ({ actionId: p.actionId, added: p.added, snapshot: p.snapshot as S, confirmed: confirmation }));
  }

  /** Fehlgeschlagene/abweichende Bestätigung: nur Aktionen genau dieses Schlüssels verwerfen. */
  fail(key: string) { this.pending = this.pending.filter((p) => p.key !== key); }

  /** Widerruf der Marketing-Einwilligung. */
  clear() { this.pending = []; this.confirmed.clear(); }

  get size() { return this.pending.length; }
}
