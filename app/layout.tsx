import "styles/global.scss"
import "styles/tailwind-initial.css"

import { Poppins } from "next/font/google"
import { cache } from "react"

import { Footer } from "components/footer"
import { SmoothLayout } from "layouts/smooth"
import { LAYOUT_QUERY } from "lib/queries/sanity/layout"
import { sanityClient } from "lib/sanity/client"
import { LayoutQueryResponse } from "types/layout"
import { Header } from "components/header"

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-poppins",
})

const getLayoutData = cache(async (): Promise<LayoutQueryResponse> => {
  const res = await sanityClient.fetch(LAYOUT_QUERY)
  return res
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const layoutData = await getLayoutData()

  return (
    <html lang="en">
      <body className={`antialiased`}>
        <div className={`flex min-h-screen flex-col items-stretch justify-between ${poppins.variable}`}>
          <Header shopMenu={layoutData.shopMenu} />
          <SmoothLayout>
            {children}
            <Footer socialLinks={layoutData.socialLinks} />
          </SmoothLayout>
        </div>
      </body>
    </html>
  )
}
