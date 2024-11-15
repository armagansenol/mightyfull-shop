"use client"

import s from "./purchase.module.scss"

import { ProductVariant, SellingPlan, SellingPlanGroup } from "@shopify/hydrogen-react/storefront-api-types"
import cn from "clsx"
import { useState } from "react"

import { Quantity } from "@/components/quantity"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCartStore } from "@/lib/store/cart"
import { DeliveryInterval, PurchaseOption } from "@/types"

interface PurchaseOptionsProps {
  gid: string
  price: ProductVariant["price"]
  sp?: SellingPlanGroup
}

export default function PurchaseOptions(props: PurchaseOptionsProps) {
  const sellingPlanOptions = props.sp?.sellingPlans.nodes.map((item) => {
    return {
      label: item.name,
      value: item.id,
    }
  })

  console.log("sp options", sellingPlanOptions)

  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCartStore()
  const [purchaseOption, setPurchaseOption] = useState<PurchaseOption>(PurchaseOption.oneTime)
  const [sellingPlanId, setSellingPlanId] = useState<string>("")

  // const subscriptionOptions = [
  //   {
  //     name: DeliveryInterval.sixMonth,
  //     id: DeliveryInterval.sixMonth,
  //   },
  //   {
  //     name: DeliveryInterval.sixMonth,
  //     id: DeliveryInterval.sixMonth,
  //   },
  // ]

  console.log("sp", props.sp)

  return (
    <div className={s.purchaseOptions}>
      <Label className={s.title}>PURCHASE OPTIONS</Label>
      <div className={cn(s.purchase, "rounded-lg mb-10")}>
        <div className="space-y-6">
          <div className={s.border}>
            <RadioGroup
              className="space-y-10"
              value={purchaseOption}
              onValueChange={(value: PurchaseOption) => setPurchaseOption(value)}
            >
              <div className="space-y-6">
                <div className={cn(s.purchaseOption, "flex items-center space-x-2")}>
                  <RadioGroupItem className={s.checkbox} value={PurchaseOption.oneTime} id={PurchaseOption.oneTime} />
                  <Label htmlFor={PurchaseOption.oneTime}>One-time purchase</Label>
                </div>
                <div className={cn(s.purchaseOption, "flex items-center space-x-2")}>
                  <RadioGroupItem
                    className={s.checkbox}
                    value={PurchaseOption.subscription}
                    id={PurchaseOption.subscription}
                  />
                  <Label htmlFor={PurchaseOption.subscription}>{props.sp?.name}</Label>
                </div>
              </div>
              {sellingPlanOptions && sellingPlanOptions?.length > 0 && (
                <div
                  className={cn(s.subscriptionOptions, { [s.active]: purchaseOption === PurchaseOption.subscription })}
                >
                  <p className="mb-2">DELIVERY INTERVAL</p>
                  <Select
                    defaultValue={sellingPlanOptions[0].value}
                    value={sellingPlanId}
                    onValueChange={(value: DeliveryInterval) => setSellingPlanId(value)}
                  >
                    <SelectTrigger className={s.selectTrigger}>
                      <SelectValue placeholder={"Select"} />
                    </SelectTrigger>
                    <SelectContent className={cn(s.deliveryIntervalSelectContent, "text-[var(--text-color)]")}>
                      {sellingPlanOptions.map((option, i) => {
                        return (
                          <SelectItem value={option.value} key={i}>
                            {option.label}
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </RadioGroup>
          </div>
        </div>
      </div>
      <Label className={cn(s.title)}>QUANTITY</Label>
      <div className="grid grid-cols-12 gap-4 justify-items-stretch">
        <div className="col-span-4">
          <Quantity quantity={quantity} setQuantity={setQuantity} />
        </div>
        <div className="col-span-8">
          <Button variant="themed" size="slim" onClick={() => addItem({ id: props.gid, quantity, sellingPlanId })}>
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
  )
}
