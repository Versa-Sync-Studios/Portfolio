const focusAreas = [
  "Next.js",
  "Supabase",
  "Product systems",
  "Remote teams",
] as const;

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-6 py-16 sm:px-8">
        <div className="max-w-3xl">
          <h1 className="font-display text-4xl font-semibold leading-tight text-foreground sm:text-6xl">
            Sai Ganesh builds full-stack products for teams that need reliable
            execution.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            This scaffold is ready for the portfolio data model, Supabase
            clients, strict TypeScript, and the visual system used across the
            site.
          </p>
        </div>

        <ul className="mt-10 grid max-w-2xl divide-y divide-border border-y border-border sm:grid-cols-2 sm:divide-x sm:divide-y-0">
          {focusAreas.map((area) => (
            <li
              key={area}
              className="py-3 font-mono text-sm text-muted-foreground sm:px-4 sm:first:pl-0"
            >
              {area}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
