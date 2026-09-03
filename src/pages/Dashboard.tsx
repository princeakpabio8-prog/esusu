import { useMemo } from "react"
import { useNavigate } from "react-router-dom"

type PlanData = {
  model?: string
  planName?: string
  frequency?: "daily" | "weekly" | "monthly"
  amount?: number
  duration?: string
  durationMonths?: number
  startDate?: string
  plannedSavings?: number
  contributionPeriods?: number
  maturityDate?: string
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDate(value?: string) {
  if (!value) return "Not set"

  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return "Not set"

  return date.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function getNextContributionDate(plan: PlanData) {
  const start = plan.startDate
    ? new Date(`${plan.startDate}T00:00:00`)
    : new Date()

  if (Number.isNaN(start.getTime())) return "Not set"

  const next = new Date(start)

  if (plan.frequency === "daily") {
    next.setDate(next.getDate() + 1)
  } else if (plan.frequency === "weekly") {
    next.setDate(next.getDate() + 7)
  } else {
    next.setMonth(next.getMonth() + 1)
  }

  return next.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function Dashboard() {
  const navigate = useNavigate()

  const plan = useMemo<PlanData>(() => {
    try {
      const saved = localStorage.getItem("esusu_active_plan")

      if (saved) {
        return JSON.parse(saved)
      }
    } catch {
      // Keep the dashboard usable with default prototype data.
    }

    return {
      model: "Model A",
      planName: "Pure Savings",
      frequency: "monthly",
      amount: 20000,
      duration: "6 Months",
      durationMonths: 6,
      startDate: new Date().toISOString().slice(0, 10),
      plannedSavings: 120000,
      contributionPeriods: 6,
      maturityDate: "",
    }
  }, [])

  const plannedSavings = plan.plannedSavings || 0
  const contributionAmount = plan.amount || 0

  let currentBalance = 0
  let transactionCount = 0
  let recentTransactions: Array<{
    id?: string
    type?: string
    amount?: number
    status?: string
    method?: string
    date?: string
  }> = []

  try {
    currentBalance = Number(localStorage.getItem("esusu_balance")) || 0

    const savedTransactions = localStorage.getItem("esusu_transactions")
    const parsed = savedTransactions ? JSON.parse(savedTransactions) : []

    if (Array.isArray(parsed)) {
      recentTransactions = parsed
      transactionCount = parsed.length
    }
  } catch {
    currentBalance = 0
  }

  const progress = plannedSavings > 0
    ? Math.min(100, Math.round((currentBalance / plannedSavings) * 100))
    : 0

  const nextContribution = getNextContributionDate(plan)

  return (
    <main className="min-h-screen bg-[#f7f9f7] text-[#17251f]">
      <header className="border-b border-[#17251f]/8 bg-white/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="text-xl font-bold tracking-tight"
          >
            ESUSU
          </button>

          <div className="flex items-center gap-2 sm:gap-4">
            <span className="hidden text-sm text-[#17251f]/45 sm:block">
              Savings dashboard
            </span>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="rounded-full px-4 py-2 text-sm font-medium text-[#17251f]/60 transition hover:bg-[#17251f]/5 hover:text-[#17251f]"
            >
              Home
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10 lg:px-12">
        <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#587565]">
              Your dashboard
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
              Your savings, clearly organized.
            </h1>

            <p className="mt-3 max-w-2xl text-base leading-7 text-[#17251f]/55">
              Track your plan, contribution schedule, progress, and upcoming
              milestones from one place.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/configure-plan")}
            className="rounded-full bg-[#17251f] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:opacity-90"
          >
            Manage plan
          </button>
        </section>

        <section className="mt-8 grid gap-5 lg:grid-cols-[1.45fr_0.75fr]">
          <div className="rounded-[2rem] bg-[#17251f] p-6 text-white shadow-sm sm:p-8">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
              <div>
                <p className="text-sm text-white/50">Current savings</p>
                <p className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
                  {formatMoney(currentBalance)}
                </p>
                <p className="mt-2 text-sm text-white/45">
                  {currentBalance > 0 ? "Prototype contributions are reflected in your balance." : "No contributions have been recorded yet."}
                </p>
              </div>

              <span className="w-fit rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold">
                {plan.model || "Model A"}
              </span>
            </div>

            <div className="mt-10">
              <div className="mb-3 flex items-center justify-between text-sm">
                <span className="text-white/50">Plan progress</span>
                <span>{progress}%</span>
              </div>

              <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-white transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-white/45">
                <span>{formatMoney(currentBalance)} saved</span>
                <span>{formatMoney(plannedSavings)} planned</span>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#17251f]/10 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium text-[#17251f]/45">
              Active plan
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              {plan.planName || "Pure Savings"}
            </h2>

            <div className="mt-7 space-y-5">
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-[#17251f]/35">
                  Contribution
                </p>
                <p className="mt-1 font-semibold">
                  {formatMoney(contributionAmount)} / {plan.frequency || "monthly"}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-[#17251f]/35">
                  Duration
                </p>
                <p className="mt-1 font-semibold">
                  {plan.duration || "6 Months"}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-[#17251f]/35">
                  Maturity
                </p>
                <p className="mt-1 font-semibold">
                  {plan.maturityDate || "Calculated from start date"}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-[#17251f]/10 bg-white p-6">
            <p className="text-sm text-[#17251f]/45">Next contribution</p>
            <p className="mt-3 text-xl font-semibold">
              {formatMoney(contributionAmount)}
            </p>
            <p className="mt-1 text-xs text-[#17251f]/40">{nextContribution}</p>
          </div>

          <div className="rounded-3xl border border-[#17251f]/10 bg-white p-6">
            <p className="text-sm text-[#17251f]/45">Planned savings</p>
            <p className="mt-3 text-xl font-semibold">
              {formatMoney(plannedSavings)}
            </p>
            <p className="mt-1 text-xs text-[#17251f]/40">
              {plan.contributionPeriods || 0} contribution periods
            </p>
          </div>

          <div className="rounded-3xl border border-[#17251f]/10 bg-white p-6">
            <p className="text-sm text-[#17251f]/45">Start date</p>
            <p className="mt-3 text-xl font-semibold">
              {formatDate(plan.startDate)}
            </p>
            <p className="mt-1 text-xs text-[#17251f]/40">Plan start</p>
          </div>

          <div className="rounded-3xl border border-[#17251f]/10 bg-white p-6">
            <p className="text-sm text-[#17251f]/45">Plan status</p>
            <p className="mt-3 text-xl font-semibold">Ready to fund</p>
            <p className="mt-1 text-xs text-[#17251f]/40">
              Prototype mode
            </p>
          </div>
        </section>

        <section className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] border border-[#17251f]/10 bg-white p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#587565]">
                  Recent activity
                </p>
                <h2 className="mt-2 text-2xl font-semibold">
                  Transaction history
                </h2>
              </div>

              <span className="rounded-full bg-[#17251f]/5 px-3 py-1.5 text-xs font-semibold text-[#17251f]/55">
                {transactionCount} {transactionCount === 1 ? "transaction" : "transactions"}
              </span>
            </div>

            {recentTransactions.length === 0 ? (
              <div className="mt-7 rounded-2xl bg-[#f7f9f7] p-6 text-center">
                <p className="text-sm font-semibold">No contributions yet</p>
                <p className="mt-2 text-sm leading-6 text-[#17251f]/45">
                  Use Fund plan to record your first prototype contribution.
                </p>
              </div>
            ) : (
              <div className="mt-7 space-y-3">
                {recentTransactions.slice(0, 4).map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between gap-4 rounded-2xl bg-[#f7f9f7] p-4"
                  >
                    <div>
                      <p className="text-sm font-semibold">
                        {transaction.type || "Contribution"}
                      </p>
                      <p className="mt-1 text-xs text-[#17251f]/40">
                        {transaction.method || "Prototype payment"} ·{" "}
                        {transaction.date
                          ? new Date(transaction.date).toLocaleDateString(
                              "en-NG",
                              { day: "numeric", month: "short" },
                            )
                          : "Today"}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-semibold">
                        +{formatMoney(transaction.amount || 0)}
                      </p>
                      <p className="mt-1 text-xs text-[#587565]">
                        {transaction.status || "Successful"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-[2rem] bg-[#e8efe9] p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#587565]">
              Next steps
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              Your plan is configured.
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#17251f]/55">
              Review your plan before connecting a payment provider or recording
              a real contribution.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => navigate("/fund")}
                className="w-full rounded-full bg-[#17251f] px-5 py-3.5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Fund your plan
              </button>

              <button
                type="button"
                onClick={() => navigate("/withdraw")}
                disabled={currentBalance <= 0}
                className="w-full rounded-full border border-[#17251f]/15 bg-white px-5 py-3.5 text-sm font-semibold text-[#17251f] transition hover:bg-[#f7f9f7] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Withdraw
              </button>
            </div>
          </div>
        </section>

        <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-5 text-[#17251f]/35">
          This prototype does not hold or move customer funds. Payment,
          custody, withdrawals, and live transaction processing will be
          connected only after the appropriate structure is established.
        </p>
      </div>
    </main>
  )
}

export default Dashboard