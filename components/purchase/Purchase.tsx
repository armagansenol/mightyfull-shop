"use client"

import s from "./purchase.module.scss"

import cn from "clsx"
import { useState } from "react"

import { QuantityProvider } from "@/lib/context/quantity"
import { useCartStore } from "@/lib/store/cart"
import { ProductVariant } from "@shopify/hydrogen-react/storefront-api-types"
import { AddToCart } from "../add-to-cart"
import { Button } from "../ui/button"
import { Label } from "../ui/label"

// type PurchaseType = "one-time" | "subscribe"

interface PurchaseOptionsProps {
  productId: string
  price: ProductVariant["price"]
}

export default function PurchaseOptions(props: PurchaseOptionsProps) {
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCartStore()

  console.log("price", props.price)

  return (
    <QuantityProvider>
      <div className={s.purchaseOptions}>
        <Label className={s.title}>PURCHASE OPTIONS</Label>
        <div className={cn(s.purchase, "rounded-lg")}>
          <div className="space-y-6">
            {/* <div className={s.border}>
            <RadioGroup
              className="space-y-10"
              value={purchaseType}
              onValueChange={(value: "one-time" | "subscribe") => setPurchaseType(value)}
            >
              <div className="space-y-6">
                <div className={cn(s.purchaseOption, "flex items-center space-x-2")}>
                  <RadioGroupItem className={s.checkbox} value="one-time" id="one-time" />
                  <Label htmlFor="one-time">One-time purchase</Label>
                </div>
                <div className={cn(s.purchaseOption, "flex items-center space-x-2")}>
                  <RadioGroupItem className={s.checkbox} value="subscribe" id="subscribe" />
                  <Label htmlFor="subscribe">{props.subscriptionTitle}</Label>
                </div>
              </div>
              <div className={cn(s.subscriptionOptions, { [s.active]: purchaseType === "subscribe" })}>
                <p className="mb-2">DELIVER EVERY</p>
                <Select
                  value={deliveryInterval}
                  onValueChange={(value: "2 Weeks" | "1 Month" | "2 Months") => setDeliveryInterval(value)}
                >
                  <SelectTrigger className={s.selectTrigger}>
                    <SelectValue placeholder={"Select"} />
                  </SelectTrigger>
                  <SelectContent className="text-[var(--blue-ruin)] text-md w-full">
                    {props.subscriptionOptions.map((option, i) => {
                      return (
                        <SelectItem value={option.id} key={i}>
                          {option.name}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>
            </RadioGroup>
          </div> */}
          </div>
        </div>
        <Label className={cn(s.title)}>QUANTITY</Label>
        <div className="grid grid-cols-12 gap-4 justify-items-stretch">
          <div className="col-span-4">
            <AddToCart quantity={quantity} setQuantity={setQuantity} />
          </div>
          <div className="col-span-8">
            <Button variant="themed" size="slim" onClick={() => addItem({ id: props.productId, quantity })}>
              ADD TO CART{" "}
              {quantity > 0 && (
                <>
                  ({quantity * parseFloat(props.price.amount)} {props.price.currencyCode})
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </QuantityProvider>
  )
}
