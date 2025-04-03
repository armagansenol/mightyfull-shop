export const TAGS = {
  products: 'products',
  cart: 'cart'
};

export enum CartOperationType {
  ADD = 'add',
  REMOVE = 'remove',
  UPDATE = 'update'
}

export const HIDDEN_PRODUCT_TAG = 'nextjs-frontend-hidden';
export const DEFAULT_OPTION = 'Default Title';
export const SHOPIFY_GRAPHQL_API_VERSION = '2024-10';
export const SHOPIFY_GRAPHQL_API_ENDPOINT = '/api/2024-10/graphql.json';

export const breakpoints = {
  mobile: 800,
  tablet: 1024
};

export const defaultColorTheme = {
  primary: 'var(--blue-ruin)',
  secondary: 'var(--cerulean)',
  tertiary: 'var(--columbia-blue)'
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
