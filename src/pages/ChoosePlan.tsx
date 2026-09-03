import { useNavigate } from "react-router-dom"

const models = [
  {
    label: "Model A",
    title: "Pure Savings",
    description:
      "Save consistently toward a defined goal and withdraw according to your plan rules.",
    bestFor: "Personal saving",
    example: "₦20,000 monthly",
  },
  {
    label: "Model B",
    title: "Rotating Esusu",
    description:
      "Contribute with a trusted group and follow a transparent schedule for member payouts.",
    bestFor: "Groups & communities",
    example: "₦100,000 monthly",
  },
  {
    label: "Model C",
    title: "Savings + Return",
    description:
      "A structured savings product with a defined term and product-specific return terms.",
    bestFor: "Longer-term goals",
    example: "12-month plan",
  },
  {
    label: "Model D",
    title: "Investment Plan",
    description:
      "An investment-oriented option designed for a suitable regulated structure.",
    bestFor: "Future investing",
    example: "Defined investment term",
  },
]

function ChoosePlan() {
  const navigate = useNavigate()

  return (
    <main className="min-h-screen bg-[#f7f9f7] px-5 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="text-xl font-bold tracking-tight text-[#17251f]"
          >
            ESUSU
          </button>

          <button
            onClick={() => navigate("/onboarding")}
            className="text-sm font-medium text-[#17251f]/60 hover:text-[#17251f]"
          >
            Back
          </button>
        </header>

        <section className="mx-auto max-w-3xl pt-16 text-center sm:pt-20">
          <p className="text-sm font-semibold text-[#17251f]/50">
            Choose your plan
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#17251f] sm:text-5xl">
            Choose how you want to save.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#17251f]/60 sm:text-lg">
            Start with a plan that fits your goal. You can contribute daily,
            weekly, or monthly and track everything clearly from your dashboard.
          </p>
        </section>

        <section className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {models.map((model) => (
            <article
              key={model.label}
              className="flex min-h-[360px] flex-col rounded-3xl border border-[#17251f]/10 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-[#17251f]/5 px-3 py-1 text-xs font-semibold text-[#17251f]/70">
                  {model.label}
                </span>

                <span className="text-sm text-[#17251f]/30">ES</span>
              </div>

              <div className="mt-8">
                <h2 className="text-2xl font-semibold tracking-tight text-[#17251f]">
                  {model.title}
                </h2>

                <p className="mt-4 text-sm leading-6 text-[#17251f]/60">
                  {model.description}
                </p>
              </div>

              <div className="mt-auto pt-8">
                <p className="text-xs font-medium uppercase tracking-wide text-[#17251f]/40">
                  Best for
                </p>

                <p className="mt-1 text-sm font-medium text-[#17251f]">
                  {model.bestFor}
                </p>

                <p className="mt-4 text-xs font-medium uppercase tracking-wide text-[#17251f]/40">
                  Example
                </p>

                <p className="mt-1 text-sm font-medium text-[#17251f]">
                  {model.example}
                </p>

                <button
                  onClick={() => navigate("/plan")}
                  className="mt-6 w-full rounded-full bg-[#17251f] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Choose plan
                </button>
              </div>
            </article>
          ))}
        </section>

        <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-5 text-[#17251f]/40">
          Models C and D are currently presented as product concepts for the
          prototype. Actual financial products, returns, and investment
          services will depend on applicable terms and regulatory requirements.
        </p>
      </div>
    </main>
  )
}

export default ChoosePlan