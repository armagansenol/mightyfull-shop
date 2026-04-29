#!/usr/bin/env node
// Run with: node --env-file=.env scripts/seed-product-faqs.mjs

const env = process.env;
const projectId = env.SANITY_PROJECT_ID;
const dataset = env.SANITY_DATASET || 'production';
const token = env.SANITY_API_TOKEN;
const apiVersion = env.SANITY_API_VERSION || '2024-06-01';

if (!projectId || !token) {
  console.error('Missing SANITY_PROJECT_ID or SANITY_API_TOKEN in .env');
  process.exit(1);
}

const apiBase = `https://${projectId}.api.sanity.io/v${apiVersion}/data`;

async function query(groqQuery) {
  const url = `${apiBase}/query/${dataset}?query=${encodeURIComponent(groqQuery)}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error(`Query failed: ${res.status} ${await res.text()}`);
  const json = await res.json();
  return json.result;
}

async function mutate(mutations) {
  const url = `${apiBase}/mutate/${dataset}?returnIds=true`;
  const res = await fetch(url, {
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

function block(text, key) {
  return {
    _type: 'block',
    _key: `b-${key}`,
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: `s-${key}`, text, marks: [] }]
  };
}

const FAQ_SEEDS = [
  {
    _id: 'default-product-faq-shelf-life',
    categoryRef: null, // resolved below
    question: 'How long do Mightyfull cookies stay fresh?',
    answer: [
      block(
        'Each pack stays fresh for up to 8 weeks unopened. Once opened, reseal tightly and enjoy within 7 days for the best taste and texture.',
        'shelf-life'
      )
    ]
  },
  {
    _id: 'default-product-faq-allergens',
    categoryRef: null,
    question: 'Are Mightyfull cookies free from common allergens?',
    answer: [
      block(
        'Our cookies are made in a facility that handles wheat, soy, milk, eggs, peanuts and tree nuts. Always check the ingredient list on each product for the most accurate allergen information.',
        'allergens'
      )
    ]
  },
  {
    _id: 'default-product-faq-shipping',
    categoryRef: null,
    question: 'How is my order shipped?',
    answer: [
      block(
        'Orders ship within 1–2 business days via standard ground shipping. You will receive a tracking link by email as soon as your package leaves our bakery.',
        'shipping'
      )
    ]
  },
  {
    _id: 'default-product-faq-subscriptions',
    categoryRef: null,
    question: 'Can I subscribe and save?',
    answer: [
      block(
        'Yes! Choose the “Subscribe & Save” option on the product page to receive your favorite cookies on a recurring schedule. You can pause, skip or cancel anytime from your account.',
        'subscriptions'
      )
    ]
  }
];

(async () => {
  console.log('Resolving FAQ category…');
  const categories = await query('*[_type=="faqCategory"]{_id,title}');
  const general =
    categories.find((c) => /general/i.test(c.title)) || categories[0];
  if (!general) {
    console.error('No faqCategory documents exist. Create at least one in the studio first.');
    process.exit(1);
  }
  console.log(`  using category: ${general.title} (${general._id})`);

  for (const faq of FAQ_SEEDS) faq.categoryRef = general._id;

  console.log('Upserting default FAQs…');
  const faqMutations = FAQ_SEEDS.map((faq) => ({
    createOrReplace: {
      _id: faq._id,
      _type: 'faq',
      category: { _type: 'reference', _ref: faq.categoryRef },
      question: faq.question,
      answer: faq.answer
    }
  }));
  await mutate(faqMutations);
  console.log(`  ${FAQ_SEEDS.length} FAQ docs upserted.`);

  console.log('Loading products…');
  const products = await query(
    '*[_type=="product"]{_id,"title":store.title,"faqCount":count(faqs)}'
  );

  const faqRefs = FAQ_SEEDS.map((faq) => ({
    _type: 'reference',
    _key: faq._id.slice(-12),
    _ref: faq._id
  }));

  const productMutations = [];
  for (const product of products) {
    if (product.faqCount && product.faqCount > 0) {
      console.log(`  skip "${product.title}" (already has ${product.faqCount} FAQ${product.faqCount === 1 ? '' : 's'})`);
      continue;
    }
    productMutations.push({
      patch: {
        id: product._id,
        setIfMissing: { faqs: [] },
        insert: {
          replace: 'faqs[0:0]',
          items: faqRefs
        }
      }
    });
    console.log(`  attach defaults to "${product.title}"`);
  }

  if (productMutations.length === 0) {
    console.log('All products already have FAQs. Nothing to do.');
    return;
  }

  await mutate(productMutations);
  console.log(`Patched ${productMutations.length} product${productMutations.length === 1 ? '' : 's'}.`);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
