interface BrandProps {
  tone?: "ink" | "onblue";
}

export function Brand({ tone = "ink" }: BrandProps) {
  return (
    <span className={tone === "onblue" ? "brand brand-onblue" : "brand brand-ink"}>
      <img src="/icon.png" alt="" />
      Balanz
    </span>
  );
}
