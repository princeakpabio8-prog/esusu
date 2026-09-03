import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"

type Transaction = {
  id: string
  type: string
  amount: number
  status: string
  method?: string
  date: string
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value)
}

function Withdrawal() {
  const navigate = useNavigate()

  const [balance] = useState(() => {
    try {
      return Number(localStorage.getItem("esusu_balance")) || 0
    } catch {
      return 0
    }
  })

  const [amount, setAmount] = useState("")
  const [accountName, setAccountName] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [bank, setBank] = useState("")
  const [step, setStep] = useState<"details" | "confirm" | "success">("details")
  const [error, setError] = useState("")

  const amountNumber = Number(amount) || 0
  const remainingBalance = useMemo(
    () => Math.max(0, balance - amountNumber),
    [balance, amountNumber],
  )

  const reviewWithdrawal = () => {
    setError("")

    if (balance <= 0) {
      setError("You do not have an available balance to withdraw.")
      return
    }

    if (!Number.isFinite(amountNumber) || amountNumber <= 0) {
      setError("Enter an amount greater than ₦0.")
      return
    }

    if (amountNumber > balance) {
      setError("The withdrawal amount cannot be greater than your available balance.")
      return
    }

    if (!accountName.trim() || !accountNumber.trim() || !bank.trim()) {
      setError("Enter your bank name, account name, and account number.")
      return
    }

    if (!/^\d{10}$/.test(accountNumber.trim())) {
      setError("Enter a valid 10-digit Nigerian bank account number.")
      return
    }

    setStep("confirm")
  }

  const confirmWithdrawal = () => {
    const now = new Date().toISOString()

    const transaction: Transaction = {
      id: `withdrawal-${Date.now()}`,
      type: "Withdrawal",
      amount: amountNumber,
      status: "Pending",
      method: "Bank transfer",
      date: now,
    }

    try {
      const currentBalance = Number(localStorage.getItem("esusu_balance")) || 0
      const nextBalance = Math.max(0, currentBalance - amountNumber)

      localStorage.setItem("esusu_balance", String(nextBalance))

      const saved = localStorage.getItem("esusu_transactions")
      const parsed = saved ? JSON.parse(saved) : []
      const transactions = Array.isArray(parsed) ? parsed : []

      localStorage.setItem(
        "esusu_transactions",
        JSON.stringify([transaction, ...transactions]),
      )

      localStorage.setItem(
        "esusu_last_withdrawal",
        JSON.stringify({
          ...transaction,
          accountName,
          accountNumber,
          bank,
        }),
      )
    } catch {
      // Keep the prototype usable even if local storage is unavailable.
    }

    setStep("success")
  }

  if (step === "success") {
    return (
      <main className="min-h-screen bg-[#f7f9f7] px-5 py-8 text-[#17251f] sm:px-8">
        <div className="mx-auto flex min-h-[80vh] max-w-xl items-center justify-center">
          <section className="w-full rounded-[2rem] border border-[#17251f]/10 bg-white p-7 text-center shadow-sm sm:p-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e8efe9] text-2xl font-bold">
              ✓
            </div>

            <p className="mt-7 text-sm font-semibold uppercase tracking-[0.14em] text-[#587565]">
              Withdrawal requested
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight">
              {formatMoney(amountNumber)} requested.
            </h1>

            <p className="mt-4 text-sm leading-6 text-[#17251f]/55">
              This is a simulated withdrawal for the ESUSU prototype. No real
              bank transfer was made.
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
            className="rounded-full px-4 py-2 text-sm font-medium text-[#17251f]/60 hover:bg-white"
          >
            ← Dashboard
          </button>
        </header>

        <section className="mx-auto max-w-2xl pt-10 text-center sm:pt-14">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#587565]">
            Withdraw savings
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Request a withdrawal.
          </h1>

          <p className="mt-4 text-base leading-7 text-[#17251f]/55">
            Choose how much to withdraw and where the simulated transfer should
            be sent.
          </p>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="rounded-[2rem] border border-[#17251f]/10 bg-white p-6 shadow-sm sm:p-8">
            {step === "details" && (
              <>
                <div className="rounded-2xl bg-[#f7f9f7] p-5">
                  <p className="text-xs uppercase tracking-[0.14em] text-[#17251f]/40">
                    Available balance
                  </p>
                  <p className="mt-2 text-3xl font-semibold">
                    {formatMoney(balance)}
                  </p>
                </div>

                <label
                  htmlFor="withdrawal-amount"
                  className="mt-7 block text-sm font-semibold"
                >
                  Withdrawal amount
                </label>

                <div className="relative mt-3">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-[#17251f]/40">
                    ₦
                  </span>

                  <input
                    id="withdrawal-amount"
                    type="number"
                    min="1"
                    max={balance}
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
                  {[balance, Math.round(balance / 2), Math.max(1000, Math.round(balance * 0.25))]
                    .filter((value, index, values) => value > 0 && values.indexOf(value) === index)
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

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="bank" className="text-sm font-semibold">
                      Bank
                    </label>
                    <input
                      id="bank"
                      value={bank}
                      onChange={(event) => setBank(event.target.value)}
                      placeholder="e.g. Access Bank"
                      className="mt-2 w-full rounded-2xl border border-[#17251f]/10 bg-[#f7f9f7] px-4 py-3.5 text-sm outline-none focus:border-[#17251f]/30"
                    />
                  </div>

                  <div>
                    <label htmlFor="account-name" className="text-sm font-semibold">
                      Account name
                    </label>
                    <input
                      id="account-name"
                      value={accountName}
                      onChange={(event) => setAccountName(event.target.value)}
                      placeholder="Your account name"
                      className="mt-2 w-full rounded-2xl border border-[#17251f]/10 bg-[#f7f9f7] px-4 py-3.5 text-sm outline-none focus:border-[#17251f]/30"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label htmlFor="account-number" className="text-sm font-semibold">
                    Account number
                  </label>
                  <input
                    id="account-number"
                    type="text"
                    inputMode="numeric"
                    maxLength={10}
                    value={accountNumber}
                    onChange={(event) => {
                      setAccountNumber(event.target.value.replace(/\D/g, ""))
                      setError("")
                    }}
                    placeholder="10-digit account number"
                    className="mt-2 w-full rounded-2xl border border-[#17251f]/10 bg-[#f7f9f7] px-4 py-3.5 text-sm outline-none focus:border-[#17251f]/30"
                  />
                </div>

                {error && (
                  <p className="mt-4 text-sm font-medium text-red-600">{error}</p>
                )}

                <button
                  type="button"
                  onClick={reviewWithdrawal}
                  className="mt-8 w-full rounded-full bg-[#17251f] px-5 py-4 text-sm font-semibold text-white hover:opacity-90"
                >
                  Review withdrawal
                </button>
              </>
            )}

            {step === "confirm" && (
              <>
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#587565]">
                  Review
                </p>

                <h2 className="mt-2 text-2xl font-semibold">
                  Confirm your withdrawal
                </h2>

                <div className="mt-7 divide-y divide-[#17251f]/10 rounded-2xl bg-[#f7f9f7] px-5">
                  <div className="flex items-center justify-between py-4">
                    <span className="text-sm text-[#17251f]/50">Amount</span>
                    <span className="font-semibold">{formatMoney(amountNumber)}</span>
                  </div>

                  <div className="flex items-center justify-between py-4">
                    <span className="text-sm text-[#17251f]/50">Destination</span>
                    <span className="max-w-[60%] text-right font-semibold">
                      {bank} · {accountNumber}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-4">
                    <span className="text-sm text-[#17251f]/50">Remaining balance</span>
                    <span className="font-semibold">{formatMoney(remainingBalance)}</span>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-[#17251f]/10 p-4">
                  <p className="text-sm font-semibold">Prototype notice</p>
                  <p className="mt-1 text-xs leading-5 text-[#17251f]/50">
                    The request will be recorded locally as a pending
                    withdrawal. No real bank transfer is made.
                  </p>
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setStep("details")}
                    className="rounded-full bg-[#17251f]/5 px-5 py-4 text-sm font-semibold text-[#17251f]/65 hover:bg-[#17251f]/10"
                  >
                    Change details
                  </button>

                  <button
                    type="button"
                    onClick={confirmWithdrawal}
                    className="rounded-full bg-[#17251f] px-5 py-4 text-sm font-semibold text-white hover:opacity-90"
                  >
                    Confirm withdrawal
                  </button>
                </div>
              </>
            )}
          </div>

          <aside className="h-fit rounded-[2rem] bg-[#17251f] p-6 text-white shadow-sm sm:p-8">
            <p className="text-sm font-medium text-white/45">
              Withdrawal summary
            </p>

            <p className="mt-4 text-sm text-white/55">Available now</p>
            <p className="mt-1 text-3xl font-semibold">{formatMoney(balance)}</p>

            <div className="mt-8 space-y-5">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-white/35">
                  Requested
                </p>
                <p className="mt-1 font-semibold">{formatMoney(amountNumber)}</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-white/35">
                  After request
                </p>
                <p className="mt-1 font-semibold">{formatMoney(remainingBalance)}</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-white/35">
                  Fee
                </p>
                <p className="mt-1 font-semibold">₦0 in prototype</p>
              </div>
            </div>
          </aside>
        </section>

        <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-5 text-[#17251f]/35">
          Withdrawal approval, eligibility rules, fees, custody, and live bank
          transfers will be connected only after the appropriate financial
          structure and payment integrations are established.
        </p>
      </div>
    </main>
  )
}

export default Withdrawal