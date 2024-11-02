"use client"

import { Minus, Plus, X } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { createCheckout } from "./actions"

interface CartItem {
  id: string
  variantId: string // Shopify variant ID
  name: string
  price: number
  discountedPrice?: number
  quantity: number
  image: string
}

export default function Cart() {
  const [isLoading, setIsLoading] = useState(false)

  const cartItems: CartItem[] = [
    {
      id: "1",
      variantId: "gid://shopify/Product/8518330613912", // Replace with actual Shopify variant ID
      name: "Chocolate Chip",
      price: 12.99,
      quantity: 1,
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: "2",
      variantId: "gid://shopify/Product/8519320305816", // Replace with actual Shopify variant ID
      name: "P&B Jelly Chocolate Chip",
      price: 12.99,
      discountedPrice: 11.79,
      quantity: 1,
      image: "/placeholder.svg?height=80&width=80",
    },
  ]

  const total = cartItems.reduce((sum, item) => sum + (item.discountedPrice || item.price) * item.quantity, 0)

  const handleCheckout = async () => {
    try {
      setIsLoading(true)
      const checkoutUrl = await createCheckout(
        cartItems.map((item) => ({
          variantId: item.variantId,
          quantity: item.quantity,
        }))
      )

      // Redirect to Shopify checkout
      window.location.href = checkoutUrl
    } catch (error) {
      console.log("Failed to create checkout. Please try again.", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 fixed top-0 right-0 bottom-0 z-99999999">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-600">Your Cart</h2>
        <div>
          <X className="h-6 w-6" />
        </div>
      </div>

      <div className="space-y-6">
        {cartItems.map((item) => (
          <div key={item.id} className="space-y-4">
            <div className="flex gap-4">
              <Image src={item.image} alt={item.name} width={80} height={80} className="rounded-lg" />
              <div className="flex-1">
                <h3 className="font-medium text-lg text-blue-600">{item.name}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <div className="h-8 w-8">
                    <Minus className="h-4 w-4" />
                  </div>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <div className="h-8 w-8">
                    <Plus className="h-4 w-4" />
                  </div>
                </div>
                <button className="text-blue-600 text-sm mt-2">Remove</button>
              </div>
              <div className="text-right">
                <div className="font-medium">
                  {item.discountedPrice ? (
                    <>
                      <span className="text-gray-400 line-through">${item.price.toFixed(2)}</span>
                      <span className="text-green-600 ml-2">${item.discountedPrice.toFixed(2)}</span>
                    </>
                  ) : (
                    <span>${item.price.toFixed(2)}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="bg-blue-50 rounded-lg p-3 text-center text-blue-600 text-sm">
          Upgrade to Subscription and Save 10%
        </div>

        <div className="bg-blue-50 rounded-lg p-3 flex justify-between items-center text-sm">
          <span className="text-blue-600">Deliver Every 2 Weeks, 10% off</span>
          <div className="h-6 w-6">
            <X className="h-4 w-4" />
          </div>
        </div>

        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          onClick={handleCheckout}
          disabled={isLoading}
        >
          {isLoading ? "Creating checkout..." : `CHECKOUT ($${total.toFixed(2)})`}
        </button>

        <button className="w-full text-center text-blue-600">Continue Shopping</button>

        <p className="text-sm text-gray-500 text-center">Shipping, taxes and discounts calculated at checkout.</p>
      </div>
    </div>
  )
}
