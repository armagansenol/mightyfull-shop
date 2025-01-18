import { getShop } from '@/lib/shopify';

export default async function PrivacyPolicy() {
  const shop = await getShop();
  return (
    <div className="max-w-2xl mx-auto py-24 pb-48 px-4 sm:px-6 lg:px-8 font-poppins">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">
        {shop.privacyPolicy.title}
      </h1>
      <div
        className="prose prose-sm sm:prose lg:prose-md mx-auto"
        dangerouslySetInnerHTML={{ __html: shop.privacyPolicy.body }}
      />
    </div>
  );
}
