import { ScrollTrigger, gsap } from "@/lib/gsap"
import { useGSAP } from "@gsap/react"

const useOverlappingLayers = () => {
  useGSAP(() => {
    if (ScrollTrigger.isTouch) {
      return
    }

    const layers: HTMLDivElement[] = gsap.utils.toArray(".overlapping-layer")

    console.log(layers)

    layers.forEach((layer, i) => {
      let tl

      if (i !== layers.length - 1) {
        tl = gsap.timeline({
          paused: true,
        })

        tl.to(
          layer,
          {
            scale: 0.9,
            opacity: 0.5,
            yPercent: -50,
          },
          "s"
        )
      }

      ScrollTrigger.create({
        animation: tl,
        id: `overlapping-layers-${i}`,
        trigger: layer,
        start: `bottom ${i === 0 ? "top+=" + layer.getBoundingClientRect().height : "bottom"}`,
        end: "bottom top",
        pin: true,
        pinSpacing: false,
        markers: false,
        scrub: true,
      })
    })
  })
}

export default useOverlappingLayers
