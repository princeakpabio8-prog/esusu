import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"

type PaymentMethod = "bank" | "card"

type PlanData = {
  amount?: number
  frequency?: "daily" | "weekly" | "monthly"
  plannedSavings?: number
  duration?: string
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value)
}

function Funding() {
  const navigate = useNavigate()

  const [plan] = useState<PlanData>(() => {
    try {
      const saved = localStorage.getItem("esusu_active_plan")
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  })

  const [amount, setAmount] = useState(
    plan.amount && plan.amount > 0 ? String(plan.amount) : "20000",
  )
  const [method, setMethod] = useState<PaymentMethod>("bank")
  const [step, setStep] = useState<"amount" | "confirm" | "success">("amount")
  const [error, setError] = useState("")

  const contributionAmount = plan.amount || 20000
  const plannedSavings = plan.plannedSavings || 0

  const amountNumber = Number(amount) || 0

  const remainingAfterFunding = useMemo(() => {
    let current = 0

    try {
      const saved = localStorage.getItem("esusu_balance")
      current = Number(saved) || 0
    } catch {
      current = 0
    }

    return Math.max(0, plannedSavings - (current + amountNumber))
  }, [amountNumber, plannedSavings])

  const continueToConfirmation = () => {
    if (!Number.isFinite(amountNumber) || amountNumber <= 0) {
      setError("Enter an amount greater than ₦0.")
      return
    }

    if (plannedSavings > 0 && amountNumber > plannedSavings) {
      setError("This amount is above your planned savings target.")
      return
    }

    setError("")
    setStep("confirm")
  }

  const confirmFunding = () => {
    const now = new Date()
    const transaction = {
      id: `ESUSU-${Date.now()}`,
      type: "Contribution",
      amount: amountNumber,
      status: "Successful",
      method: method === "bank" ? "Bank transfer" : "Card",
      date: now.toISOString(),
    }

    let transactions: unknown[] = []

    try {
      const saved = localStorage.getItem("esusu_transactions")
      transactions = saved ? JSON.parse(saved) : []
      if (!Array.isArray(transactions)) transactions = []
    } catch {
      transactions = []
    }

    localStorage.setItem(
      "esusu_transactions",
      JSON.stringify([transaction, ...transactions]),
    )

    let currentBalance = 0

    try {
      currentBalance = Number(localStorage.getItem("esusu_balance")) || 0
    } catch {
      currentBalance = 0
    }

    localStorage.setItem(
      "esusu_balance",
      String(currentBalance + amountNumber),
    )

    localStorage.setItem(
      "esusu_last_funding",
      JSON.stringify(transaction),
    )

    setStep("success")
  }

  if (step === "success") {
    return (
      <main className="min-h-screen bg-[#f7f9f7] px-5 py-8 text-[#17251f] sm:px-8">
        <div className="mx-auto flex min-h-[80vh] max-w-xl items-center justify-center">
          <section className="w-full rounded-[2rem] border border-[#17251f]/10 bg-white p-7 text-center shadow-sm sm:p-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e8efe9] text-2xl font-bold text-[#17251f]">
              ✓
            </div>

            <p className="mt-7 text-sm font-semibold uppercase tracking-[0.14em] text-[#587565]">
              Contribution recorded
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight">
              {formatMoney(amountNumber)} added to your plan.
            </h1>

            <p className="mt-4 text-sm leading-6 text-[#17251f]/55">
              This is a simulated contribution for the ESUSU prototype. No
              real money was moved.
            </p>

            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="mt-8 w-full rounded-full bg-[#17251f] px-5 py-4 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Back to Dashboard
            </button>
          </section>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#f7f9f7] px-5 py-6 text-[#17251f] sm:px-8 sm:py-8 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <header className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="text-xl font-bold tracking-tight"
          >
            ESUSU
          </button>

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="rounded-full px-4 py-2 text-sm font-medium text-[#17251f]/60 hover:bg-white hover:text-[#17251f]"
          >
            ← Dashboard
          </button>
        </header>

        <section className="mx-auto max-w-2xl pt-10 text-center sm:pt-14">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#587565]">
            Fund your plan
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Make your next contribution.
          </h1>

          <p className="mt-4 text-base leading-7 text-[#17251f]/55">
            Choose an amount and payment method. This prototype simulates the
            payment and records the contribution in your local ledger.
          </p>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="rounded-[2rem] border border-[#17251f]/10 bg-white p-6 shadow-sm sm:p-8">
            {step === "amount" && (
              <>
                <label
                  htmlFor="funding-amount"
                  className="text-sm font-semibold"
                >
                  Contribution amount
                </label>

                <div className="relative mt-3">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base font-semibold text-[#17251f]/40">
                    ₦
                  </span>

                  <input
                    id="funding-amount"
                    type="number"
                    min="1"
                    step="100"
                    inputMode="decimal"
                    value={amount}
                    onChange={(event) => {
                      setAmount(event.target.value)
                      setError("")
                    }}
                    className="w-full rounded-2xl border border-[#17251f]/10 bg-[#f7f9f7] px-10 py-4 text-xl font-semibold outline-none focus:border-[#17251f]/30 focus:ring-4 focus:ring-[#17251f]/5"
                  />
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {[contributionAmount, contributionAmount * 2, contributionAmount * 5]
                    .filter((value, index, values) => values.indexOf(value) === index)
                    .map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => {
                          setAmount(String(value))
                          setError("")
                        }}
                        className="rounded-full bg-[#17251f]/5 px-4 py-2 text-xs font-semibold text-[#17251f]/65 hover:bg-[#17251f]/10"
                      >
                        {formatMoney(value)}
                      </button>
                    ))}
                </div>

                {error && (
                  <p className="mt-3 text-sm font-medium text-red-600">
                    {error}
                  </p>
                )}

                <div className="mt-8">
                  <p className="text-sm font-semibold">Payment method</p>

                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setMethod("bank")}
                      className={`rounded-2xl border p-4 text-left transition ${
                        method === "bank"
                          ? "border-[#17251f] bg-[#f7f9f7]"
                          : "border-[#17251f]/10 bg-white hover:bg-[#f7f9f7]"
                      }`}
                    >
                      <p className="font-semibold">Bank transfer</p>
                      <p className="mt-1 text-xs text-[#17251f]/45">
                        Simulated transfer
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setMethod("card")}
                      className={`rounded-2xl border p-4 text-left transition ${
                        method === "card"
                          ? "border-[#17251f] bg-[#f7f9f7]"
                          : "border-[#17251f]/10 bg-white hover:bg-[#f7f9f7]"
                      }`}
                    >
                      <p className="font-semibold">Card</p>
                      <p className="mt-1 text-xs text-[#17251f]/45">
                        Simulated card payment
                      </p>
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={continueToConfirmation}
                  className="mt-8 w-full rounded-full bg-[#17251f] px-5 py-4 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Review contribution
                </button>
              </>
            )}

            {step === "confirm" && (
              <>
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#587565]">
                  Review
                </p>

                <h2 className="mt-2 text-2xl font-semibold">
                  Confirm your contribution
                </h2>

                <div className="mt-7 divide-y divide-[#17251f]/10 rounded-2xl bg-[#f7f9f7] px-5">
                  <div className="flex items-center justify-between py-4">
                    <span className="text-sm text-[#17251f]/50">Amount</span>
                    <span className="font-semibold">{formatMoney(amountNumber)}</span>
                  </div>

                  <div className="flex items-center justify-between py-4">
                    <span className="text-sm text-[#17251f]/50">Method</span>
                    <span className="font-semibold">
                      {method === "bank" ? "Bank transfer" : "Card"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-4">
                    <span className="text-sm text-[#17251f]/50">Status</span>
                    <span className="font-semibold">Successful (simulated)</span>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-[#17251f]/10 p-4">
                  <p className="text-sm font-semibold">Prototype notice</p>
                  <p className="mt-1 text-xs leading-5 text-[#17251f]/50">
                    This confirmation does not charge a card or transfer real
                    funds. It only updates the prototype ledger.
                  </p>
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setStep("amount")}
                    className="rounded-full bg-[#17251f]/5 px-5 py-4 text-sm font-semibold text-[#17251f]/65 hover:bg-[#17251f]/10"
                  >
                    Change details
                  </button>

                  <button
                    type="button"
                    onClick={confirmFunding}
                    className="rounded-full bg-[#17251f] px-5 py-4 text-sm font-semibold text-white hover:opacity-90"
                  >
                    Confirm contribution
                  </button>
                </div>
              </>
            )}
          </div>

          <aside className="h-fit rounded-[2rem] bg-[#17251f] p-6 text-white shadow-sm sm:p-8">
            <p className="text-sm font-medium text-white/45">
              Plan summary
            </p>

            <h2 className="mt-3 text-2xl font-semibold">Pure Savings</h2>

            <div className="mt-8 space-y-6">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-white/35">
                  Regular contribution
                </p>
                <p className="mt-1 text-xl font-semibold">
                  {formatMoney(contributionAmount)} / {plan.frequency || "monthly"}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-white/35">
                  Planned savings
                </p>
                <p className="mt-1 text-xl font-semibold">
                  {formatMoney(plannedSavings)}
                </p>
              </div>

              <div className="border-t border-white/10 pt-6">
                <p className="text-xs uppercase tracking-[0.14em] text-white/35">
                  After this contribution
                </p>
                <p className="mt-2 text-2xl font-semibold">
                  {formatMoney(remainingAfterFunding)}
                </p>
                <p className="mt-2 text-xs leading-5 text-white/45">
                  Approximate amount remaining toward your planned savings
                  target.
                </p>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  )
}

export default Funding