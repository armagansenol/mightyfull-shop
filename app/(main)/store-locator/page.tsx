import { sanityFetch } from '@/lib/sanity/client';
import { STORE_QUERY } from '@/lib/sanity/store';
import { Store } from '@/types';

export default async function StoreLocator() {
  const stores = await sanityFetch<Store[]>({
    query: STORE_QUERY,
    tags: ['store']
  });

  console.log('stores', stores);

  return (
    <div>
      <h1>STORE LOCATOR</h1>
      <div>
        {stores.map((store) => (
          <div key={store._id}>
            <h2>{store.title}</h2>
            <p>{store.address}</p>
            <p>{store.city}</p>
            <p>{store.country}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
