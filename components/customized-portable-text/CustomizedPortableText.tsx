import { PortableText, PortableTextBlock, PortableTextComponents } from "@portabletext/react"

export interface CustomizedPortableTextProps {
  content: PortableTextBlock[]
}

export default function CustomizedPortableText(props: CustomizedPortableTextProps) {
  const components: PortableTextComponents = {
    list: {
      bullet: ({ children }) => <ul className="list-disc pl-6">{children}</ul>,
      number: ({ children }) => <ol className="list-decimal pl-6">{children}</ol>,
    },
    listItem: {
      bullet: ({ children }) => <li className="mb-2">{children}</li>,
      number: ({ children }) => <li className="mb-2">{children}</li>,
    },
    block: {
      normal: ({ children }) => <p className="leading-relaxed mb-4">{children}</p>,
    },
  }

  return <PortableText value={props.content} components={components} />
}
