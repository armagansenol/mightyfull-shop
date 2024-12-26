export type SortFilterItem = {
  title: string;
  slug: string | null;
  sortKey: 'RELEVANCE' | 'BEST_SELLING' | 'CREATED_AT' | 'PRICE';
  reverse: boolean;
};

export const defaultSort: SortFilterItem = {
  title: 'Relevance',
  slug: null,
  sortKey: 'RELEVANCE',
  reverse: false
};

export const sorting: SortFilterItem[] = [
  defaultSort,
  {
    title: 'Trending',
    slug: 'trending-desc',
    sortKey: 'BEST_SELLING',
    reverse: false
  }, // asc
  {
    title: 'Latest arrivals',
    slug: 'latest-desc',
    sortKey: 'CREATED_AT',
    reverse: true
  },
  {
    title: 'Price: Low to high',
    slug: 'price-asc',
    sortKey: 'PRICE',
    reverse: false
  }, // asc
  {
    title: 'Price: High to low',
    slug: 'price-desc',
    sortKey: 'PRICE',
    reverse: true
  }
];

export const TAGS = {
  collections: 'collections',
  products: 'products',
  cart: 'cart'
};

export const HIDDEN_PRODUCT_TAG = 'nextjs-frontend-hidden';
export const DEFAULT_OPTION = 'Default Title';
export const SHOPIFY_GRAPHQL_API_VERSION = '2024-10';

export const SHOPIFY_GRAPHQL_API_ENDPOINT = '/api/2024-10/graphql.json';

export const breakpoints = {
  mobile: 800,
  tablet: 1024
};

export const baseUrl = 'mightyfull.com';

export const routes = {
  home: {
    ariaLabel: 'Homepage',
    name: 'home',
    url: '',
    ui: 'Home',
    seo: {
      title: 'MIGHTYFULL',
      description: 'This might be the best cookie ever!'
    }
  },
  ourStory: {
    ariaLabel: 'Our Story',
    name: 'our-story',
    url: 'our-story',
    ui: 'Our Story',
    seo: {
      title: 'Our Story | MIGHTYFULL',
      description: 'This might be the best cookie ever!'
    }
  },
  shop: {
    ariaLabel: 'Shop',
    name: 'shop',
    url: 'shop',
    ui: 'Shop',
    seo: {
      title: 'Shop | MIGHTYFULL',
      description: 'This might be the best cookie ever!'
    }
  },
  notFound: {
    ariaLabel: 'Not Found',
    name: 'not-found',
    url: 'not-found',
    ui: 'Not found',
    seo: {
      title: '404 Not Found',
      description: "We couldn't find the page you were looking for."
    }
  }
};
