"use client"

import { useQuery } from "@tanstack/react-query"
import cn from "clsx"
import { X } from "lucide-react"
import { useEffect } from "react"

import { fetchCartProducts } from "@/app/actions/cartProducts"
import { createCart } from "@/app/actions/createCart"
import { CartItem as CartItemC } from "@/components/cart-item"
import { Button } from "@/components/ui/button"
import { Link } from "@/components/utility/link"
import { ScrollableBox } from "@/components/utility/scrollable-box"
import { useCartStore } from "@/lib/store/cart"
import { useLenisStore } from "@/lib/store/lenis"
import { CartItemData, CartProductNode } from "@/types"

import s from "./cart.module.scss"
import { CartItem } from "@/lib/shopify/types"

export default function Cart() {
  const { items, isOpen, setIsOpen } = useCartStore()
  const { setIsStopped } = useLenisStore()

  const productIds = items.map((item) => item.id)

  useEffect(() => {
    setIsStopped(isOpen)
    return () => setIsStopped(false)
  }, [isOpen, setIsStopped])

  const { data: cartProductsData, error: cartProductsError } = useQuery<{ nodes: CartProductNode[] }>({
    queryKey: ["cart-products", productIds],
    queryFn: () => fetchCartProducts(productIds).then((res) => res.data),
    enabled: productIds.length > 0,
  })

  const cartLines = cartProductsData?.nodes.map((product) => ({
    merchandiseId: product.variants.nodes[0].id,
    quantity: items.find((item) => item.id === product.id)?.quantity || 0,
    sellingPlanId: items.find((item) => item.id === product.id)?.sellingPlanId || 0,
  }))

  const { data: cartCreateData, isLoading: isCartCreateLoading } = useQuery({
    queryKey: ["cart-create", cartLines],
    queryFn: () => createCart(cartLines as { merchandiseId: string; quantity: number; sellingPlanId: string }[]),
    enabled: !!cartLines && cartLines.length > 0,
  })

  const cartOpen = isOpen && cartLines && cartLines.length > 0
  const checkoutUrl = cartCreateData?.cartCreate.cart.checkoutUrl

  if (cartProductsError) {
    console.error("Error fetching cart products:", cartProductsError)
  }

  // useEffect(() => {
  //   function openCart() {
  //     if (!isCartCreateSucceded && isOpen) return
  //     return setIsOpen(true)
  //   }

  //   openCart()
  // }, [isCartCreateSucceded])

  return (
    <>
      <div className={cn(s.backdrop, { [s.open]: cartOpen })} onClick={() => setIsOpen(false)} />
      <div className={cn(s.cart, { [s.open]: cartOpen }, "flex flex-col flex-1")} data-lenis-prevent>
        <div className="flex items-center justify-between py-5 mb-5 border-b border-slate-50">
          <h2 className={s.title}>Your Cart</h2>
          <Button size="icon" className="rounded-full" onClick={() => setIsOpen(false)}>
            <X className="h-6 w-6" />
            <span className="sr-only">Close cart</span>
          </Button>
        </div>
        <div
          className={cn(s.cartItems, "flex flex-1 flex-col gap-8 mt-auto", {
            [s.disabled]: isCartCreateLoading,
          })}
        >
          <ScrollableBox className="flex-1">
            <div className="flex flex-col gap-8">
              {cartProductsData?.nodes.map((item) => (
                <CartItemC
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  featuredImage={item.featuredImage}
                  variants={item.variants}
                  handle={item.handle}
                />
              ))}
            </div>
          </ScrollableBox>
          <div className="mt-auto space-y-4">
            <Button className="text-2xl" variant="ghost" size="slim" disabled={!checkoutUrl}>
              <Link
                href={checkoutUrl ?? "/"}
              >{`CHECKOUT (${cartCreateData?.cartCreate.cart.cost.totalAmount.amount})`}</Link>
            </Button>
            <Button className="text-[var(--blue-ruin)]" variant="naked" size="slim" onClick={() => setIsOpen(false)}>
              Continue Shopping
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Shipping, taxes and discounts calculated at checkout.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
