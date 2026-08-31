import * as React from 'npm:react@18.3.1'
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  confirmUrl?: string
}

const Email = ({ confirmUrl = 'https://www.foquz.de' }: Props) => (
  <Html lang="de" dir="ltr">
    <Head />
    <Preview>Bitte bestätige deine Newsletter-Anmeldung bei FOQUZ</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={heading}>Nur noch ein Klick!</Heading>
        <Text style={text}>
          Danke für deine Anmeldung zum FOQUZ Newsletter. Bitte bestätige kurz deine
          E-Mail-Adresse — danach bist du beim Gewinnspiel um <strong>250 €</strong> dabei
          und bekommst deinen <strong>10 % Rabattcode</strong> zugeschickt.
        </Text>
        <Section style={{ textAlign: 'center', margin: '32px 0' }}>
          <Button href={confirmUrl} style={button}>
            ANMELDUNG BESTÄTIGEN
          </Button>
        </Section>
        <Text style={small}>
          Falls der Button nicht funktioniert, kopiere diesen Link in deinen Browser:
          <br />
          <Link href={confirmUrl} style={link}>
            {confirmUrl}
          </Link>
        </Text>
        <Hr style={hr} />
        <Text style={small}>
          Du hast dich nicht angemeldet? Dann ignoriere diese E-Mail einfach — ohne
          Bestätigung wird deine Adresse nicht in den Verteiler aufgenommen.
        </Text>
        <Text style={small}>Kleine Dose, große Wirkung. Stay FOQUZD.</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: 'Bitte bestätige deine Newsletter-Anmeldung',
  displayName: 'Newsletter Double-Opt-in',
  previewData: { confirmUrl: 'https://www.foquz.de/newsletter-bestaetigt?token=demo' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, Helvetica, sans-serif' }
const container = { padding: '32px 28px', maxWidth: '560px' }
const heading = { fontSize: '26px', fontWeight: '800' as const, color: '#111111', margin: '0 0 16px' }
const text = { fontSize: '16px', lineHeight: '26px', color: '#222222' }
const small = { fontSize: '12px', lineHeight: '20px', color: '#666666' }
const link = { color: '#f07e26', wordBreak: 'break-all' as const }
const hr = { borderColor: '#eeeeee', margin: '28px 0' }
const button = {
  backgroundColor: '#e63757',
  color: '#ffffff',
  fontWeight: '800' as const,
  fontSize: '15px',
  padding: '14px 28px',
  borderRadius: '999px',
  textDecoration: 'none',
}
