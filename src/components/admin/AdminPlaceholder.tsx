type AdminPlaceholderProps = {
  title: string;
  description: string;
};

export function AdminPlaceholder({ description, title }: AdminPlaceholderProps) {
  return (
    <div className="space-y-1">
      <h1 className="text-lg font-semibold text-text-primary">{title}</h1>
      <p className="text-sm text-text-muted">{description}</p>
    </div>
  );
}
