import { Navbar } from "@/components/navbar"


export default function SharedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
          <main>
              <Navbar />
              {children}
          </main>
    </div>
  )
}