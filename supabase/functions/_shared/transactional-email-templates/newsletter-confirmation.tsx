/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  confirmUrl?: string
  recipientEmail?: string
}

const FOQUZ_PINK = '#e83e63'
const FOQUZ_YELLOW = '#ffc61a'
const FOQUZ_BLUE = '#cdeaf9'
const INK = '#000000'
const MUTED = '#4d4d4d'

const NewsletterConfirmation = ({
  confirmUrl = 'https://foquz.de',
  recipientEmail = 'du@example.com',
}: Props) => (
  <Html lang="de" dir="ltr">
    <Head />
    <Preview>Nur noch ein Klick — bestätige deine Anmeldung bei FOQUZ.</Preview>
    <Body style={main}>
      <Container style={outer}>
        <Section style={brandBar}>
          <Text style={brandText}>FOQUZ</Text>
        </Section>

        <Container style={card}>
          <Heading style={h1}>
            Willkommen bei <span style={{ color: FOQUZ_PINK }}>FOQUZ</span>!
          </Heading>

          <Text style={lead}>
            Bitte bestätige kurz, dass diese E-Mail wirklich dir gehört —
            damit wir dir keine Newsletter schicken, die du nicht willst.
          </Text>

          <Section style={ctaWrap}>
            <Button href={confirmUrl} style={cta}>
              E-MAIL BESTÄTIGEN
            </Button>
          </Section>

          <Text style={fallback}>
            Klick funktioniert nicht? Kopiere diesen Link in deinen Browser:
          </Text>
          <Text style={linkText}>{confirmUrl}</Text>

          <Hr style={divider} />

          <Text style={smallPrint}>
            Diese Anmeldung wurde für <b>{recipientEmail}</b> angefordert.
            Falls du das nicht warst, ignoriere diese Mail einfach — ohne
            Bestätigung wird nichts abonniert.
          </Text>
        </Container>

        <Text style={footer}>
          Kleine Dose, große Wirkung. Stay FOQUZD.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: NewsletterConfirmation,
  subject: 'Bestätige deine Newsletter-Anmeldung bei FOQUZ',
  displayName: 'Newsletter Double Opt-in',
  previewData: {
    confirmUrl: 'https://foquz.de/newsletter/bestaetigen?token=preview',
    recipientEmail: 'du@example.com',
  },
} satisfies TemplateEntry

const main: React.CSSProperties = {
  backgroundColor: '#ffffff',
  fontFamily:
    "Barlow, 'Helvetica Neue', Helvetica, Arial, sans-serif",
  margin: 0,
  padding: '24px 0',
}

const outer: React.CSSProperties = {
  maxWidth: '560px',
  margin: '0 auto',
  padding: '0 16px',
}

const brandBar: React.CSSProperties = {
  backgroundColor: FOQUZ_YELLOW,
  border: `3px solid ${INK}`,
  borderRadius: '16px',
  padding: '14px 20px',
  textAlign: 'center' as const,
  marginBottom: '18px',
}

const brandText: React.CSSProperties = {
  fontSize: '28px',
  fontWeight: 900,
  letterSpacing: '4px',
  color: INK,
  margin: 0,
  textTransform: 'uppercase' as const,
}

const card: React.CSSProperties = {
  backgroundColor: FOQUZ_BLUE,
  border: `3px solid ${INK}`,
  borderRadius: '20px',
  padding: '32px 28px',
  boxShadow: `6px 6px 0 ${INK}`,
}

const h1: React.CSSProperties = {
  color: INK,
  fontSize: '30px',
  lineHeight: 1.15,
  fontWeight: 900,
  margin: '0 0 14px',
  textTransform: 'uppercase' as const,
}

const lead: React.CSSProperties = {
  color: INK,
  fontSize: '16px',
  lineHeight: 1.5,
  margin: '0 0 24px',
}

const ctaWrap: React.CSSProperties = {
  textAlign: 'center' as const,
  margin: '8px 0 22px',
}

const cta: React.CSSProperties = {
  backgroundColor: FOQUZ_PINK,
  color: '#ffffff',
  border: `3px solid ${INK}`,
  borderRadius: '999px',
  padding: '14px 28px',
  fontSize: '16px',
  fontWeight: 900,
  letterSpacing: '1px',
  textDecoration: 'none',
  textTransform: 'uppercase' as const,
  display: 'inline-block',
  boxShadow: `4px 4px 0 ${INK}`,
}

const fallback: React.CSSProperties = {
  color: MUTED,
  fontSize: '13px',
  margin: '18px 0 4px',
}

const linkText: React.CSSProperties = {
  color: INK,
  fontSize: '13px',
  wordBreak: 'break-all' as const,
  margin: 0,
}

const divider: React.CSSProperties = {
  borderColor: INK,
  borderWidth: '1px',
  margin: '22px 0 14px',
}

const smallPrint: React.CSSProperties = {
  color: MUTED,
  fontSize: '12px',
  lineHeight: 1.5,
  margin: 0,
}

const footer: React.CSSProperties = {
  color: INK,
  fontSize: '13px',
  fontWeight: 700,
  textAlign: 'center' as const,
  margin: '22px 0 0',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
}
