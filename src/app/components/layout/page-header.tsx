import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Crumb = {
  label: string;
  href?: string;
};

type PageHeaderProps = {
  title: string;
  description?: string;
  breadcrumbs?: Crumb[];
  actions?: React.ReactNode; 
  className?: string;
};

export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <section
      className={cn(
        "border-b bg-gradient-to-b from-muted/40 to-transparent",
        className
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-3">
            <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
              {breadcrumbs.map((c, idx) => {
                const isLast = idx === breadcrumbs.length - 1;
                return (
                  <li key={`${c.label}-${idx}`} className="flex items-center">
                    {c.href && !isLast ? (
                      <Link
                        href={c.href}
                        className="hover:text-foreground transition-colors"
                      >
                        {c.label}
                      </Link>
                    ) : (
                      <span
                        aria-current={isLast ? "page" : undefined}
                        className={cn(isLast && "text-foreground font-medium")}
                      >
                        {c.label}
                      </span>
                    )}
                    {!isLast && (
                      <ChevronRight className="mx-1 h-4 w-4 opacity-60" />
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        )}

        {/* Title, description, actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              {title}
            </h1>
            {description && (
              <p className="mt-1 text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      </div>
    </section>
  );
}