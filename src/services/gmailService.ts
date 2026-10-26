import { getAccessToken } from './googleAuth';

export interface GmailMessageSummary {
  id: string;
  threadId: string;
  subject: string;
  from: string;
  to: string;
  date: string;
  snippet: string;
  isUnread: boolean;
}

export interface GmailUserProfile {
  emailAddress: string;
  messagesTotal: number;
  threadsTotal: number;
  historyId: string;
}

// Convert a UTF-8 string to base64url format required by Gmail API
function toBase64Url(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export async function fetchGmailProfile(): Promise<GmailUserProfile> {
  const token = await getAccessToken();
  if (!token) throw new Error('Authentification requise pour accéder à Gmail.');

  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Erreur profil Gmail (${res.status}): ${errorText}`);
  }

  return res.json();
}

export async function listGmailMessages(query = '', maxResults = 15): Promise<GmailMessageSummary[]> {
  const token = await getAccessToken();
  if (!token) throw new Error('Authentification requise pour accéder à Gmail.');

  const params = new URLSearchParams({
    maxResults: String(maxResults),
  });
  if (query) params.append('q', query);

  const res = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Erreur récupération messages Gmail (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  const messagesList = data.messages || [];

  // Fetch summaries in parallel
  const summaries: GmailMessageSummary[] = await Promise.all(
    messagesList.map(async (msg: { id: string; threadId: string }) => {
      try {
        const detailRes = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=To&metadataHeaders=Date`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!detailRes.ok) {
          return {
            id: msg.id,
            threadId: msg.threadId,
            subject: 'Sans objet',
            from: 'Inconnu',
            to: '',
            date: '',
            snippet: '',
            isUnread: false,
          };
        }
        const details = await detailRes.json();
        const headers: { name: string; value: string }[] = details.payload?.headers || [];
        const subject = headers.find((h) => h.name.toLowerCase() === 'subject')?.value || '(Sans objet)';
        const from = headers.find((h) => h.name.toLowerCase() === 'from')?.value || '';
        const to = headers.find((h) => h.name.toLowerCase() === 'to')?.value || '';
        const date = headers.find((h) => h.name.toLowerCase() === 'date')?.value || '';
        const isUnread = (details.labelIds || []).includes('UNREAD');

        return {
          id: msg.id,
          threadId: msg.threadId,
          subject,
          from,
          to,
          date,
          snippet: details.snippet || '',
          isUnread,
        };
      } catch (err) {
        return {
          id: msg.id,
          threadId: msg.threadId,
          subject: '(Erreur chargement)',
          from: '',
          to: '',
          date: '',
          snippet: '',
          isUnread: false,
        };
      }
    })
  );

  return summaries;
}

export async function sendGmailEmail(to: string, subject: string, bodyText: string): Promise<any> {
  const token = await getAccessToken();
  if (!token) throw new Error('Authentification requise pour envoyer un e-mail.');

  // Compose MIME RFC 2822 email format
  const rawEmail = [
    `To: ${to}`,
    `Subject: =?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`,
    'Content-Type: text/plain; charset=utf-8',
    'MIME-Version: 1.0',
    '',
    bodyText,
  ].join('\r\n');

  const base64UrlMessage = toBase64Url(rawEmail);

  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      raw: base64UrlMessage,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Échec de l'envoi de l'e-mail (${res.status}): ${errorText}`);
  }

  return res.json();
}
