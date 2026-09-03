import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"

type Frequency = "daily" | "weekly" | "monthly"
type Duration = "6 months" | "1 year" | "2 years" | "3 years"

const durationMonths: Record<Duration, number> = {
  "6 months": 6,
  "1 year": 12,
  "2 years": 24,
  "3 years": 36,
}

function formatNaira(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value)
}

function Plan() {
  const navigate = useNavigate()

  const [frequency, setFrequency] = useState<Frequency>("monthly")
  const [amount, setAmount] = useState("20000")
  const [duration, setDuration] = useState<Duration>("6 months")
  const [startDate, setStartDate] = useState("")
  const [error, setError] = useState("")

  const calculation = useMemo(() => {
    const contribution = Math.max(0, Number(amount) || 0)
    const months = durationMonths[duration]

    let periods = months

    if (frequency === "weekly") {
      periods = months * 4
    }

    if (frequency === "daily") {
      periods = months * 30
    }

    return {
      periods,
      total: contribution * periods,
    }
  }, [amount, duration, frequency])

  const maturityDate = useMemo(() => {
    const baseDate = startDate ? new Date(`${startDate}T00:00:00`) : new Date()

    if (Number.isNaN(baseDate.getTime())) {
      return ""
    }

    const months = durationMonths[duration]
    const result = new Date(baseDate)
    result.setMonth(result.getMonth() + months)

    return result.toLocaleDateString("en-NG", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }, [startDate, duration])

  const handleContinue = () => {
    const contribution = Number(amount)

    if (!Number.isFinite(contribution) || contribution <= 0) {
      setError("Enter a contribution amount greater than ₦0.")
      return
    }

    setError("")

    const planData = {
      frequency,
      amount: contribution,
      duration,
      startDate: startDate || new Date().toISOString().slice(0, 10),
      plannedSavings: calculation.total,
      contributionPeriods: calculation.periods,
    }

    // Keep the selected plan available to the next screen.
    localStorage.setItem("esusu_plan_config", JSON.stringify(planData))

    // Move to the next step in the setup flow.
    navigate("/configure-plan")
  }

  return (
    <main className="min-h-screen bg-[#f7f9f7] px-5 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-4xl">
        <header className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/models")}
            className="text-xl font-bold tracking-tight text-[#17251f]"
          >
            ESUSU
          </button>

          <button
            type="button"
            onClick={() => navigate("/models")}
            className="text-sm font-medium text-[#17251f]/60 hover:text-[#17251f]"
          >
            Back
          </button>
        </header>

        <section className="mx-auto max-w-2xl pt-12 text-center sm:pt-16">
          <p className="text-sm font-semibold text-[#17251f]/50">
            Build your plan
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#17251f] sm:text-5xl">
            Make your savings plan work for you.
          </h1>

          <p className="mt-5 text-base leading-7 text-[#17251f]/60">
            Choose how often you want to contribute, set your amount and
            duration, and see your planned savings instantly.
          </p>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="rounded-3xl border border-[#17251f]/10 bg-white p-6 shadow-sm sm:p-8">
            <div>
              <label className="text-sm font-semibold text-[#17251f]">
                Contribution frequency
              </label>

              <div className="mt-3 grid grid-cols-3 gap-2">
                {(["daily", "weekly", "monthly"] as Frequency[]).map(
                  (option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setFrequency(option)}
                      className={`rounded-2xl px-3 py-3 text-sm font-medium capitalize transition ${
                        frequency === option
                          ? "bg-[#17251f] text-white"
                          : "bg-[#17251f]/5 text-[#17251f]/60 hover:bg-[#17251f]/10"
                      }`}
                    >
                      {option}
                    </button>
                  ),
                )}
              </div>
            </div>

            <div className="mt-7">
              <label
                htmlFor="amount"
                className="text-sm font-semibold text-[#17251f]"
              >
                Contribution amount
              </label>

              <div className="relative mt-3">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-[#17251f]/40">
                  ₦
                </span>

                <input
                  id="amount"
                  type="number"
                  min="1"
                  step="100"
                  value={amount}
                  onChange={(event) => {
                    setAmount(event.target.value)
                    setError("")
                  }}
                  className="w-full rounded-2xl border border-[#17251f]/10 bg-[#f7f9f7] px-10 py-4 text-lg font-semibold text-[#17251f] outline-none transition focus:border-[#17251f]/30"
                  placeholder="20,000"
                />
              </div>

              {error && (
                <p className="mt-2 text-sm font-medium text-red-600">
                  {error}
                </p>
              )}
            </div>

            <div className="mt-7">
              <label
                htmlFor="duration"
                className="text-sm font-semibold text-[#17251f]"
              >
                Plan duration
              </label>

              <select
                id="duration"
                value={duration}
                onChange={(event) =>
                  setDuration(event.target.value as Duration)
                }
                className="mt-3 w-full rounded-2xl border border-[#17251f]/10 bg-[#f7f9f7] px-4 py-4 text-sm font-medium text-[#17251f] outline-none focus:border-[#17251f]/30"
              >
                <option>6 months</option>
                <option>1 year</option>
                <option>2 years</option>
                <option>3 years</option>
              </select>
            </div>

            <div className="mt-7">
              <label
                htmlFor="startDate"
                className="text-sm font-semibold text-[#17251f]"
              >
                Start date
              </label>

              <input
                id="startDate"
                type="date"
                min={new Date().toISOString().slice(0, 10)}
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                className="mt-3 w-full rounded-2xl border border-[#17251f]/10 bg-[#f7f9f7] px-4 py-4 text-sm font-medium text-[#17251f] outline-none focus:border-[#17251f]/30"
              />

              <p className="mt-2 text-xs text-[#17251f]/40">
                Leave this blank to start today.
              </p>
            </div>

            <button
              type="button"
              onClick={handleContinue}
              className="mt-8 w-full rounded-full bg-[#17251f] px-5 py-4 text-sm font-semibold text-white transition hover:opacity-90 active:scale-[0.99]"
            >
              Continue with this plan
            </button>
          </div>

          <aside className="h-fit rounded-3xl bg-[#17251f] p-6 text-white shadow-sm sm:p-8">
            <p className="text-sm font-medium text-white/50">
              Savings calculator
            </p>

            <h2 className="mt-3 text-2xl font-semibold">
              Your plan at a glance
            </h2>

            <div className="mt-8 space-y-6">
              <div>
                <p className="text-xs uppercase tracking-wide text-white/40">
                  Contribution
                </p>
                <p className="mt-1 text-xl font-semibold">
                  {formatNaira(Number(amount) || 0)} / {frequency}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-white/40">
                  Duration
                </p>
                <p className="mt-1 text-xl font-semibold">{duration}</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-white/40">
                  Contribution periods
                </p>
                <p className="mt-1 text-xl font-semibold">
                  {calculation.periods}
                </p>
              </div>

              <div className="border-t border-white/10 pt-6">
                <p className="text-xs uppercase tracking-wide text-white/40">
                  Planned savings
                </p>
                <p className="mt-2 text-3xl font-semibold tracking-tight">
                  {formatNaira(calculation.total)}
                </p>
                <p className="mt-2 text-xs leading-5 text-white/50">
                  This is the amount you plan to contribute over the selected
                  period. It is not an investment return or guaranteed profit.
                </p>
              </div>

              <div className="border-t border-white/10 pt-6">
                <p className="text-xs uppercase tracking-wide text-white/40">
                  Expected maturity
                </p>
                <p className="mt-1 text-lg font-semibold">
                  {maturityDate || "Select a valid start date"}
                </p>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  )
}

export default Plan