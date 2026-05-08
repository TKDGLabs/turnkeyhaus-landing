"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#21c1a2]";

type AuthMode = "signin" | "signup";

function getFriendlyAuthError(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("invalid login credentials")) {
    return "이메일 또는 비밀번호를 확인해 주세요.";
  }

  if (normalized.includes("email not confirmed")) {
    return "이메일 인증을 완료한 뒤 로그인해 주세요.";
  }

  if (normalized.includes("already registered") || normalized.includes("user already registered")) {
    return "이미 가입된 이메일입니다. 로그인으로 진행해 주세요.";
  }

  if (normalized.includes("password")) {
    return "비밀번호 조건을 확인해 주세요. 8자 이상으로 입력하면 가장 안전합니다.";
  }

  return "계정 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.";
}

export default function AuthPage() {
  const router = useRouter();
  const [nextPath, setNextPath] = useState("/store");
  const safeNextPath = useMemo(() => (nextPath.startsWith("/") ? nextPath : "/store"), [nextPath]);

  const [mode, setMode] = useState<AuthMode>("signin");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("");
  const [businessRegistrationNumber, setBusinessRegistrationNumber] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const next = params.get("next");
    if (next) {
      setNextPath(next);
    }
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;

    setError(null);
    setNotice(null);

    if (!supabase) {
      setError(
        "현재 계정 기능을 확인 중입니다. 운영 플랜 신청은 상담 폼 또는 카카오톡으로도 남길 수 있습니다."
      );
      return;
    }

    if (!email.trim() || !password) {
      setError("이메일과 비밀번호를 입력해 주세요.");
      return;
    }

    if (mode === "signup") {
      if (password.length < 8) {
        setError("비밀번호는 8자 이상으로 입력해 주세요.");
        return;
      }

      if (password !== passwordConfirm) {
        setError("비밀번호 확인이 일치하지 않습니다.");
        return;
      }

      if (!firstName.trim()) {
        setError("이름을 입력해 주세요.");
        return;
      }
    }

    setLoading(true);

    try {
      if (mode === "signin") {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password
        });

        if (signInError) {
          setError(getFriendlyAuthError(signInError.message));
          return;
        }

        router.replace(safeNextPath);
        router.refresh();
        return;
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            company_name: companyName.trim(),
            phone_number: phoneNumber.trim(),
            role: role.trim(),
            business_registration_number: businessRegistrationNumber.trim()
          }
        }
      });

      if (signUpError) {
        setError(getFriendlyAuthError(signUpError.message));
        return;
      }

      if (!data.session) {
        setNotice("회원가입이 접수되었습니다. 이메일 인증 후 로그인해 주세요.");
        return;
      }

      setNotice("회원가입이 완료되었습니다. 운영 플랜 신청 페이지로 이동합니다.");
      router.replace(safeNextPath);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-[760px] px-5 py-14 text-[#0B0F0E] sm:px-6 md:py-20">
      <div className="mb-10 space-y-4 border-b border-black/10 pb-7">
        <p className="text-xs font-semibold tracking-[0.14em] text-black/48">[ 계정 관리 ]</p>
        <h1 className="text-[34px] font-semibold leading-[1.2] tracking-tight md:text-[48px]">운영 플랜 신청용 계정 관리</h1>
        <p className="max-w-[72ch] break-keep text-[16px] leading-[1.8] text-black/68">
          계정은 선택 사항입니다. 계정을 만들면 담당자 정보와 결제 내역을 다음 상담 때 더 빠르게 확인할 수 있습니다.
        </p>
      </div>

      <section className="border border-black/15 bg-white p-6 md:p-7">
        <div className="mb-5 flex gap-2">
          <button
            type="button"
            onClick={() => setMode("signin")}
            className={`h-10 border px-4 text-[14px] font-semibold transition-colors ${focusRing} ${
              mode === "signin" ? "border-[#21c1a2] bg-[#21c1a2] text-[#07211d]" : "border-black/15 text-black/65 hover:bg-black/[0.03]"
            }`}
          >
            로그인
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`h-10 border px-4 text-[14px] font-semibold transition-colors ${focusRing} ${
              mode === "signup" ? "border-[#21c1a2] bg-[#21c1a2] text-[#07211d]" : "border-black/15 text-black/65 hover:bg-black/[0.03]"
            }`}
          >
            회원가입
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block space-y-1.5 sm:col-span-2">
              <span className="text-[13px] font-semibold tracking-[0.06em] text-black/58">이메일*</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="hello@company.com"
                required
                className={`h-11 w-full border border-black/16 px-3 text-[15px] placeholder:text-black/35 ${focusRing}`}
              />
            </label>

            <label className="block space-y-1.5">
              <span className="text-[13px] font-semibold tracking-[0.06em] text-black/58">비밀번호*</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="8자 이상"
                required
                className={`h-11 w-full border border-black/16 px-3 text-[15px] placeholder:text-black/35 ${focusRing}`}
              />
            </label>

            {mode === "signup" ? (
              <label className="block space-y-1.5">
                <span className="text-[13px] font-semibold tracking-[0.06em] text-black/58">비밀번호 확인*</span>
                <input
                  type="password"
                  value={passwordConfirm}
                  onChange={(event) => setPasswordConfirm(event.target.value)}
                  placeholder="비밀번호 재입력"
                  required
                  className={`h-11 w-full border border-black/16 px-3 text-[15px] placeholder:text-black/35 ${focusRing}`}
                />
              </label>
            ) : null}
          </div>

          {mode === "signup" ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block space-y-1.5">
                <span className="text-[13px] font-semibold tracking-[0.06em] text-black/58">담당자명*</span>
                <input
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  placeholder="홍길동"
                  required
                  className={`h-11 w-full border border-black/16 px-3 text-[15px] placeholder:text-black/35 ${focusRing}`}
                />
              </label>

              <label className="block space-y-1.5">
                <span className="text-[13px] font-semibold tracking-[0.06em] text-black/58">상호명</span>
                <input
                  value={companyName}
                  onChange={(event) => setCompanyName(event.target.value)}
                  placeholder="티케이디지랩스 주식회사"
                  className={`h-11 w-full border border-black/16 px-3 text-[15px] placeholder:text-black/35 ${focusRing}`}
                />
              </label>

              <label className="block space-y-1.5">
                <span className="text-[13px] font-semibold tracking-[0.06em] text-black/58">전화번호</span>
                <input
                  value={phoneNumber}
                  onChange={(event) => setPhoneNumber(event.target.value)}
                  placeholder="010-1234-5678"
                  className={`h-11 w-full border border-black/16 px-3 text-[15px] placeholder:text-black/35 ${focusRing}`}
                />
              </label>

              <label className="block space-y-1.5">
                <span className="text-[13px] font-semibold tracking-[0.06em] text-black/58">직함</span>
                <input
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                  placeholder="대표 / 실장 / 담당자"
                  className={`h-11 w-full border border-black/16 px-3 text-[15px] placeholder:text-black/35 ${focusRing}`}
                />
              </label>

              <label className="block space-y-1.5 sm:col-span-2">
                <span className="text-[13px] font-semibold tracking-[0.06em] text-black/58">사업자번호</span>
                <input
                  value={businessRegistrationNumber}
                  onChange={(event) => setBusinessRegistrationNumber(event.target.value)}
                  placeholder="123-45-67890"
                  className={`h-11 w-full border border-black/16 px-3 text-[15px] placeholder:text-black/35 ${focusRing}`}
                />
              </label>
            </div>
          ) : null}

          {error ? <p className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
          {notice ? <p className="border border-[#bfeee2] bg-[#ecfbf7] px-3 py-2 text-sm text-[#0a5a4a]">{notice}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className={`inline-flex h-12 w-full items-center justify-center border border-[#21c1a2] bg-[#21c1a2] text-[15px] font-semibold text-[#07211d] transition-colors hover:bg-[#1db197] disabled:cursor-not-allowed disabled:border-black/10 disabled:bg-black/10 disabled:text-black/40 ${focusRing}`}
          >
            {loading ? "처리 중..." : mode === "signin" ? "로그인" : "회원가입"}
          </button>
        </form>

        <div className="mt-5 border-t border-black/10 pt-4 text-[13px] leading-[1.7] text-black/58">
          <p>
            운영 플랜 신청이 급하신 경우{" "}
            <Link href={safeNextPath} className={`font-semibold text-[#21c1a2] hover:text-[#1db197] ${focusRing}`}>
              신청 페이지로 바로 이동
            </Link>
            할 수 있습니다.
          </p>
          <div className="mt-2 flex flex-wrap gap-3 text-[13px] font-semibold">
            <Link href="/terms" className={`text-[#21c1a2] hover:text-[#1db197] ${focusRing}`}>
              서비스 이용약관
            </Link>
            <Link href="/privacy" className={`text-[#21c1a2] hover:text-[#1db197] ${focusRing}`}>
              개인정보 처리방침
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
