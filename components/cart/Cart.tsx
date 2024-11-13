"use client"

import s from "./cart.module.scss"

import { useQuery } from "@tanstack/react-query"
import cn from "clsx"
import { X } from "lucide-react"
import { useEffect } from "react"

import { fetchCartProducts } from "@/app/actions/cartProducts"
import { CartItem } from "@/components/cart-item"
import { Button } from "@/components/ui/button"
import { ScrollableBox } from "@/components/utility/scrollable-box"
import { useCartStore } from "@/lib/store/cart"
import { useLenisStore } from "@/lib/store/lenis"
import { CartProductNode } from "@/types"

export default function Cart() {
  const { items, isOpen, setIsOpen } = useCartStore()
  const { setIsStopped } = useLenisStore()

  const productIds = items.map((item) => item.id)

  useEffect(() => {
    return setIsStopped(isOpen)
  }, [isOpen, setIsStopped])

  const { data, isLoading, error } = useQuery<{ nodes: CartProductNode[] }>({
    queryKey: ["cart-products", productIds],
    queryFn: () => fetchCartProducts(productIds).then((res) => res.data),
    enabled: productIds.length > 0,
  })

  console.log("data", data?.nodes, error)

  // if (isLoading) return <div>Loading...</div>
  // if (error) return <div>Error: {(error as Error).message}</div>
  // console.log("cart products", products, isLoading, error)
  // const subtotal = items.reduce((total, item) => total + item. * item.quantity, 0)

  return (
    <div className={cn(s.cart, { [s.open]: isOpen && productIds.length > 0 }, "flex flex-col")} data-lenis-prevent>
      <div className="flex items-center justify-between py-5 mb-5 border-b-[1px] border-solid border-slate-50">
        <div className={s.title}>Your Cart</div>
        <Button size="icon" className="rounded-full" onClick={() => setIsOpen(false)}>
          <X className="h-6 w-6" />
        </Button>
      </div>
      <div className="flex h-[700px] flex-col gap-8 mt-auto">
        <ScrollableBox className="flex-1">
          <div className="flex flex-col gap-8">
            <>
              {isLoading ? (
                <>LOADING</>
              ) : (
                <>
                  {data?.nodes.map((item) => (
                    <div key={item.id}>
                      <CartItem
                        id={item.id}
                        title={item.title}
                        featuredImage={item.featuredImage}
                        variants={item.variants}
                      />
                    </div>
                  ))}
                </>
              )}
            </>
          </div>
        </ScrollableBox>
        <div className="mt-auto space-y-4">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            CHECKOUT
            {/* ({subtotal.toFixed(2)} */}
          </Button>
          <button onClick={() => setIsOpen(false)} className="w-full text-center text-blue-600 hover:underline">
            Continue Shopping
          </button>
          <p className="text-center text-sm text-muted-foreground">
            Shipping, taxes and discounts calculated at checkout.
          </p>
        </div>
      </div>
    </div>
  )
}
