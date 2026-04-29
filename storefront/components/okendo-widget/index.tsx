'use client';

import { useEffect, useRef } from 'react';

export interface OkendoWidgetProps {
  productId: string;
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
  const widgetContainer = useRef(null);

  const initialiseWidget = () =>
    // @ts-expect-error: okendo widget api
    window.okeWidgetApi.initWidget(widgetContainer.current);

  useEffect(() => {
    // @ts-expect-error: okendo widget api
    if (window.okeWidgetApi?.initWidget) {
      initialiseWidget();
    } else {
      document.addEventListener('oke-script-loaded', initialiseWidget);
    }

    return () => {
      document.removeEventListener('oke-script-loaded', initialiseWidget);
    };
  }, [initialiseWidget]);

  return (
    <div
      ref={widgetContainer}
      data-oke-widget
      data-oke-reviews-product-id={`shopify-${productId}`}
    ></div>
  );
};
