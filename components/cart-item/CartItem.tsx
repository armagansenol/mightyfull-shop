"use client"

import s from "./cart-item.module.scss"

import { Img } from "@/components/utility/img"
import { useCartStore } from "@/lib/store/cart"
import { CartProductNode } from "@/types"
import { useEffect, useState } from "react"
import { AddToCart } from "../add-to-cart"

export default function CartItem({ id, title, featuredImage, variants }: CartProductNode) {
  const { items, removeItem, updateQuantity } = useCartStore()
  const q = items.find((item) => item.id === id)?.quantity as number
  const [quantity, setQuantity] = useState(q)

  useEffect(() => {
    updateQuantity(id, quantity)
  }, [id, quantity, updateQuantity])

  return (
    <div className={s.cartItem}>
      <div className="flex items-start gap-4">
        <div className={s.imgC}>
          <Img
            src={featuredImage.url}
            alt={featuredImage.altText as string}
            className="object-cover"
            height={featuredImage.height as number}
            width={featuredImage.width as number}
          />
        </div>

        <div className="flex-1">
          <h3 className={s.title}>{title}</h3>
          <div className="flex items-center justify-between">
            <AddToCart quantity={q} setQuantity={setQuantity} />
            <div className={s.price}>
              {variants.nodes[0].price.amount} {variants.nodes[0].price.currencyCode}
            </div>
          </div>
          <button className={s.remove} onClick={() => removeItem(id)}>
            Remove
          </button>
        </div>
      </div>
    </div>
  )
}
