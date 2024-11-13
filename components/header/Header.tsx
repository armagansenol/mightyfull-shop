"use client"

import s from "./header.module.scss"

import { Cross1Icon, HamburgerMenuIcon } from "@radix-ui/react-icons"
import cn from "clsx"
import { useEffect, useState } from "react"

import { useCartStore } from "@/lib/store/cart"
import { IconCookieCart, IconLogo } from "components/icons"
import { Link } from "components/utility/link"
import { useLenisStore } from "lib/store/lenis"
import { useTheme } from "lib/store/theme"
import { ProductCollection } from "types"

interface HeaderProps {
  shopMenu: ProductCollection[]
}

export default function Header(props: HeaderProps) {
  const { primaryColor, secondaryColor } = useTheme()
  const [hamburgerOpen, setHamburgerOpen] = useState(false)
  const { lenis } = useLenisStore()
  const [hidden, setHidden] = useState(false)
  const { items, setIsOpen } = useCartStore()

  console.log(props)

  useEffect(() => {
    return hamburgerOpen ? lenis?.stop() : lenis?.start()
  }, [hamburgerOpen, lenis])

  useEffect(() => {
    lenis?.on("scroll", () => {
      if (lenis.scroll < 150) return
      if (lenis.velocity > 0) {
        if (!hidden) {
          setHidden(true)
        }
      } else {
        if (hidden) {
          setHidden(false)
        }
      }
    })
  }, [hidden, lenis])

  return (
    <>
      <header
        className={cn(s.header, "flex items-center justify-between tablet:justify-stretch", {
          [s.hidden]: hidden,
        })}
        style={{ "--primary": primaryColor, "--secondary": secondaryColor } as React.CSSProperties}
      >
        <Link href="/" className={cn(s.logoC, "cursor-pointer")}>
          <IconLogo primary={primaryColor} secondary={secondaryColor} />
        </Link>

        <div
          className={cn(s.trigger, "block tablet:hidden", { [s.active]: hamburgerOpen })}
          onClick={() => setHamburgerOpen((prev) => !prev)}
        >
          {hamburgerOpen ? <Cross1Icon className="w-full h-full" /> : <HamburgerMenuIcon className="w-full h-full" />}
        </div>

        <nav
          className={cn(s.navC, "flex items-center justify-between flex-1", {
            [s.active]: hamburgerOpen,
          })}
        >
          <div className={cn(s.nav, "flex flex-col tablet:flex-row items-center justify-between space-x-20")}>
            <div className={s.navItem}>
              <Link href={`/${"shop"}`}>Shop</Link>
            </div>
            <div className={s.navItem}>
              <Link href={`/${"our-story"}`}>Our Story</Link>
            </div>
          </div>

          <div className={cn(s.nav, "flex flex-col tablet:flex-row items-center justify-between space-x-20")}>
            <div className={cn(s.navItem)}>
              <Link href="mailto:kamola@mightyfull.com">Contact Us</Link>
            </div>
            <div
              className={cn(
                s.nav,
                "flex flex-col tablet:flex-row items-center justify-between space-x-20 cursor-pointer"
              )}
              onClick={() => setIsOpen(true)}
            >
              <div className={cn(s.navItem)}>
                <div className={s.iconC}>
                  <IconCookieCart fill="var(--primary)" />
                </div>
                <div className={cn(s.amount, "flex items-center justify-center rounded-full")}>{items.length}</div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  )
}
