import "./globals.css";

export const metadata = {
  title: "Voyex",
  description:
    "Voyex is the ultimate superapp for discovering AI tools and building custom workflows tailored to your needs. Effortlessly find, use, and query the right tools to create your own mini agency by simply describing your use case.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="antialiased bg-black bg-[url('/stars.svg.svg')] w-full bg-cover bg-no-repeat bg-fixed h-full bg-center relative items-center justify-center"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
      <div className="flex w-full h-full items-center">
      <main className="relative h-full w-full">{children}
      </main>
    </div>
      </body>
    </html>
  );
}
