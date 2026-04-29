#!/usr/bin/env node
// Run with: node --env-file=.env scripts/seed-policies.mjs

const env = process.env;
const projectId = env.SANITY_PROJECT_ID;
const dataset = env.SANITY_DATASET || 'production';
const token = env.SANITY_API_TOKEN;
const apiVersion = env.SANITY_API_VERSION || '2024-06-01';

if (!projectId || !token) {
  console.error('Missing SANITY_PROJECT_ID or SANITY_API_TOKEN in environment');
  process.exit(1);
}

const apiBase = `https://${projectId}.api.sanity.io/v${apiVersion}/data`;

async function mutate(mutations) {
  const res = await fetch(`${apiBase}/mutate/${dataset}?returnIds=true`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ mutations })
  });
  if (!res.ok) throw new Error(`Mutate failed: ${res.status} ${await res.text()}`);
  return res.json();
}

let blockCounter = 0;
function block(style, text) {
  const key = `b${++blockCounter}`;
  return {
    _type: 'block',
    _key: key,
    style,
    markDefs: [],
    children: [{ _type: 'span', _key: `${key}s`, text, marks: [] }]
  };
}
function p(text) {
  return block('normal', text);
}
function h2(text) {
  return block('h2', text);
}
function bullets(items) {
  return items.map((text) => {
    const key = `b${++blockCounter}`;
    return {
      _type: 'block',
      _key: key,
      style: 'normal',
      listItem: 'bullet',
      level: 1,
      markDefs: [],
      children: [{ _type: 'span', _key: `${key}s`, text, marks: [] }]
    };
  });
}

const today = new Date().toISOString().slice(0, 10);

const POLICIES = [
  {
    _id: 'privacyPolicy',
    title: 'Privacy Policy',
    body: [
      p(
        'This Privacy Policy explains how Mightyfull ("we", "us", "our") collects, uses, and protects information about you when you visit our website or place an order.'
      ),
      h2('Information we collect'),
      p('We collect information you give us directly, including:'),
      ...bullets([
        'Contact details such as your name, email address, phone number, and shipping address.',
        'Payment information processed by our payment partners. We do not store your full card number on our own servers.',
        'Order history and customer support correspondence.'
      ]),
      p(
        'We also collect limited technical information automatically — for example device type, browser, IP address, and pages viewed — to keep the site secure and improve performance.'
      ),
      h2('How we use your information'),
      ...bullets([
        'To process and ship your orders and communicate about them.',
        'To respond to questions and support requests.',
        'To send marketing emails or texts when you have opted in (you can unsubscribe at any time).',
        'To detect, prevent, and respond to fraud or abuse.'
      ]),
      h2('Sharing'),
      p(
        'We share information only with service providers who help us run the store (payments, shipping, analytics, email) and only to the extent needed to provide their service. We do not sell your personal information.'
      ),
      h2('Your rights'),
      p(
        'Depending on where you live, you may have the right to access, correct, or delete the personal information we hold about you, and to object to certain uses. To exercise those rights, contact us at info@mightyfull.com.'
      ),
      h2('Cookies'),
      p(
        'We use cookies and similar technologies for essential site functionality, analytics, and marketing. You can disable non-essential cookies through your browser or our cookie banner.'
      ),
      h2('Contact'),
      p(
        'Questions about this Privacy Policy? Email info@mightyfull.com and we will respond within 30 days.'
      )
    ]
  },
  {
    _id: 'refundPolicy',
    title: 'Refund Policy',
    body: [
      p(
        'We want every Mightyfull cookie to arrive perfect. If something goes wrong, we will make it right.'
      ),
      h2('Damaged or incorrect orders'),
      p(
        'If your order arrives damaged, melted beyond enjoyment, or contains the wrong items, email info@mightyfull.com within 7 days of delivery with your order number and a photo of the issue. We will send a replacement or refund the affected items.'
      ),
      h2('Change of mind'),
      p(
        'Because our cookies are perishable food products, we are unable to accept returns for change-of-mind reasons once an order has shipped.'
      ),
      h2('Cancellations'),
      p(
        'Need to cancel? Reach out as soon as you can. We can cancel orders that have not yet entered fulfillment — usually within a few hours of being placed.'
      ),
      h2('Subscriptions'),
      ...bullets([
        'You can pause, skip, or cancel your subscription at any time from your account.',
        'Subscription orders that have already been processed cannot be refunded for change of mind, but the next renewal can be cancelled before it bills.'
      ]),
      h2('Refund timing'),
      p(
        'Approved refunds are issued to your original payment method within 5–10 business days. Your bank may take additional time to display the credit.'
      ),
      h2('Contact'),
      p(
        'Email info@mightyfull.com with your order number and we will help quickly.'
      )
    ]
  },
  {
    _id: 'termsOfService',
    title: 'Terms of Service',
    body: [
      p(
        'These Terms of Service ("Terms") govern your use of the Mightyfull website and the products we sell through it. By using the site or placing an order you agree to these Terms.'
      ),
      h2('Eligibility'),
      p(
        'You must be at least 18 years old or have the consent of a parent or guardian to place an order on this site.'
      ),
      h2('Orders and payment'),
      ...bullets([
        'All orders are subject to acceptance and product availability. We may decline or cancel an order at our discretion (for example, if a pricing error has occurred).',
        'Prices are listed in U.S. dollars and exclude taxes and shipping unless stated otherwise.',
        'Payment is captured at the time you place your order via our payment partners.'
      ]),
      h2('Shipping and delivery'),
      p(
        'We currently ship to addresses inside the United States. Estimated delivery windows are provided at checkout but are not guaranteed.'
      ),
      h2('Product information'),
      p(
        'We try to display accurate ingredient lists, allergens, and product images, but small variations can occur. Always read the on-pack label before consuming, especially if you have allergies.'
      ),
      h2('Intellectual property'),
      p(
        'The Mightyfull name, logo, photography, and all site content are owned by us or our licensors. You may not copy, distribute, or create derivative works without permission.'
      ),
      h2('Limitation of liability'),
      p(
        'To the fullest extent permitted by law, our total liability for any claim relating to your use of the site or our products is limited to the amount you paid for the relevant order.'
      ),
      h2('Changes to these Terms'),
      p(
        'We may update these Terms from time to time. The "Last updated" date above reflects the most recent revision. Continued use of the site after a change means you accept the updated Terms.'
      ),
      h2('Contact'),
      p('For questions about these Terms, email info@mightyfull.com.')
    ]
  }
];

(async () => {
  const mutations = POLICIES.map((policy) => ({
    createIfNotExists: {
      _id: policy._id,
      _type: 'policy',
      title: policy.title,
      lastUpdated: today,
      body: policy.body
    }
  }));

  const result = await mutate(mutations);
  const created = result.results.filter((r) => r.operation === 'create');
  const skipped = result.results.filter((r) => r.operation !== 'create');

  for (const r of created) {
    console.log(`created  ${r.id}`);
  }
  for (const r of skipped) {
    console.log(`exists   ${r.id} (${r.operation})`);
  }
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
