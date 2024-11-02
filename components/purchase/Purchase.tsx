"use client"

import s from "./purchase.module.scss"

import cx from "clsx"

import { Label } from "components/ui/label"
import { RadioGroup, RadioGroupItem } from "components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "components/ui/select"
import { AddToCart } from "components/add-to-cart"
import { usePurchaseStore } from "lib/store/purchase"

export default function PurchaseOptions() {
  const { purchaseType, deliveryInterval, setPurchaseType, setDeliveryInterval } = usePurchaseStore()
  const basePrice = 12.99

  return (
    <div className={s.purchaseOptions}>
      <p className={s.title}>PURCHASE OPTIONS</p>
      <div className={cx(s.purchase, "rounded-lg")}>
        <div className="space-y-6">
          <div className={s.border}>
            <RadioGroup
              className="space-y-10"
              value={purchaseType}
              onValueChange={(value: "one-time" | "subscribe") => setPurchaseType(value)}
            >
              <div className="space-y-6">
                <div className={cx(s.purchaseOption, "flex items-center space-x-2")}>
                  <RadioGroupItem className={s.checkbox} value="one-time" id="one-time" />
                  <Label htmlFor="one-time">One-time purchase</Label>
                </div>

                <div className={cx(s.purchaseOption, "flex items-center space-x-2")}>
                  <RadioGroupItem className={s.checkbox} value="subscribe" id="subscribe" />
                  <Label htmlFor="subscribe">Subscribe - 10% off</Label>
                </div>
              </div>

              <div className={cx(s.subscriptionOptions, { [s.active]: purchaseType === "subscribe" })}>
                <p className="text-sm mb-2">DELIVER EVERY</p>
                <Select
                  value={deliveryInterval}
                  onValueChange={(value: "2 Weeks" | "1 Month" | "2 Months") => setDeliveryInterval(value)}
                >
                  <SelectTrigger className={s.selectTrigger}>
                    <SelectValue placeholder="Select interval" />
                  </SelectTrigger>
                  <SelectContent className="text-[var(--blue-ruin)] text-md w-full">
                    <SelectItem value="2 Weeks">2 Weeks</SelectItem>
                    <SelectItem value="1 Month">1 Month</SelectItem>
                    <SelectItem value="2 Months">2 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </RadioGroup>
          </div>
          <AddToCart productName="Chocolate Chip" basePrice={basePrice} />
        </div>
      </div>
    </div>
  )
}
