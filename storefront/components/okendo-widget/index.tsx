'use client';

import { useEffect, useRef } from 'react';

export interface OkendoWidgetProps {
  productId: string;
}

const SHOW_MORE_SELECTORS = [
  'button[class*="show-more"]',
  'button[class*="load-more"]',
  'button[class*="loadMore"]',
  'button[class*="showMore"]',
  'button[class*="paginate"]',
  'button[class*="Paginate"]',
  '.oke-w-loadMore',
  '.oke-w-paginate-button',
  '.oke-button',
  '[class*="show-more-button"] button',
  '[part*="load-more"]',
  '[part*="show-more"]'
];

function resolveThemeColors(): {
  primary: string;
  hover: string;
  inverse: string;
  fontDisplay: string;
} {
  if (typeof window === 'undefined') {
    return {
      primary: 'rgb(0, 119, 224)',
      hover: 'rgb(152, 225, 255)',
      inverse: '#fff',
      fontDisplay: 'sans-serif'
    };
  }
  const cs = getComputedStyle(document.body);
  const primary =
    cs.getPropertyValue('--primary').trim() ||
    cs.getPropertyValue('--color-primary').trim() ||
    cs.getPropertyValue('--blue-ruin').trim() ||
    cs.getPropertyValue('--color-blue-ruin').trim() ||
    'rgb(0, 119, 224)';
  const hover =
    cs.getPropertyValue('--tertiary').trim() ||
    cs.getPropertyValue('--color-tertiary').trim() ||
    cs.getPropertyValue('--columbia-blue').trim() ||
    cs.getPropertyValue('--color-columbia-blue').trim() ||
    'rgb(152, 225, 255)';
  const inverse =
    cs.getPropertyValue('--sugar-milk').trim() ||
    cs.getPropertyValue('--color-sugar-milk').trim() ||
    '#fff';
  const fontDisplay =
    cs.getPropertyValue('--font-bomstad-display').trim() || 'sans-serif';
  return { primary, hover, inverse, fontDisplay };
}

function buildOkendoThemeCss() {
  const { primary, hover, inverse, fontDisplay } = resolveThemeColors();
  const baseSelector = SHOW_MORE_SELECTORS.join(',\n  ');
  const hoverSelector = SHOW_MORE_SELECTORS.map((s) => `${s}:hover`).join(
    ',\n  '
  );
  return `
  ${baseSelector} {
    background-color: ${primary} !important;
    color: ${inverse} !important;
    font-family: ${fontDisplay} !important;
    font-weight: 900 !important;
    font-size: 18px !important;
    border: 1px solid ${primary} !important;
    outline: none !important;
    border-radius: 8px !important;
    padding: 12px 32px !important;
    cursor: pointer !important;
    transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out !important;
  }
  ${hoverSelector} {
    background-color: ${hover} !important;
    color: ${primary} !important;
    border-color: ${primary} !important;
  }
`;
}

function injectShadowStyles(root: Element) {
  const shadowRoot = root.shadowRoot;
  if (!shadowRoot) return;

  const css = buildOkendoThemeCss();
  const existing = shadowRoot.querySelector(
    '#mightyfull-theme'
  ) as HTMLStyleElement | null;
  if (existing) {
    if (existing.textContent !== css) existing.textContent = css;
  } else {
    const style = document.createElement('style');
    style.id = 'mightyfull-theme';
    style.textContent = css;
    shadowRoot.prepend(style);
  }

  // Also recurse into nested shadow roots
  shadowRoot.querySelectorAll('*').forEach((el) => {
    if (el.shadowRoot) injectShadowStyles(el);
  });
}

function injectAllUnderContainer(container: Element) {
  container.querySelectorAll('*').forEach((el) => {
    if (el.shadowRoot) injectShadowStyles(el);
  });
}

function observeAndInject(container: Element) {
  injectAllUnderContainer(container);

  // Watch for new shadow roots as the widget renders
  const widgetObserver = new MutationObserver(() => {
    injectAllUnderContainer(container);
  });
  widgetObserver.observe(container, { childList: true, subtree: true });

  // Re-inject when the theme variables change on body (color theme switches)
  const themeObserver = new MutationObserver(() => {
    injectAllUnderContainer(container);
  });
  themeObserver.observe(document.body, {
    attributes: true,
    attributeFilter: ['style']
  });

  return () => {
    widgetObserver.disconnect();
    themeObserver.disconnect();
  };
}

export function OkendoWidget(props: OkendoWidgetProps) {
  return (
    <div>
      <div className="okendo-widget-container">
        <OkendoReviewsWidget productId={props.productId}></OkendoReviewsWidget>
      </div>
    </div>
  );
}

const OkendoReviewsWidget = ({ productId }: { productId: string }) => {
  const widgetContainer = useRef<HTMLDivElement>(null);

  const initialiseWidget = () =>
    // @ts-expect-error: okendo widget api
    window.okeWidgetApi.initWidget(widgetContainer.current);

  useEffect(() => {
    const container = widgetContainer.current;
    if (!container) return;

    let cleanup: (() => void) | null = null;

    const init = () => {
      initialiseWidget();
      cleanup = observeAndInject(container);
    };

    // @ts-expect-error: okendo widget api
    if (window.okeWidgetApi?.initWidget) {
      init();
    } else {
      document.addEventListener('oke-script-loaded', init);
    }

    return () => {
      document.removeEventListener('oke-script-loaded', init);
      cleanup?.();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={widgetContainer}
      data-oke-widget
      data-oke-reviews-product-id={`shopify-${productId}`}
    ></div>
  );
};
