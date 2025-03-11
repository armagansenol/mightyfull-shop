const url = 'https://a.klaviyo.com/api/back-in-stock-subscriptions';
const options = {
  method: 'POST',
  headers: {
    accept: 'application/vnd.api+json',
    revision: '2025-01-15',
    'content-type': 'application/vnd.api+json',
    Authorization: 'Klaviyo-API-Key your-private-api-key'
  },
  body: '{"data":{"type":"back-in-stock-subscription","attributes":{"profile":{"data":{"type":"profile"}}},"relationships":{"variant":{"data":{"type":"catalog-variant"}}}}}'
};

fetch(url, options)
  .then((res) => res.json())
  .then((json) => console.log(json))
  .catch((err) => console.error(err));
