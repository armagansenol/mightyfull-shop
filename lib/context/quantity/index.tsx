import React, { createContext, useContext, ReactNode } from "react"

// Define types for the context
interface QuantityContextType {
  increase: (current: number) => number
  decrease: (current: number) => number
}

// Create the context with initial dummy functions
const QuantityContext = createContext<QuantityContextType | undefined>(undefined)

// Provider component to supply helper functions
export const QuantityProvider = ({ children }: { children: ReactNode }) => {
  // Helper function to increase quantity
  const increase = (current: number) => current + 1

  // Helper function to decrease quantity with a minimum of 1
  const decrease = (current: number) => Math.max(current - 1, 1)

  return <QuantityContext.Provider value={{ increase, decrease }}>{children}</QuantityContext.Provider>
}

// Custom hook for consuming the context
export const useQuantityHelpers = () => {
  const context = useContext(QuantityContext)
  if (!context) {
    throw new Error("useQuantityHelpers must be used within a QuantityProvider")
  }
  return context
}
