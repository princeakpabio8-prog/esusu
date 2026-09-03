import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

type Step = "details" | "verify";

function Onboarding() {
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>("details");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  function handleDetails(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!fullName.trim() || !phone.trim() || !password.trim()) {
      return;
    }

    setStep("verify");
  }

  function handleVerification(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Prototype verification:
    // Any 6-digit code is accepted for now.
    // Real WhatsApp OTP delivery will be connected later.
    if (otp.trim().length !== 6) {
      return;
    }

    navigate("/models")
  }

  return (
    <main className="min-h-screen bg-[#f7f9f7] text-[#17251f]">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="text-xl font-bold tracking-tight text-[#17251f]"
        >
          ESUSU
        </button>

        <span className="text-sm text-[#17251f]/60">
          {step === "details" ? "01 / 02" : "02 / 02"}
        </span>
      </header>

      <section className="mx-auto grid min-h-[calc(100vh-100px)] max-w-7xl items-center gap-12 px-6 pb-12 lg:grid-cols-2">
        <div className="max-w-xl">
          <p className="mb-5 text-sm font-medium uppercase tracking-[0.18em] text-[#17251f]/55">
            Welcome to Esusu
          </p>

          <h1 className="text-5xl font-semibold leading-[1.02] tracking-[-0.04em] text-[#17251f] md:text-6xl">
            Start saving
            <br />
            without the
            <br />
            paperwork.
          </h1>

          <p className="mt-7 max-w-lg text-base leading-7 text-[#17251f]/60">
            Create your account in a few simple steps. You can complete
            additional verification later when it is required for a specific
            financial service.
          </p>
        </div>

        <div className="w-full max-w-xl justify-self-end rounded-[28px] border border-[#17251f]/10 bg-white p-7 shadow-[0_20px_60px_rgba(23,37,31,0.08)] md:p-10">
          {step === "details" ? (
            <>
              <div className="mb-8">
                <p className="mb-3 text-sm font-medium text-[#17251f]/50">
                  01 / 02
                </p>

                <h2 className="text-3xl font-semibold tracking-tight">
                  Create your account
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#17251f]/55">
                  Enter your basic details to get started. No BVN or NIN is
                  required at this stage.
                </p>
              </div>

              <form onSubmit={handleDetails} className="space-y-5">
                <div>
                  <label
                    htmlFor="fullName"
                    className="mb-2 block text-sm font-medium"
                  >
                    Full name
                  </label>

                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    className="w-full rounded-2xl border border-[#17251f]/10 bg-[#fbfcfb] px-4 py-4 outline-none transition focus:border-[#17251f]/30 focus:ring-2 focus:ring-[#17251f]/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-medium"
                  >
                    WhatsApp phone number
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(event) =>
                      setPhone(event.target.value.replace(/[^\d+]/g, ""))
                    }
                    placeholder="+234 801 234 5678"
                    autoComplete="tel"
                    className="w-full rounded-2xl border border-[#17251f]/10 bg-[#fbfcfb] px-4 py-4 outline-none transition focus:border-[#17251f]/30 focus:ring-2 focus:ring-[#17251f]/10"
                  />

                  <p className="mt-2 text-xs text-[#17251f]/45">
                    We&apos;ll send your verification code to this number on
                    WhatsApp.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium"
                  >
                    Email address{" "}
                    <span className="font-normal text-[#17251f]/40">
                      (optional)
                    </span>
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full rounded-2xl border border-[#17251f]/10 bg-[#fbfcfb] px-4 py-4 outline-none transition focus:border-[#17251f]/30 focus:ring-2 focus:ring-[#17251f]/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium"
                  >
                    Password
                  </label>

                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Create a secure password"
                    autoComplete="new-password"
                    className="w-full rounded-2xl border border-[#17251f]/10 bg-[#fbfcfb] px-4 py-4 outline-none transition focus:border-[#17251f]/30 focus:ring-2 focus:ring-[#17251f]/10"
                  />
                </div>

                <button
                  type="submit"
                  disabled={
                    !fullName.trim() || !phone.trim() || !password.trim()
                  }
                  className="w-full rounded-full bg-[#17251f] px-5 py-4 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Continue
                </button>
              </form>

              <p className="mt-6 text-center text-xs leading-5 text-[#17251f]/45">
                By continuing, you agree to the Esusu terms and acknowledge
                that financial services are subject to applicable terms and
                regulatory requirements.
              </p>
            </>
          ) : (
            <>
              <div className="mb-8">
                <p className="mb-3 text-sm font-medium text-[#17251f]/50">
                  02 / 02
                </p>

                <h2 className="text-3xl font-semibold tracking-tight">
                  Verify your WhatsApp
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#17251f]/55">
                  Enter the 6-digit code sent to your WhatsApp number.
                </p>

                <p className="mt-2 text-sm font-medium text-[#17251f]/70">
                  {phone}
                </p>
              </div>

              <form onSubmit={handleVerification} className="space-y-5">
                <div>
                  <label
                    htmlFor="otp"
                    className="mb-2 block text-sm font-medium"
                  >
                    WhatsApp verification code
                  </label>

                  <input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    autoComplete="one-time-code"
                    value={otp}
                    onChange={(event) =>
                      setOtp(event.target.value.replace(/\D/g, ""))
                    }
                    placeholder="000000"
                    className="w-full rounded-2xl border border-[#17251f]/10 bg-[#fbfcfb] px-4 py-4 text-center text-lg tracking-[0.45em] outline-none transition focus:border-[#17251f]/30 focus:ring-2 focus:ring-[#17251f]/10"
                  />
                </div>

                <button
                  type="submit"
                  disabled={otp.length !== 6}
                  className="w-full rounded-full bg-[#17251f] px-5 py-4 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Verify &amp; continue
                </button>
              </form>

              <button
                type="button"
                onClick={() => setStep("details")}
                className="mt-5 w-full text-center text-sm font-medium text-[#17251f]/60 transition hover:text-[#17251f]"
              >
                Change my details
              </button>

              <div className="mt-7 rounded-2xl bg-[#e8efea] p-4 text-xs leading-5 text-[#17251f]/55">
                <strong className="font-medium text-[#17251f]/70">
                  Prototype note:
                </strong>{" "}
                WhatsApp verification is simulated for now. The user only
                needs a normal WhatsApp account on the phone number entered.
                Real WhatsApp OTP delivery will be connected later.
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

export default Onboarding;