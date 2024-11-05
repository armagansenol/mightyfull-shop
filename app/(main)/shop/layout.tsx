import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Shop | Mightyfull",
  description: "This might be the best cookie ever!",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <main>{children}</main>
    </>
  )
}
