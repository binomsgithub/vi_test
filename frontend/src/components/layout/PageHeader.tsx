interface PageHeaderProps {
  title: string;
  description: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <header className="mb-4">
      <h1 className="text-2xl font-bold text-slate-900">
        {title}
      </h1>
      <p className="mt-1 text-sm text-slate-500 max-w-2xl">
        {description}
      </p>
    </header>
  );
}

