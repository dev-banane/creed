import { FaqSection } from "@/components/marketing/faq-section";
import { pricingFaqItems } from "@/lib/marketing/faq";
import { PLAN_FACTS } from "@/lib/marketing/pricing";

// Server-rendered pricing detail that ships in the initial HTML. The
// interactive cards above only render the currently-selected billing cycle, so
// a no-JS crawler (and any AI answer engine asked "how much does Creed cost")
// would otherwise miss the yearly and lifetime prices. This block lists every
// plan and every cycle as plain, visible content, then answers the billing
// questions a buyer actually has. It is real page content, not hidden text.
export function PricingReference() {
  return (
    <section className="border-t border-[var(--creed-border)] py-14 md:py-16">
      <div className="flex flex-col gap-2">
        <h2 className="text-[24px] font-medium tracking-[-0.01em] text-[var(--creed-text-primary)] md:text-[28px]">
          Every plan in full
        </h2>
        <p className="max-w-2xl text-[16px] leading-7 text-[var(--creed-text-secondary)]">
          Open source is free to self-host. Hosted plans add cross-device sync,
          backups, and managed storage. The Company plan adds one shared Company
          Creed for your whole team. All hosted plans support BYOK.
        </p>
      </div>

      <div className="mt-8 grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PLAN_FACTS.map((plan) => (
          <div
            key={plan.name}
            className="flex flex-col rounded-[16px] bg-[var(--creed-surface)] p-5"
          >
            <div className="line-clamp-1 text-[15px] font-medium text-[var(--creed-text-primary)]">
              {plan.name}
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-[26px] font-semibold tracking-[-0.02em] text-[var(--creed-text-primary)]">
                {plan.price}
              </span>
              <span className="text-[13px] text-[var(--creed-text-tertiary)]">
                {plan.cadence}
              </span>
            </div>
            <p className="mt-3 text-[14px] leading-6 text-[var(--creed-text-secondary)]">
              {plan.summary}
            </p>
            {plan.seats ? (
              <p className="mt-2 text-[13px] leading-6 text-[var(--creed-text-tertiary)]">
                {plan.seats}
              </p>
            ) : null}
            <p className="mt-2 text-[13px] leading-6 text-[var(--creed-text-tertiary)]">
              {plan.usage}
            </p>
          </div>
        ))}
      </div>

      <FaqSection
        heading="Pricing questions"
        items={pricingFaqItems}
        className="mt-14 md:mt-16"
      />
    </section>
  );
}
