import React, { useState, useEffect } from 'react'
import {
  ArrowLeft,
  ShieldCheck,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  KeyRound,
  Mail,
  CheckCircle2,
  RefreshCw,
  Sparkles
} from 'lucide-react'
import { sounds } from '../lib/audio'
import { toast } from 'sonner'
import {
  apiLogin,
  apiForgotPasswordRequest,
  apiResetPassword,
  type ForgotPasswordRequestResponse
} from '../lib/api'
import { LumaDotBackground } from './effects/LumaDotBackground'

interface ExecutiveLoginPageProps {
  onBackToHome: () => void
  onLoginSuccess: (officerName: string) => void
}

export const ExecutiveLoginPage: React.FC<ExecutiveLoginPageProps> = ({
  onBackToHome,
  onLoginSuccess
}) => {
  // Mode state: 'login' | 'forgot'
  const [mode, setMode] = useState<'login' | 'forgot'>('login')

  // Login form state
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Forgot password form state (Strict Email OTP Verification)
  const [forgotStep, setForgotStep] = useState<'identify' | 'verify' | 'success'>('identify')
  const [forgotIdentifier, setForgotIdentifier] = useState('')
  const [recoveryOfficer, setRecoveryOfficer] = useState<ForgotPasswordRequestResponse | null>(null)
  const [otpCode, setOtpCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  // Resend OTP countdown timer
  useEffect(() => {
    if (resendCooldown <= 0) return
    const timer = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [resendCooldown])

  // Switch to Forgot Password view
  const handleSwitchToForgot = () => {
    sounds.playClick()
    setErrorMsg(null)
    setForgotIdentifier(identifier.trim())
    setForgotStep('identify')
    setRecoveryOfficer(null)
    setOtpCode('')
    setNewPassword('')
    setConfirmPassword('')
    setMode('forgot')
  }

  // Switch back to Login view
  const handleBackToLogin = (prefillPass?: string) => {
    sounds.playClick()
    setErrorMsg(null)
    if (recoveryOfficer) {
      setIdentifier(recoveryOfficer.ecardId || recoveryOfficer.officerName)
    }
    if (prefillPass) {
      setPassword(prefillPass)
    }
    setMode('login')
    setForgotStep('identify')
  }

  // Handle standard Executive Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    const trimmedId = identifier.trim()
    const trimmedPass = password.trim()

    if (!trimmedId) {
      setErrorMsg('Please enter your Executive E-ID Card Serial, Official Email, or Appointed Name.')
      return
    }

    if (!trimmedPass) {
      setErrorMsg('Please enter your confidential Security Passkey / PIN.')
      return
    }

    setLoading(true)
    try {
      const res = await apiLogin(trimmedId, trimmedPass)
      sounds.playSuccess()
      toast.success(`Executive credential verified: Welcome ${res.officer.name} (${res.officer.title}).`)
      onLoginSuccess(res.officer.name)
    } catch (err: any) {
      sounds.playClick()
      const msg = err.message || 'Invalid officer credentials. Access denied.'
      setErrorMsg(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  // Handle Step 1 of Recovery: Locate Officer Record & Issue OTP to Official Email
  const handleRequestRecovery = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    const trimmed = forgotIdentifier.trim()
    if (!trimmed) {
      setErrorMsg('Please enter your Executive E-ID, official email, or appointed name.')
      return
    }

    setLoading(true)
    try {
      const res = await apiForgotPasswordRequest(trimmed)
      sounds.playClick()
      setRecoveryOfficer(res)
      setForgotStep('verify')
      setResendCooldown(60)
      toast.success(`Verification code dispatched to ${res.maskedEmail}`)
    } catch (err: any) {
      sounds.playClick()
      const msg = err.message || 'No matching officer record found in council registry.'
      setErrorMsg(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  // Resend OTP code
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || !recoveryOfficer) return
    setLoading(true)
    setErrorMsg(null)
    try {
      const targetId = recoveryOfficer.ecardId || recoveryOfficer.officerName || forgotIdentifier
      const res = await apiForgotPasswordRequest(targetId)
      setRecoveryOfficer(res)
      setResendCooldown(60)
      sounds.playClick()
      toast.success('A fresh 6-digit OTP code has been dispatched to your official email.')
    } catch (err: any) {
      toast.error(err.message || 'Failed to resend code.')
    } finally {
      setLoading(false)
    }
  }

  // Handle Step 2 of Recovery: Verify Email OTP & Save New Passkey
  const handleResetPasskey = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (!recoveryOfficer) return

    const trimmedOtp = otpCode.trim()
    if (!trimmedOtp) {
      setErrorMsg('Please enter the 6-digit verification code sent to your official email.')
      return
    }

    const trimmedNew = newPassword.trim()
    const trimmedConfirm = confirmPassword.trim()

    if (!trimmedNew) {
      setErrorMsg('Please enter a new confidential security passkey.')
      return
    }

    if (trimmedNew.length < 6) {
      setErrorMsg('Security passkey must be at least 6 characters in length.')
      return
    }

    if (trimmedNew !== trimmedConfirm) {
      setErrorMsg('New passkey and confirmation passkey do not match.')
      return
    }

    setLoading(true)
    try {
      await apiResetPassword({
        officerId: recoveryOfficer.officerId,
        resetToken: recoveryOfficer.resetToken,
        otpCode: trimmedOtp,
        newPassword: trimmedNew,
        confirmPassword: trimmedConfirm
      })

      sounds.playSuccess()
      toast.success('Security passkey successfully updated.')
      setForgotStep('success')
    } catch (err: any) {
      sounds.playClick()
      const msg = err.message || 'Passkey update authorization failed. Invalid or expired code.'
      setErrorMsg(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[100svh] bg-[#f7f7f5] text-[#111111] flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-white border-b border-[#ecece9] sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-3.5 sm:py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onBackToHome}
              className="px-3 py-1.5 bg-[#ecece9] hover:bg-[#e0e0dc] text-[#111111] text-[13px] font-medium transition-colors cursor-pointer flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to home</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="font-serif text-xl font-bold tracking-tight text-[#111111]">
                UYFSR
              </span>
              <span className="hidden sm:inline text-[13px] text-[#2b2b28]">
                Executive Workspace
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
        <LumaDotBackground dotSpacing={32} dotSize={1.8} mouseRadius={180} />

        <div className="w-full max-w-md bg-white p-5 sm:p-9 border border-[#ecece9] space-y-6 shadow-sm relative z-10 text-left">
          {/* ========================================================= */}
          {/* VIEW A: STANDARD LOGIN                                    */}
          {/* ========================================================= */}
          {mode === 'login' && (
            <>
              <div>
                <div className="w-12 h-12 bg-[#0c7866]/10 text-[#0c7866] flex items-center justify-center mb-4">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#111111]">
                  Executive Login
                </h1>
                <p className="text-[13px] text-[#2b2b28] mt-1.5 leading-relaxed">
                  Sign in with your appointed Executive E-ID credentials and confidential security passkey.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-[13px] flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4 text-left">
                <div>
                  <label className="block text-[13px] font-medium text-[#111111] mb-1.5">
                    Executive E-ID, Official Email, or Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#2b2b28]/60" />
                    <input
                      type="text"
                      required
                      autoFocus
                      placeholder="e.g. Mustafiz or UYFSR-CP-001"
                      value={identifier}
                      onChange={(e) => {
                        setIdentifier(e.target.value)
                        if (errorMsg) setErrorMsg(null)
                      }}
                      className="w-full pl-9 pr-3.5 py-2.5 text-[14px] bg-[#f7f7f5] border border-[#ecece9] text-[#111111] focus:border-[#111111] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[13px] font-medium text-[#111111]">
                      Security Passkey / PIN
                    </label>
                    <button
                      type="button"
                      onClick={handleSwitchToForgot}
                      className="text-[12px] text-[#0c7866] hover:text-[#095f51] hover:underline font-medium cursor-pointer transition-colors"
                    >
                      Forgot passkey?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#2b2b28]/60" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter assigned security passkey"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        if (errorMsg) setErrorMsg(null)
                      }}
                      className="w-full pl-9 pr-10 py-2.5 text-[14px] bg-[#f7f7f5] border border-[#ecece9] text-[#111111] focus:border-[#111111] outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2b2b28]/60 hover:text-[#111111] cursor-pointer"
                      aria-label={showPassword ? 'Hide passkey' : 'Show passkey'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-[#0c7866] hover:bg-[#095f51] text-white text-[14px] font-medium transition-colors cursor-pointer text-center disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {loading ? 'Authenticating...' : 'Sign in to Workspace'}
                  </button>
                </div>
              </form>

              <div className="p-3.5 bg-[#f7f7f5] border border-[#ecece9] text-[12px] text-[#2b2b28] leading-relaxed">
                <strong className="text-[#111111] block mb-1">Restricted Access Notice:</strong>
                This portal is strictly reserved for appointed UYFSR Executive Council members, Advisors, and Secretariat. Each official holds unique authorized credentials. Unauthorized login attempts are logged.
              </div>
            </>
          )}

          {/* ========================================================= */}
          {/* VIEW B: FORGOT / RESET PASSKEY (EMAIL OTP ONLY)           */}
          {/* ========================================================= */}
          {mode === 'forgot' && (
            <>
              {/* SUB-STEP 1: IDENTIFY OFFICER */}
              {forgotStep === 'identify' && (
                <div className="space-y-5">
                  <div>
                    <div className="w-12 h-12 bg-[#0c7866]/10 text-[#0c7866] flex items-center justify-center mb-4">
                      <KeyRound className="w-6 h-6" />
                    </div>
                    <h1 className="font-serif text-2xl font-bold text-[#111111]">
                      Passkey Recovery
                    </h1>
                    <p className="text-[13px] text-[#2b2b28] mt-1.5 leading-relaxed">
                      Enter your appointed Executive E-ID, official email, or registered name to receive a confidential 6-digit verification code.
                    </p>
                  </div>

                  {errorMsg && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-[13px] flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <form onSubmit={handleRequestRecovery} className="space-y-4">
                    <div>
                      <label className="block text-[13px] font-medium text-[#111111] mb-1.5">
                        Officer Identification
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#2b2b28]/60" />
                        <input
                          type="text"
                          required
                          autoFocus
                          placeholder="e.g. UYFSR-EXEC-002 or mustafiz@uyfsr.org"
                          value={forgotIdentifier}
                          onChange={(e) => {
                            setForgotIdentifier(e.target.value)
                            if (errorMsg) setErrorMsg(null)
                          }}
                          className="w-full pl-9 pr-3.5 py-2.5 text-[14px] bg-[#f7f7f5] border border-[#ecece9] text-[#111111] focus:border-[#111111] outline-none"
                        />
                      </div>
                      <p className="text-[11px] text-[#2b2b28]/60 mt-1">
                        A confidential 6-digit authorization code will be dispatched strictly to your registered email address.
                      </p>
                    </div>

                    <div className="pt-2 space-y-2.5">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-[#0c7866] hover:bg-[#095f51] text-white text-[14px] font-medium transition-colors cursor-pointer text-center disabled:opacity-60 flex items-center justify-center gap-2"
                      >
                        {loading ? 'Verifying Registry...' : 'Send Verification Code'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleBackToLogin()}
                        className="w-full py-2.5 bg-transparent hover:bg-[#f7f7f5] border border-[#ecece9] text-[#111111] text-[13px] font-medium transition-colors cursor-pointer text-center"
                      >
                        ← Return to Sign In
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* SUB-STEP 2: EMAIL OTP VERIFICATION & SET NEW PASSKEY */}
              {forgotStep === 'verify' && recoveryOfficer && (
                <div className="space-y-5">
                  <div>
                    <div className="w-12 h-12 bg-[#0c7866]/10 text-[#0c7866] flex items-center justify-center mb-4">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <h1 className="font-serif text-2xl font-bold text-[#111111]">
                      Authorize New Passkey
                    </h1>
                    <p className="text-[13px] text-[#2b2b28] mt-1.5 leading-relaxed">
                      Enter the 6-digit OTP code sent to your official email to reset your security passkey.
                    </p>
                  </div>

                  {/* Officer Badge Preview */}
                  <div className="p-3.5 bg-[#f7f7f5] border border-[#ecece9] rounded-none">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[14px] font-bold text-[#111111]">
                        {recoveryOfficer.officerName}
                      </span>
                      {recoveryOfficer.ecardId && (
                        <span className="text-[11px] font-mono px-2 py-0.5 bg-[#0c7866]/10 text-[#0c7866] border border-[#0c7866]/20 font-semibold">
                          {recoveryOfficer.ecardId}
                        </span>
                      )}
                    </div>
                    <div className="text-[12px] text-[#2b2b28]/80 font-medium">
                      {recoveryOfficer.officerTitle}
                    </div>
                    <div className="mt-2 pt-2 border-t border-[#ecece9] text-[11px] text-[#2b2b28]/70 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#0c7866]" />
                      <span>
                        Code sent to: <strong className="text-[#111111]">{recoveryOfficer.maskedEmail}</strong>
                      </span>
                    </div>
                  </div>

                  {errorMsg && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-[13px] flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <form onSubmit={handleResetPasskey} className="space-y-4">
                    {/* 6-Digit Email OTP Field */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="block text-[13px] font-medium text-[#111111]">
                          6-Digit Email Verification Code
                        </label>
                        <button
                          type="button"
                          disabled={resendCooldown > 0 || loading}
                          onClick={handleResendOtp}
                          className="text-[12px] text-[#0c7866] hover:underline disabled:text-[#2b2b28]/40 disabled:no-underline font-medium cursor-pointer inline-flex items-center gap-1"
                        >
                          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                          <span>
                            {resendCooldown > 0 ? `Resend (${resendCooldown}s)` : 'Resend code'}
                          </span>
                        </button>
                      </div>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        autoFocus
                        placeholder="e.g. 583921"
                        value={otpCode}
                        onChange={(e) => {
                          setOtpCode(e.target.value.replace(/\D/g, ''))
                          if (errorMsg) setErrorMsg(null)
                        }}
                        className="w-full px-3.5 py-2.5 text-[16px] font-mono tracking-widest text-center bg-[#f7f7f5] border border-[#ecece9] text-[#111111] focus:border-[#111111] outline-none"
                      />
                      <p className="text-[11px] text-[#2b2b28]/60">
                        Check your inbox or spam folder for the one-time code. Valid for 15 minutes.
                      </p>
                    </div>

                    {/* New Passkey */}
                    <div>
                      <label className="block text-[13px] font-medium text-[#111111] mb-1.5">
                        New Security Passkey
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#2b2b28]/60" />
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          required
                          minLength={6}
                          placeholder="Minimum 6 characters"
                          value={newPassword}
                          onChange={(e) => {
                            setNewPassword(e.target.value)
                            if (errorMsg) setErrorMsg(null)
                          }}
                          className="w-full pl-9 pr-10 py-2.5 text-[14px] bg-[#f7f7f5] border border-[#ecece9] text-[#111111] focus:border-[#111111] outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2b2b28]/60 hover:text-[#111111] cursor-pointer"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Passkey */}
                    <div>
                      <label className="block text-[13px] font-medium text-[#111111] mb-1.5">
                        Confirm New Passkey
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#2b2b28]/60" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          minLength={6}
                          placeholder="Re-enter new passkey"
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value)
                            if (errorMsg) setErrorMsg(null)
                          }}
                          className="w-full pl-9 pr-10 py-2.5 text-[14px] bg-[#f7f7f5] border border-[#ecece9] text-[#111111] focus:border-[#111111] outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2b2b28]/60 hover:text-[#111111] cursor-pointer"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="pt-2 space-y-2.5">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-[#0c7866] hover:bg-[#095f51] text-white text-[14px] font-medium transition-colors cursor-pointer text-center disabled:opacity-60 flex items-center justify-center gap-2"
                      >
                        {loading ? 'Updating Passkey...' : 'Update Passkey & Secure Account'}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          sounds.playClick()
                          setForgotStep('identify')
                          setErrorMsg(null)
                        }}
                        className="w-full py-2.5 bg-transparent hover:bg-[#f7f7f5] border border-[#ecece9] text-[#111111] text-[13px] font-medium transition-colors cursor-pointer text-center"
                      >
                        ← Change Officer Record
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* SUB-STEP 3: SUCCESS CONFIRMATION */}
              {forgotStep === 'success' && recoveryOfficer && (
                <div className="text-center py-4 space-y-5">
                  <div className="w-16 h-16 bg-[#0c7866]/10 text-[#0c7866] flex items-center justify-center mx-auto rounded-full">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div>
                    <h2 className="font-serif text-2xl font-bold text-[#111111]">
                      Passkey Updated!
                    </h2>
                    <p className="text-[13px] text-[#2b2b28] mt-2 leading-relaxed">
                      Your confidential security passkey for <strong>{recoveryOfficer.officerName}</strong> has been saved in the UYFSR Central Council registry.
                    </p>
                  </div>

                  <div className="p-3 bg-[#f7f7f5] border border-[#ecece9] text-[12px] text-[#2b2b28]/80 text-left">
                    <div className="flex items-center gap-2 font-medium text-[#111111] mb-1">
                      <ShieldCheck className="w-4 h-4 text-[#0c7866]" />
                      <span>Security Audit Logged</span>
                    </div>
                    <span>
                      A confirmation email has been logged and sent to your registered address. You can now access your executive workspace immediately.
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleBackToLogin(newPassword)}
                    className="w-full py-3 bg-[#0c7866] hover:bg-[#095f51] text-white text-[14px] font-medium transition-colors cursor-pointer text-center flex items-center justify-center gap-2"
                  >
                    <span>Proceed to Sign In</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#ecece9] bg-white py-6 text-center text-[13px] text-[#2b2b28]">
        United Youth Forum of Science and Research (UYFSR) · Central Secretariat System
      </footer>
    </div>
  )
}
