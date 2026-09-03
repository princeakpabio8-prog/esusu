import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"

type Frequency = "daily" | "weekly" | "monthly"
type Duration = "6" | "12" | "24" | "36"

const durationLabels: Record<Duration, string> = {
  "6": "6 Months",
  "12": "1 Year",
  "24": "2 Years",
  "36": "3 Years",
}

const durationMonths: Record<Duration, number> = {
  "6": 6,
  "12": 12,
  "24": 24,
  "36": 36,
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value)
}

function ConfigurePlan() {
  const navigate = useNavigate()

  const [frequency, setFrequency] = useState<Frequency>("monthly")
  const [amount, setAmount] = useState("20000")
  const [duration, setDuration] = useState<Duration>("6")
  const [startDate, setStartDate] = useState("")
  const [error, setError] = useState("")

  // Bring the choices from the previous Plan screen into this step.
  useEffect(() => {
    const saved = localStorage.getItem("esusu_plan_config")

    if (!saved) return

    try {
      const plan = JSON.parse(saved)

      if (
        plan.frequency === "daily" ||
        plan.frequency === "weekly" ||
        plan.frequency === "monthly"
      ) {
        setFrequency(plan.frequency)
      }

      if (typeof plan.amount === "number" && plan.amount > 0) {
        setAmount(String(plan.amount))
      }

      if (
        plan.duration === "6 months" ||
        plan.duration === "1 year" ||
        plan.duration === "2 years" ||
        plan.duration === "3 years"
      ) {
        const durationMap: Record<string, Duration> = {
          "6 months": "6",
          "1 year": "12",
          "2 years": "24",
          "3 years": "36",
        }

        const mappedDuration = durationMap[plan.duration]

        if (mappedDuration) {
          setDuration(mappedDuration)
        }
      }

      if (typeof plan.startDate === "string") {
        setStartDate(plan.startDate)
      }
    } catch {
      // Ignore malformed prototype data and keep the default values.
    }
  }, [])

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
      contribution,
      periods,
      total: contribution * periods,
    }
  }, [amount, duration, frequency])

  const maturityDate = useMemo(() => {
    const baseDate = startDate
      ? new Date(`${startDate}T00:00:00`)
      : new Date()

    if (Number.isNaN(baseDate.getTime())) return ""

    const result = new Date(baseDate)
    result.setMonth(result.getMonth() + durationMonths[duration])

    return result.toLocaleDateString("en-NG", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }, [startDate, duration])

  const today = new Date().toISOString().slice(0, 10)

  const handleContinue = () => {
    if (calculation.contribution <= 0) {
      setError("Enter a contribution amount greater than ₦0.")
      return
    }

    setError("")

    const finalStartDate = startDate || today

    const planData = {
      model: "Model A",
      planName: "Pure Savings",
      frequency,
      amount: calculation.contribution,
      duration: durationLabels[duration],
      durationMonths: durationMonths[duration],
      startDate: finalStartDate,
      plannedSavings: calculation.total,
      contributionPeriods: calculation.periods,
      maturityDate,
      updatedAt: new Date().toISOString(),
    }

    localStorage.setItem("esusu_plan_config", JSON.stringify(planData))
    localStorage.setItem("esusu_active_plan", JSON.stringify(planData))

    navigate("/dashboard")
  }

  return (
    <main className="min-h-screen bg-[#f7f9f7] px-5 py-6 sm:px-8 sm:py-8 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <header className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/plan")}
            className="text-xl font-bold tracking-tight text-[#17251f]"
          >
            ESUSU
          </button>

          <button
            type="button"
            onClick={() => navigate("/plan")}
            className="rounded-full px-4 py-2 text-sm font-medium text-[#17251f]/60 transition hover:bg-white hover:text-[#17251f]"
          >
            ← Back
          </button>
        </header>

        <div className="mx-auto max-w-2xl pt-10 text-center sm:pt-14">
          <div className="inline-flex rounded-full bg-[#17251f]/5 px-4 py-2 text-xs font-bold tracking-[0.16em] text-[#17251f]/60">
            MODEL A · PURE SAVINGS
          </div>

          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-[#17251f] sm:text-5xl">
            Set up your savings plan.
          </h1>

          <p className="mt-4 text-base leading-7 text-[#17251f]/60">
            Confirm your contribution schedule and review exactly what you
            plan to save before continuing.
          </p>
        </div>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="rounded-[2rem] border border-[#17251f]/10 bg-white p-6 shadow-sm sm:p-8">
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
                      className={`rounded-2xl px-3 py-3.5 text-sm font-semibold capitalize transition ${
                        frequency === option
                          ? "bg-[#17251f] text-white shadow-sm"
                          : "bg-[#17251f]/5 text-[#17251f]/60 hover:bg-[#17251f]/10"
                      }`}
                    >
                      {option}
                    </button>
                  ),
                )}
              </div>
            </div>

            <div className="mt-8">
              <label
                htmlFor="configure-amount"
                className="text-sm font-semibold text-[#17251f]"
              >
                Contribution amount
              </label>

              <div className="relative mt-3">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base font-semibold text-[#17251f]/40">
                  ₦
                </span>

                <input
                  id="configure-amount"
                  type="number"
                  min="1"
                  step="100"
                  inputMode="decimal"
                  value={amount}
                  onChange={(event) => {
                    setAmount(event.target.value)
                    setError("")
                  }}
                  className="w-full rounded-2xl border border-[#17251f]/10 bg-[#f7f9f7] px-10 py-4 text-lg font-semibold text-[#17251f] outline-none transition focus:border-[#17251f]/30 focus:ring-4 focus:ring-[#17251f]/5"
                  placeholder="20,000"
                />
              </div>

              {error && (
                <p className="mt-2 text-sm font-medium text-red-600">
                  {error}
                </p>
              )}
            </div>

            <div className="mt-8">
              <label className="text-sm font-semibold text-[#17251f]">
                Plan duration
              </label>

              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {(["6", "12", "24", "36"] as Duration[]).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setDuration(option)}
                    className={`rounded-2xl px-3 py-3.5 text-sm font-semibold transition ${
                      duration === option
                        ? "bg-[#17251f] text-white shadow-sm"
                        : "bg-[#17251f]/5 text-[#17251f]/60 hover:bg-[#17251f]/10"
                    }`}
                  >
                    {durationLabels[option]}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <label
                htmlFor="configure-start-date"
                className="text-sm font-semibold text-[#17251f]"
              >
                Start date
              </label>

              <input
                id="configure-start-date"
                type="date"
                min={today}
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                className="mt-3 w-full rounded-2xl border border-[#17251f]/10 bg-[#f7f9f7] px-4 py-4 text-sm font-medium text-[#17251f] outline-none transition focus:border-[#17251f]/30 focus:ring-4 focus:ring-[#17251f]/5"
              />

              <p className="mt-2 text-xs leading-5 text-[#17251f]/40">
                Leave this blank to start today.
              </p>
            </div>

            <div className="mt-8 rounded-2xl bg-[#f7f9f7] p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#17251f] text-xs font-bold text-white">
                  ✓
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#17251f]">
                    Your plan is flexible to review before activation
                  </p>
                  <p className="mt-1 text-xs leading-5 text-[#17251f]/50">
                    Your selections are saved locally for this prototype.
                    Payment and live account funding are not connected yet.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleContinue}
              disabled={calculation.contribution <= 0}
              className="mt-8 w-full rounded-full bg-[#17251f] px-5 py-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Continue to Dashboard
            </button>
          </div>

          <aside className="h-fit rounded-[2rem] bg-[#17251f] p-6 text-white shadow-sm sm:p-8">
            <p className="text-sm font-medium text-white/45">
              Savings calculator
            </p>

            <h2 className="mt-3 text-2xl font-semibold">
              Your plan at a glance
            </h2>

            <div className="mt-8 space-y-6">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-white/35">
                  Contribution
                </p>
                <p className="mt-1 text-xl font-semibold">
                  {formatMoney(calculation.contribution)} / {frequency}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-white/35">
                  Duration
                </p>
                <p className="mt-1 text-xl font-semibold">
                  {durationLabels[duration]}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-white/35">
                  Contribution periods
                </p>
                <p className="mt-1 text-xl font-semibold">
                  {calculation.periods}
                </p>
              </div>

              <div className="border-t border-white/10 pt-6">
                <p className="text-xs uppercase tracking-[0.14em] text-white/35">
                  Planned savings
                </p>
                <p className="mt-2 text-3xl font-semibold tracking-tight">
                  {formatMoney(calculation.total)}
                </p>
                <p className="mt-2 text-xs leading-5 text-white/45">
                  This is the amount you plan to contribute over the selected
                  period. It does not include investment returns or guaranteed
                  profit.
                </p>
              </div>

              <div className="border-t border-white/10 pt-6">
                <p className="text-xs uppercase tracking-[0.14em] text-white/35">
                  Expected maturity
                </p>
                <p className="mt-1 text-lg font-semibold">
                  {maturityDate}
                </p>
              </div>
            </div>
          </aside>
        </section>

        <p className="mx-auto mt-6 max-w-2xl text-center text-xs leading-5 text-[#17251f]/35">
          Financial services and product availability are subject to
          applicable terms and regulatory requirements.
        </p>
      </div>
    </main>
  )
}

export default ConfigurePlan