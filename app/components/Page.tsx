import React from "react"
import styles from "~/styles/page.css"

export function links() {
  return [{ rel: "stylesheet", href: styles }]
}

export const Page: React.FC<{
  preTitle?: string
  title: React.ReactNode
  subTitle?: React.ReactNode
}> = ({ preTitle, title, subTitle, children }) => {
  return (
    <section className="container">
      <header className="header">
        <h2 className="preTitle">{preTitle}</h2>
        <h1 className="title">{title}</h1>
        {subTitle}
      </header>
      {children}
    </section>
  )
}