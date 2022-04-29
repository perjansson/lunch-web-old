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
    <main className="container">
      <header className="header">
        <div className="preTitle">{preTitle}</div>
        <h1 className="title">{title}</h1>
        {subTitle}
      </header>
      {children}
    </main>
  )
}
