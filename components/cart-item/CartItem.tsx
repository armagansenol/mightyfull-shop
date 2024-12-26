'use client';

import s from './cart-item.module.scss';

import { Img } from '@/components/utility/img';
import { Link } from '@/components/utility/link';
import { routes } from '@/lib/constants';
// import { useCartStore } from '@/lib/store/cart';
import { CartProductNode } from '@/types';

export default function CartItem({
  id,
  title,
  featuredImage,
  variants,
  handle
}: CartProductNode) {
  console.log(id, variants);

  // const { items, removeItem, updateQuantity } = useCartStore();
  // const q = items.find((item) => item.id === id)?.quantity as number;
  // const [quantity, setQuantity] = useState(q);

  // useEffect(() => {
  //   console.log('id', id);

  //   updateQuantity(id, quantity);
  // }, [id, quantity, updateQuantity]);

  return (
    <div className={s.cartItem}>
      <div className="flex items-start gap-4">
        <Link href={`/${routes.shop.url}/${handle}`} className={s.imgC}>
          <Img
            src={featuredImage.url}
            alt={featuredImage.altText as string}
            className="object-cover"
            height={featuredImage.height as number}
            width={featuredImage.width as number}
          />
        </Link>
        <div className="flex-1">
          <Link href={`/${routes.shop.url}/${handle}`} className={s.title}>
            {title}
          </Link>
          {/* <div className="flex items-center justify-between">
            <div className={s.quantity}>
              <Quantity quantity={q} setQuantity={setQuantity} />
            </div>
            <div className={s.price}>
              {variants.nodes[0].price.amount}{' '}
              {variants.nodes[0].price.currencyCode}
            </div>
          </div>
          <Button className={s.remove} onClick={() => removeItem(id)}>
            Remove
          </Button> */}
        </div>
      </div>
    </div>
  );
}
