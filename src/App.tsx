import { BrowserRouter, Routes, Route, useNavigate, Navigate } from "react-router-dom"
import Onboarding from "./pages/Onboarding"
import ChoosePlan from "./pages/ChoosePlan"
import Plan from "./pages/Plan"
import ConfigurePlan from "./pages/ConfigurePlan"
import Dashboard from "./pages/Dashboard"
import Funding from "./pages/Funding"
import Withdrawal from "./pages/Withdrawal"

const models = [
  {
    label: "Model A",
    title: "Pure Savings",
    description:
      "Save consistently toward a defined goal and withdraw according to your plan's rules.",
    bestFor: "Personal saving",
  },
  {
    label: "Model B",
    title: "Rotating Esusu",
    description:
      "Contribute with a trusted group and follow a transparent schedule for member payouts.",
    bestFor: "Groups & communities",
  },
  {
    label: "Model C",
    title: "Savings + Return",
    description:
      "A structured savings product with a defined term and product-specific return terms.",
    bestFor: "Longer-term goals",
  },
  {
    label: "Model D",
    title: "Investment Plan",
    description:
      "An investment-oriented option designed for an appropriate regulated structure.",
    bestFor: "Future wealth building",
  },
]

function LandingPage() {
  const navigate = useNavigate()

  return (
    <main className="min-h-screen bg-[#f7f9f7] text-[#17251f]">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="text-2xl font-bold tracking-tight"
        >
          ESUSU
        </button>

        <div className="hidden items-center gap-8 text-sm font-medium md:flex">
          <a href="#how-it-works" className="transition-opacity hover:opacity-60">
            How it works
          </a>
          <a href="#models" className="transition-opacity hover:opacity-60">
            Plans
          </a>
          <a href="#why-esusu" className="transition-opacity hover:opacity-60">
            Why ESUSU
          </a>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => navigate("/onboarding")}
            className="rounded-full px-4 py-2 text-sm font-semibold transition hover:bg-black/5"
          >
            Log in
          </button>

          <button
            type="button"
            onClick={() => navigate("/onboarding")}
            className="rounded-full bg-[#17251f] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Get started
          </button>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-6 pb-24 pt-14 lg:px-8 lg:pb-32 lg:pt-24">
        <div className="grid items-end gap-14 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <div className="mb-7 inline-flex rounded-full border border-[#17251f]/10 bg-white px-4 py-2 text-sm font-medium shadow-sm">
              Simple saving. Better together.
            </div>

            <h1 className="max-w-5xl text-5xl font-semibold leading-[1.02] tracking-[-0.04em] sm:text-6xl lg:text-[84px]">
              Save with purpose.
              <br />
              <span className="text-[#587565]">Grow together.</span>
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-[#17251f]/65 sm:text-xl">
              ESUSU brings personal savings and group contributions into one
              simple, transparent platform — so you always know what you're
              saving, why you're saving, and when your money is due.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate("/onboarding")}
                className="rounded-full bg-[#17251f] px-7 py-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:opacity-90"
              >
                Start saving
              </button>

              <a
                href="#models"
                className="rounded-full border border-[#17251f]/15 bg-white px-7 py-4 text-center text-sm font-semibold transition hover:bg-black/5"
              >
                Explore plans
              </a>
            </div>
          </div>

          <div className="rounded-[32px] bg-[#17251f] p-7 text-white shadow-xl sm:p-9">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/55">Your savings</span>
              <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium">
                Active plan
              </span>
            </div>

            <div className="mt-12">
              <p className="text-sm text-white/50">Current balance</p>
              <p className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
                ₦485,000
              </p>
            </div>

            <div className="mt-10">
              <div className="mb-3 flex items-center justify-between text-sm">
                <span className="text-white/55">12-month plan</span>
                <span>68%</span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[68%] rounded-full bg-white" />
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-xs text-white/45">Next contribution</p>
                <p className="mt-2 font-semibold">₦25,000</p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-xs text-white/45">Maturity</p>
                <p className="mt-2 font-semibold">18 May 2027</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#17251f]/8 bg-white">
        <div className="mx-auto grid max-w-7xl gap-0 px-6 lg:grid-cols-3 lg:px-8">
          <div className="border-b border-[#17251f]/8 py-8 lg:border-b-0 lg:border-r lg:pr-10">
            <p className="text-3xl font-semibold">Daily</p>
            <p className="mt-1 text-sm text-[#17251f]/55">
              Save at the pace that works for you.
            </p>
          </div>

          <div className="border-b border-[#17251f]/8 py-8 lg:border-b-0 lg:border-r lg:px-10">
            <p className="text-3xl font-semibold">Weekly</p>
            <p className="mt-1 text-sm text-[#17251f]/55">
              Build consistency without the pressure.
            </p>
          </div>

          <div className="py-8 lg:pl-10">
            <p className="text-3xl font-semibold">Monthly</p>
            <p className="mt-1 text-sm text-[#17251f]/55">
              Plan larger contributions around your income.
            </p>
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32"
      >
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#587565]">
            How it works
          </p>

          <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Saving should not be complicated.
          </h2>

          <p className="mt-5 text-lg leading-8 text-[#17251f]/60">
            Choose a plan, set your contribution rhythm, and let ESUSU keep
            everything organized.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          <div className="rounded-[28px] border border-[#17251f]/10 bg-white p-7">
            <span className="text-sm font-semibold text-[#587565]">01</span>
            <h3 className="mt-16 text-2xl font-semibold">Choose your plan</h3>
            <p className="mt-3 leading-7 text-[#17251f]/55">
              Pick the savings model that matches your goal and timeline.
            </p>
          </div>

          <div className="rounded-[28px] bg-[#e8efe9] p-7">
            <span className="text-sm font-semibold text-[#587565]">02</span>
            <h3 className="mt-16 text-2xl font-semibold">
              Set your contribution
            </h3>
            <p className="mt-3 leading-7 text-[#17251f]/55">
              Contribute daily, weekly, or monthly for 6 months to 3 years.
            </p>
          </div>

          <div className="rounded-[28px] bg-[#17251f] p-7 text-white">
            <span className="text-sm font-semibold text-white/50">03</span>
            <h3 className="mt-16 text-2xl font-semibold">
              Track your progress
            </h3>
            <p className="mt-3 leading-7 text-white/55">
              See your contributions, balance, maturity date, and activity in
              one place.
            </p>
          </div>
        </div>
      </section>

      <section id="models" className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#587565]">
                Choose your model
              </p>

              <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                One platform. Different ways to save.
              </h2>
            </div>

            <p className="max-w-md text-base leading-7 text-[#17251f]/55">
              Start with the option that fits your needs. Product terms,
              availability, and applicable requirements will apply.
            </p>
          </div>

          <div className="mt-14 grid gap-5 lg:grid-cols-2">
            {models.map((model, index) => (
              <div
                key={model.label}
                className="group rounded-[30px] border border-[#17251f]/10 bg-[#f7f9f7] p-7 transition hover:-translate-y-1 hover:shadow-lg sm:p-9"
              >
                <div className="flex items-start justify-between gap-5">
                  <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold">
                    {model.label}
                  </span>

                  <span className="text-sm text-[#17251f]/40">
                    0{index + 1}
                  </span>
                </div>

                <h3 className="mt-14 text-3xl font-semibold tracking-tight">
                  {model.title}
                </h3>

                <p className="mt-4 max-w-xl leading-7 text-[#17251f]/60">
                  {model.description}
                </p>

                <div className="mt-8 flex items-center justify-between border-t border-[#17251f]/10 pt-5">
                  <div>
                    <p className="text-xs text-[#17251f]/40">Best for</p>
                    <p className="mt-1 text-sm font-semibold">
                      {model.bestFor}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate("/onboarding")}
                    className="rounded-full border border-[#17251f]/15 bg-white px-4 py-2.5 text-sm font-semibold transition group-hover:bg-[#17251f] group-hover:text-white"
                  >
                    View plan
                  </button>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-6 max-w-3xl text-xs leading-5 text-[#17251f]/45">
            Models C and D are presented as product concepts for the prototype.
            They do not constitute an offer of guaranteed returns or investment
            services.
          </p>
        </div>
      </section>

      <section
        id="why-esusu"
        className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32"
      >
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#587565]">
              Why ESUSU
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              Built around clarity and continuity.
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <div className="mb-5 h-10 w-10 rounded-2xl bg-[#e8efe9]" />
              <h3 className="text-xl font-semibold">Transparent records</h3>
              <p className="mt-3 leading-7 text-[#17251f]/55">
                Every contribution, withdrawal, fee, and payout can be tracked
                through a clear transaction history.
              </p>
            </div>

            <div>
              <div className="mb-5 h-10 w-10 rounded-2xl bg-[#17251f]" />
              <h3 className="text-xl font-semibold">Flexible plans</h3>
              <p className="mt-3 leading-7 text-[#17251f]/55">
                Choose daily, weekly, or monthly contributions with defined
                plan durations and maturity rules.
              </p>
            </div>

            <div>
              <div className="mb-5 h-10 w-10 rounded-2xl bg-[#e8efe9]" />
              <h3 className="text-xl font-semibold">Built for groups</h3>
              <p className="mt-3 leading-7 text-[#17251f]/55">
                Group contributions, payout order, member status, and group
                progress can live in one organized workspace.
              </p>
            </div>

            <div>
              <div className="mb-5 h-10 w-10 rounded-2xl bg-[#17251f]" />
              <h3 className="text-xl font-semibold">Designed for continuity</h3>
              <p className="mt-3 leading-7 text-[#17251f]/55">
                Role-based access, audit trails, and controlled administration
                help the operation continue beyond one individual.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-10 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[36px] bg-[#17251f] px-7 py-16 text-white sm:px-12 lg:px-16 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/45">
              Start your journey
            </p>

            <h2 className="mt-5 text-4xl font-semibold tracking-tight sm:text-6xl">
              Your next savings goal starts here.
            </h2>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/55">
              Create an account, choose a plan, and start building a clearer
              savings habit.
            </p>

            <button
              type="button"
              onClick={() => navigate("/onboarding")}
              className="mt-9 rounded-full bg-white px-7 py-4 text-sm font-semibold text-[#17251f] transition hover:-translate-y-0.5"
            >
              Get started
            </button>
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-10 text-sm text-[#17251f]/50 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <p className="font-semibold text-[#17251f]">ESUSU</p>
        <p>Save together. Build together.</p>
        <p>© {new Date().getFullYear()} ESUSU</p>
      </footer>
    </main>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/onboarding" element={<Onboarding />} />

        {/* Both paths are supported so /models never becomes a blank page. */}
        <Route path="/models" element={<ChoosePlan />} />
        <Route path="/plans" element={<ChoosePlan />} />

        <Route path="/plan" element={<Plan />} />
        <Route path="/configure-plan" element={<ConfigurePlan />} />

        {/* Real customer dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/fund" element={<Funding />} />
        <Route path="/withdraw" element={<Withdrawal />} />

        {/* Prevent completely blank screens for unknown routes. */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App