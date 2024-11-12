import Cart from "@/components/cart/Cart"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { SmoothLayout } from "@/layouts/smooth"
import { LAYOUT_QUERY } from "@/lib/queries/sanity/layout"
import { sanityClient } from "@/lib/sanity/client"
import { LayoutQueryResponse } from "@/types/layout"
import { Metadata } from "next"
import { Poppins } from "next/font/google"
import { cache } from "react"

export const metadata: Metadata = {
  title: "Mightyfull",
  description: "This might be the best cookie ever!",
}

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-poppins",
})

const getLayoutData = cache(async (): Promise<LayoutQueryResponse> => {
  return await sanityClient.fetch(LAYOUT_QUERY)
})

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const layoutData = await getLayoutData()

  return (
    <div className={`flex min-h-screen flex-col items-stretch justify-between ${poppins.variable} overflow-hidden`}>
      <Header shopMenu={layoutData.shopMenu} />
      <SmoothLayout>
        <main className="mt-[var(--header-height)] overflow-hidden">{children}</main>
      </SmoothLayout>
      <Footer socialLinks={layoutData.socialLinks} />
      <Cart />
    </div>
  )
}
