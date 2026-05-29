"use client";

import { useState, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const focusRing = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#21c1a2]";
const inputClass = `h-12 w-full rounded-lg border border-black/15 px-4 text-[15px] transition-colors focus:border-[#21c1a2] ${focusRing}`;

declare global {
  interface Window {
    kakao?: { Postcode?: any; };
  }
}

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || "/";
  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "login";

  const supabase = createSupabaseBrowserClient();

  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 공통 & 로그인 상태
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 회원가입 전용 상태
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [fullName, setFullName] = useState("");
  
  // 전화번호 3칸 분할
  const [phone1, setPhone1] = useState("010");
  const [phone2, setPhone2] = useState("");
  const [phone3, setPhone3] = useState("");

  // 기본 주소
  const [zipcode, setZipcode] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");

  // 사업자 토글 및 상태
  const [isBusiness, setIsBusiness] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [department, setDepartment] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [bizZipcode, setBizZipcode] = useState("");
  const [bizAddress1, setBizAddress1] = useState("");
  const [bizAddress2, setBizAddress2] = useState("");
  const [bizType, setBizType] = useState(""); // 업태
  const [bizCategory, setBizCategory] = useState(""); // 업종
  const [bizRegNo, setBizRegNo] = useState("");
  const [taxEmail, setTaxEmail] = useState("");

  // 약관 동의
  const [agreePrivacy, setAgreedPrivacy] = useState(false);

  // 카카오 우편번호 팝업
  const handleOpenPostcode = (type: "home" | "biz") => {
    const Postcode = window.kakao?.Postcode;
    if (!Postcode) return alert("우편번호 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");

    new Postcode({
      oncomplete: (data: any) => {
        let fullAddress = data.userSelectedType === "R" ? data.roadAddress : data.jibunAddress;
        if (data.userSelectedType === "R") {
          let extra = "";
          if (data.bname && /[동로가]$/.test(data.bname)) extra += data.bname;
          if (data.buildingName && data.apartment === "Y") extra += extra ? `, ${data.buildingName}` : data.buildingName;
          if (extra) fullAddress += ` (${extra})`;
        }
        
        if (type === "home") {
          setZipcode(data.zonecode);
          setAddress1(fullAddress);
        } else {
          setBizZipcode(data.zonecode);
          setBizAddress1(fullAddress);
        }
      }
    }).open();
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 🚨 Vercel 에러 원인 해결: supabase가 없을 때의 안전장치 추가!
    if (!supabase) {
      setError("시스템 연결 지연. 잠시 후 다시 시도해주세요.");
      setLoading(false);
      return;
    }

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      setLoading(false);
      return;
    }
    router.push(nextUrl);
    router.refresh();
  };

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 🚨 Vercel 에러 원인 해결: supabase가 없을 때의 안전장치 추가!
    if (!supabase) {
      setError("시스템 연결 지연. 잠시 후 다시 시도해주세요.");
      setLoading(false);
      return;
    }

    // 검증 로직
    if (password.length < 6 || password.length > 20) {
      setError("비밀번호는 6자 이상, 20자 이내로 설정해주세요.");
      setLoading(false); return;
    }
    if (password !== passwordConfirm) {
      setError("비밀번호 확인이 일치하지 않습니다.");
      setLoading(false); return;
    }
    if (!phone2 || !phone3) {
      setError("연락처를 정확히 입력해주세요.");
      setLoading(false); return;
    }
    if (!agreePrivacy) {
      setError("개인정보 처리방침에 동의하셔야 가입이 가능합니다.");
      setLoading(false); return;
    }

    const fullPhone = `${phone1}-${phone2}-${phone3}`;

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: fullPhone,
          zipcode,
          address1,
          address2,
          is_business: isBusiness,
          company_name: isBusiness ? companyName : null,
          department: isBusiness ? department : null,
          job_title: isBusiness ? jobTitle : null,
          biz_zipcode: isBusiness ? bizZipcode : null,
          biz_address1: isBusiness ? bizAddress1 : null,
          biz_address2: isBusiness ? bizAddress2 : null,
          biz_type: isBusiness ? bizType : null,
          biz_category: isBusiness ? bizCategory : null,
          biz_reg_no: isBusiness ? bizRegNo : null,
          tax_email: isBusiness ? taxEmail : null,
        }
      }
    });

    if (signUpError) {
      setError(signUpError.message.includes("already registered") ? "이미 가입된 이메일입니다." : signUpError.message);
      setLoading(false);
      return;
    }

    alert("가입이 완료되었습니다. 환영합니다!");
    router.push(nextUrl);
    router.refresh();
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-20">
      <Script src="https://t1.kakaocdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js" />
      
      <div className="mb-10 text-center">
        <h1 className="text-[32px] font-bold tracking-tight text-[#0B0F0E]">
          {mode === "login" ? "로그인" : "회원가입"}
        </h1>
        <p className="mt-3 text-[15px] text-black/60">
          {mode === "login" ? "턴키하우스 계정으로 로그인하세요." : "프로젝트 상담 및 결제를 위해 계정을 생성합니다."}
        </p>
      </div>

      <div className="bg-white p-8 md:p-10 rounded-2xl border border-black/10 shadow-sm">
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-[14px] font-semibold text-red-600 border border-red-100">
            {error}
          </div>
        )}

        {mode === "login" ? (
          // --- 로그인 폼 ---
          <form onSubmit={handleLogin} className="space-y-5">
            <label className="block space-y-2">
              <span className="text-[13px] font-bold text-black/70">아이디 (이메일 주소)</span>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className={inputClass} placeholder="example@company.com" />
            </label>
            <label className="block space-y-2">
              <span className="text-[13px] font-bold text-black/70">비밀번호</span>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className={inputClass} />
            </label>
            <button type="submit" disabled={loading} className={`mt-4 h-14 w-full rounded-xl bg-[#0B0F0E] text-[16px] font-bold text-white transition-transform hover:scale-[1.02] disabled:opacity-50 ${focusRing}`}>
              {loading ? "로그인 중..." : "로그인"}
            </button>
            <div className="text-center pt-4">
              <button type="button" onClick={() => { setMode("signup"); setError(null); }} className="text-[14px] font-bold text-black/50 hover:text-[#21c1a2]">계정이 없으신가요? 회원가입 하기</button>
            </div>
          </form>
        ) : (
          // --- 회원가입 폼 ---
          <form onSubmit={handleSignup} className="space-y-8">
            {/* 1. 기본 정보 */}
            <div className="space-y-5">
              <h3 className="text-[16px] font-bold text-[#0B0F0E] border-b border-black/10 pb-2">필수 정보</h3>
              
              <label className="block space-y-2">
                <span className="text-[13px] font-bold text-black/70">아이디 (이메일 주소)*</span>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className={inputClass} placeholder="example@company.com" />
              </label>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block space-y-2">
                  <span className="text-[13px] font-bold text-black/70">비밀번호*</span>
                  <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="6~20자 이내 입력" className={inputClass} minLength={6} maxLength={20} />
                </label>
                <label className="block space-y-2">
                  <span className="text-[13px] font-bold text-black/70">비밀번호 확인*</span>
                  <input type="password" required value={passwordConfirm} onChange={e => setPasswordConfirm(e.target.value)} placeholder="비밀번호 다시 입력" className={inputClass} minLength={6} maxLength={20} />
                </label>
              </div>

              <label className="block space-y-2">
                <span className="text-[13px] font-bold text-black/70">담당자 이름*</span>
                <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)} className={inputClass} placeholder="홍길동" />
              </label>

              <div className="space-y-2">
                <span className="text-[13px] font-bold text-black/70">연락처*</span>
                <div className="flex items-center gap-2">
                  <input type="text" required maxLength={4} value={phone1} onChange={e => setPhone1(e.target.value)} className={`${inputClass} text-center px-1`} />
                  <span className="text-black/30">-</span>
                  <input type="text" required maxLength={4} value={phone2} onChange={e => setPhone2(e.target.value.replace(/[^0-9]/g, ''))} className={`${inputClass} text-center px-1`} />
                  <span className="text-black/30">-</span>
                  <input type="text" required maxLength={4} value={phone3} onChange={e => setPhone3(e.target.value.replace(/[^0-9]/g, ''))} className={`${inputClass} text-center px-1`} />
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[13px] font-bold text-black/70">기본 주소</span>
                <div className="flex gap-2">
                  <input type="text" readOnly value={zipcode} placeholder="우편번호" className={`${inputClass} w-32 bg-black/5`} />
                  <button type="button" onClick={() => handleOpenPostcode("home")} className={`h-12 px-4 bg-white border border-black/15 rounded-lg text-[13px] font-bold hover:bg-black/5 ${focusRing}`}>우편번호 찾기</button>
                </div>
                <input type="text" readOnly value={address1} placeholder="기본 주소" className={`${inputClass} bg-black/5`} />
                <input type="text" value={address2} onChange={e => setAddress2(e.target.value)} placeholder="상세 주소 입력" className={inputClass} />
              </div>
            </div>

            {/* 2. 사업자 토글 */}
            <div className="space-y-5 pt-4">
              <h3 className="text-[16px] font-bold text-[#0B0F0E] border-b border-black/10 pb-2">혹시 사업자이신가요? (선택)</h3>
              <div className="flex gap-2">
                <button type="button" onClick={() => setIsBusiness(true)} className={`flex-1 h-12 rounded-lg border text-[14px] font-bold transition-all ${isBusiness ? "bg-[#21c1a2] border-[#21c1a2] text-[#07211d]" : "bg-white border-black/15 text-black/60 hover:bg-black/5"}`}>네, 사업자입니다.</button>
                <button type="button" onClick={() => setIsBusiness(false)} className={`flex-1 h-12 rounded-lg border text-[14px] font-bold transition-all ${!isBusiness ? "bg-[#0B0F0E] border-[#0B0F0E] text-white" : "bg-white border-black/15 text-black/60 hover:bg-black/5"}`}>아니오, 개인입니다.</button>
              </div>
            </div>

            {/* 3. 사업자 정보 입력칸 (토글 시 노출) */}
            {isBusiness && (
              <div className="space-y-5 bg-[#FAFAFA] p-6 rounded-xl border border-black/5 animate-in fade-in slide-in-from-top-4 duration-300">
                <p className="text-[12px] font-bold text-[#21c1a2] mb-4 tracking-widest uppercase">세금계산서 발급 및 계약용 정보</p>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block space-y-2"><span className="text-[12px] font-bold text-black/70">회사명*</span><input type="text" required={isBusiness} value={companyName} onChange={e => setCompanyName(e.target.value)} className={inputClass} /></label>
                  <label className="block space-y-2"><span className="text-[12px] font-bold text-black/70">사업자등록번호*</span><input type="text" required={isBusiness} value={bizRegNo} onChange={e => setBizRegNo(e.target.value)} placeholder="000-00-00000" className={inputClass} /></label>
                  <label className="block space-y-2"><span className="text-[12px] font-bold text-black/70">부서명</span><input type="text" value={department} onChange={e => setDepartment(e.target.value)} className={inputClass} /></label>
                  <label className="block space-y-2"><span className="text-[12px] font-bold text-black/70">직급/직책</span><input type="text" value={jobTitle} onChange={e => setJobTitle(e.target.value)} className={inputClass} /></label>
                  <label className="block space-y-2"><span className="text-[12px] font-bold text-black/70">업태*</span><input type="text" required={isBusiness} value={bizType} onChange={e => setBizType(e.target.value)} placeholder="예: 서비스업" className={inputClass} /></label>
                  <label className="block space-y-2"><span className="text-[12px] font-bold text-black/70">업종*</span><input type="text" required={isBusiness} value={bizCategory} onChange={e => setBizCategory(e.target.value)} placeholder="예: 경영컨설팅" className={inputClass} /></label>
                </div>

                <label className="block space-y-2 pt-2">
                  <span className="text-[12px] font-bold text-black/70">세금계산서 수신용 이메일*</span>
                  <input type="email" required={isBusiness} value={taxEmail} onChange={e => setTaxEmail(e.target.value)} className={inputClass} placeholder="tax@company.com" />
                </label>

                <div className="space-y-2 pt-2">
                  <span className="text-[12px] font-bold text-black/70">사업장 소재지*</span>
                  <div className="flex gap-2">
                    <input type="text" readOnly required={isBusiness} value={bizZipcode} placeholder="우편번호" className={`${inputClass} w-32 bg-white`} />
                    <button type="button" onClick={() => handleOpenPostcode("biz")} className={`h-12 px-4 bg-white border border-black/15 rounded-lg text-[13px] font-bold hover:bg-black/5 ${focusRing}`}>우편번호 찾기</button>
                  </div>
                  <input type="text" readOnly required={isBusiness} value={bizAddress1} placeholder="사업장 기본 주소" className={`${inputClass} bg-white`} />
                  <input type="text" value={bizAddress2} onChange={e => setBizAddress2(e.target.value)} placeholder="상세 주소 입력" className={`${inputClass} bg-white`} />
                </div>
              </div>
            )}

            {/* 4. 약관 동의 및 가입 버튼 */}
            <div className="pt-6 border-t border-black/10">
              <label className="flex items-start gap-3 cursor-pointer group mb-6">
                <input type="checkbox" required checked={agreePrivacy} onChange={e => setAgreedPrivacy(e.target.checked)} className="mt-1 w-5 h-5 text-[#21c1a2] border-gray-300 rounded focus:ring-[#21c1a2] cursor-pointer" />
                <div className="text-[14px] leading-relaxed text-black/70 font-medium select-none">
                  (필수) <Link href="/privacy" target="_blank" className="font-bold underline hover:text-[#21c1a2]">개인정보 처리방침</Link> 및 <Link href="/terms" target="_blank" className="font-bold underline hover:text-[#21c1a2]">이용약관</Link>에 동의합니다.
                </div>
              </label>

              <button type="submit" disabled={loading} className={`h-14 w-full rounded-xl bg-[#21c1a2] text-[16px] font-bold text-[#07211d] transition-transform hover:scale-[1.02] hover:bg-[#1db197] disabled:opacity-50 disabled:hover:scale-100 ${focusRing}`}>
                {loading ? "가입 처리 중..." : "회원가입 완료하기"}
              </button>
              <div className="text-center pt-5">
                <button type="button" onClick={() => { setMode("login"); setError(null); }} className="text-[14px] font-bold text-black/50 hover:text-[#21c1a2]">이미 계정이 있으신가요? 로그인 하기</button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-black/50">로딩 중...</div>}>
      <AuthContent />
    </Suspense>
  );
}
