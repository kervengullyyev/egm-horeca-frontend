import Link from "next/link";

type TileProps = {
  title: string;
  href: string;
  className?: string;
};

function CategoryTile({ title, href, className = "" }: TileProps) {
  return (
    <Link
      href={href}
      className={`relative block h-full w-full overflow-hidden rounded-[20px] border border-black/10 bg-gray-100 ${className}`}
    >
      {/* image placeholder */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(0,0,0,0.06),transparent_40%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[conic-gradient(from_180deg_at_60%_40%,rgba(0,0,0,0.04),transparent_60%)]" />

      <div className="relative flex h-full w-full flex-col justify-between p-6">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <span className="ml-auto inline-flex items-center gap-1 text-sm text-foreground/70">
          View <span aria-hidden>→</span>
        </span>
      </div>
    </Link>
  );
}

export default function CategoryShowcase() {
  return (
    <section className="mt-12">
      {/* Two stacked tiles on left, one tall tile on right */}
      <div className="grid gap-6 lg:grid-cols-2 lg:auto-rows-[220px]">
        {/* Left top */}
        <CategoryTile title="Plates" href="/category/plates" />
        {/* Right tall spanning two rows */}
        <CategoryTile
          title="Cups"
          href="/category/cups"
          className="lg:row-span-2"
        />
        {/* Left bottom */}
        <CategoryTile title="Cutlery" href="/category/cutlery" />
      </div>
    </section>
  );
}


