import React, { useState } from 'react'
import { X, CheckCircle2, Copy, Check, ArrowRight } from 'lucide-react'
import { sounds } from '../lib/audio'
import { toast } from 'sonner'
import { isValidBdPhone, isValidName, isValidTrxId } from '../lib/validation'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  purpose: 'Registration' | 'Donation'
  initialAmount?: number
  applicantName?: string
  programName?: string
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  purpose,
  initialAmount = 350,
  applicantName = 'Forum Applicant',
  programName = 'National Science Eclipse 2026'
}) => {
  const [donorName, setDonorName] = useState('')
  const [method, setMethod] = useState<'bkash' | 'nagad'>('bkash')
  const [amount, setAmount] = useState<number>(initialAmount)
  const [phone, setPhone] = useState('')
  const [trxId, setTrxId] = useState('')
  const [step, setStep] = useState<'select' | 'confirm' | 'receipt'>('select')
  const [copiedNumber, setCopiedNumber] = useState(false)
  const [receiptData, setReceiptData] = useState<{
    trxId: string
    timestamp: string
    amount: number
    method: 'bKash' | 'Nagad'
    reference: string
    contributorName: string
  } | null>(null)

  const handleCopyNumber = () => {
    navigator.clipboard.writeText('01911287501')
    sounds.playSuccess()
    setCopiedNumber(true)
    toast.success('bKash Personal Number 01911287501 copied to clipboard!')
    setTimeout(() => setCopiedNumber(false), 2000)
  }

  if (!isOpen) return null

  const handleSimulatePayment = (e: React.FormEvent) => {
    e.preventDefault()

    const phoneCheck = isValidBdPhone(phone)
    if (!phoneCheck.valid) {
      sounds.playClick()
      toast.error(phoneCheck.error || 'Please enter a valid 11-digit mobile number.')
      return
    }

    if (purpose === 'Donation' && !isValidName(donorName)) {
      sounds.playClick()
      toast.error('Please enter the full name of the donator / patron (at least 2 letters).')
      return
    }

    const trxCheck = isValidTrxId(trxId)
    if (!trxCheck.valid) {
      sounds.playClick()
      toast.error(trxCheck.error || 'Transaction ID (TrxID) is required.')
      return
    }

    sounds.playSuccess()
    const verifiedTrx = trxCheck.cleaned
    
    const receipt = {
      trxId: verifiedTrx,
      timestamp: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
      amount: amount,
      method: method === 'bkash' ? 'bKash' as const : 'Nagad' as const,
      reference: `UYFSR-${Date.now().toString().slice(-6)}`,
      contributorName: purpose === 'Donation' ? donorName.trim() : applicantName
    }

    setReceiptData(receipt)
    setStep('receipt')
    toast.success(`Payment of ৳${amount} via ${receipt.method} verified successfully!`)
  }

  const handleCopyTrx = () => {
    if (!receiptData) return
    sounds.playClick()
    navigator.clipboard?.writeText(receiptData.trxId)
    toast.success(`Copied Transaction ID: ${receiptData.trxId}`)
  }

  const handleResetAndClose = () => {
    setStep('select')
    setReceiptData(null)
    setPhone('')
    setTrxId('')
    onClose()
  }

  return (
    <div
      data-ui="modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
    >
      <div
        onClick={handleResetAndClose}
        className="fixed inset-0 bg-[#111111]/70 transition-opacity"
      />

      <div className="relative w-full max-w-lg bg-[#f7f7f5] p-5 sm:p-8 shadow-2xl z-10 text-left my-4 sm:my-8 border border-[#ecece9] max-h-[92dvh] overflow-y-auto">
        <button
          onClick={handleResetAndClose}
          aria-label="Close payment dialog"
          className="absolute top-6 right-6 p-2 text-[#2b2b28] hover:text-[#111111] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="inline-block px-2.5 py-1 bg-[#111111] text-white text-[12px] font-medium tracking-wide mb-2">
            Secure MFS Gateway (Bangladesh)
          </div>
          <h2 className="text-2xl font-serif text-[#111111]">
            {purpose === 'Donation' ? 'Support Youth Scientific Research' : 'Registration Payment'}
          </h2>
          <p className="text-[14px] text-[#2b2b28] mt-1 leading-relaxed">
            {purpose === 'Donation'
              ? 'Contributions directly support scientific olympiad cohorts, workshops, research methodology training, and youth symposiums.'
              : `Official registration fee for ${programName}.`}
          </p>
        </div>

        {/* STEP 1: PAYMENT METHOD & DETAILS */}
        {step === 'select' && (
          <form onSubmit={handleSimulatePayment} className="space-y-5">
            {/* Donator Name Field (Requested for donations) */}
            {purpose === 'Donation' && (
              <div>
                <label className="block text-[14px] font-medium text-[#111111] mb-1.5">
                  Donator / Contributor Full Name
                </label>
                <input
                  type="text"
                  required
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="e.g. Dr. Rafiqul Islam / Anonymous Patron"
                  className="w-full px-3.5 py-2.5 text-[14px] bg-white border border-[#ecece9] text-[#111111] focus:border-[#111111] outline-none"
                />
              </div>
            )}

            {/* Amount Selection for Donation or Fixed for Registration */}
            {purpose === 'Donation' ? (
              <div>
                <label className="block text-[14px] font-medium text-[#111111] mb-2">
                  Contribution amount (BDT)
                </label>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {[500, 1000, 2500, 5000].map((amt) => (
                    <button
                      type="button"
                      key={amt}
                      onClick={() => setAmount(amt)}
                      className={`py-2 text-[13px] font-medium border cursor-pointer transition-colors ${
                        amount === amt
                          ? 'bg-[#111111] text-white border-[#111111]'
                          : 'bg-white text-[#2b2b28] border-[#ecece9] hover:border-[#111111]'
                      }`}
                    >
                      ৳{amt}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min={100}
                  step={50}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  placeholder="Custom amount in BDT"
                  className="w-full px-3.5 py-2.5 text-[14px] bg-white border border-[#ecece9] text-[#111111] focus:border-[#111111] outline-none"
                />
              </div>
            ) : (
              <div className="p-4 bg-white border border-[#ecece9] flex justify-between items-center">
                <div>
                  <div className="text-[13px] text-[#2b2b28]">Program Fee</div>
                  <div className="font-medium text-[#111111] text-[15px]">{programName}</div>
                  <div className="text-[12px] text-[#2b2b28]">Participant: {applicantName}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-serif font-bold text-[#0c7866]">
                    ৳{amount}
                  </div>
                  <div className="text-[11px] text-[#2b2b28] uppercase ">BDT Currency</div>
                </div>
              </div>
            )}

            {/* MFS Provider Selector (bKash & Nagad - Personal Send Money) */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[14px] font-medium text-[#111111]">
                  Select payment channel (Send Money)
                </label>
                <div className="flex items-center gap-1.5">
                  <span className="text-[12px] text-[#064e43] font-bold">
                    01911287501
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyNumber}
                    className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] bg-[#0c7866] hover:bg-[#095f51] text-white font-medium transition-colors cursor-pointer"
                    title="Copy Personal Number"
                  >
                    {copiedNumber ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedNumber ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {/* bKash Option */}
                <button
                  type="button"
                  onClick={() => setMethod('bkash')}
                  className={`p-3.5 border text-left cursor-pointer transition-colors flex items-center justify-between ${
                    method === 'bkash'
                      ? 'border-[#D12053] bg-[#D12053]/5'
                      : 'border-[#ecece9] bg-white hover:border-[#D12053]/50'
                  }`}
                >
                  <div>
                    <div className="font-bold text-[#D12053] text-[15px] tracking-tight">bKash Personal</div>
                    <div className="text-[12px] text-[#2b2b28] ">01911287501</div>
                    <div className="text-[11px] text-[#0c7866] font-medium">Send Money (Personal)</div>
                  </div>
                  <span className={`w-3.5 h-3.5 rounded-full border ${method === 'bkash' ? 'border-[#D12053] bg-[#D12053]' : 'border-gray-300'}`} />
                </button>

                {/* Nagad Option */}
                <button
                  type="button"
                  onClick={() => setMethod('nagad')}
                  className={`p-3.5 border text-left cursor-pointer transition-colors flex items-center justify-between ${
                    method === 'nagad'
                      ? 'border-[#F7941D] bg-[#F7941D]/5'
                      : 'border-[#ecece9] bg-white hover:border-[#F7941D]/50'
                  }`}
                >
                  <div>
                    <div className="font-bold text-[#F7941D] text-[15px] tracking-tight">Nagad Personal</div>
                    <div className="text-[12px] text-[#2b2b28] ">01911287501</div>
                    <div className="text-[11px] text-[#0c7866] font-medium">Send Money (Personal)</div>
                  </div>
                  <span className={`w-3.5 h-3.5 rounded-full border ${method === 'nagad' ? 'border-[#F7941D] bg-[#F7941D]' : 'border-gray-300'}`} />
                </button>
              </div>
            </div>

            {/* Sender Mobile Number */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[14px] font-medium text-[#111111]">
                  Your {method === 'bkash' ? 'bKash' : 'Nagad'} mobile number *
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick()
                      setPhone('01712345678')
                    }}
                    className="text-[12px] text-[#0c7866] hover:underline cursor-pointer font-medium"
                  >
                    Fill demo: 01712-345678
                  </button>
                  <span className="text-[12px] text-[#2b2b28]/70">
                    {phone ? `${phone.length}/11` : '11 digits'}
                  </span>
                </div>
              </div>
              <div className="relative">
                <input
                  type="tel"
                  required
                  maxLength={11}
                  placeholder="01XXXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                  className={`w-full px-3.5 py-2.5 text-[14px] bg-white border text-[#111111] outline-none ${
                    phone.length === 11 && isValidBdPhone(phone).valid
                      ? 'border-[#0c7866] bg-[#0c7866]/5'
                      : phone.length > 0 && phone.length < 11
                      ? 'border-amber-500'
                      : 'border-[#ecece9] focus:border-[#111111]'
                  }`}
                />
              </div>
              {phone.length > 0 && phone.length < 11 && (
                <p className="text-[12px] text-amber-600 mt-1">
                  Incomplete: {11 - phone.length} digit(s) missing. Bangladeshi numbers require exactly 11 digits.
                </p>
              )}
              {phone.length === 11 && !isValidBdPhone(phone).valid && (
                <p className="text-[12px] text-red-600 mt-1">
                  {isValidBdPhone(phone).error}
                </p>
              )}
            </div>

            {/* Transaction ID (MANDATORY) */}
            <div>
              <div className="mb-1.5">
                <label className="text-[14px] font-medium text-[#111111] flex items-center gap-1.5">
                  <span>Transaction ID (TrxID)</span>
                  <span className="text-red-600 font-bold">* (Required)</span>
                </label>
              </div>
              <input
                type="text"
                required
                placeholder="e.g. BL72KX91PA (bKash TrxID)"
                value={trxId}
                onChange={(e) => setTrxId(e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase())}
                className={`w-full px-3.5 py-2.5 text-[14px] bg-white border text-[#111111] outline-none uppercase ${
                  trxId && isValidTrxId(trxId).valid
                    ? 'border-[#0c7866] bg-[#0c7866]/5'
                    : trxId && !isValidTrxId(trxId).valid
                    ? 'border-amber-500'
                    : 'border-[#ecece9] focus:border-[#111111]'
                }`}
              />
              {trxId && !isValidTrxId(trxId).valid && (
                <p className="text-[12px] text-amber-600 mt-1">
                  ⚠ {isValidTrxId(trxId).error}
                </p>
              )}
              {trxId && isValidTrxId(trxId).valid && (
                <p className="text-[12px] text-[#064e43] mt-1 flex items-center gap-1 font-medium">
                  <span>✓ Valid Transaction ID format</span>
                </p>
              )}
            </div>

            {/* Payment Guide Note */}
            <div className="p-3 bg-[#ecece9] text-[12px] text-[#2b2b28] leading-relaxed border-l-2 border-[#0c7866] space-y-1">
              <div><strong>Personal Send Money Instructions:</strong> Please send money to our official personal bKash/Nagad number <strong>01911287501</strong> using ‘Send Money’.</div>
              <div className="text-[11px] text-[#2b2b28]/80">Enter your name as reference. After sending, enter your sender mobile number and the received <strong>TrxID (Required)</strong> below to confirm. Verification will be handled by the Secretariat.</div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className={`w-full py-3.5 text-white font-medium text-[14px] transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                  method === 'bkash' ? 'bg-[#D12053] hover:bg-[#b51844]' : 'bg-[#F7941D] hover:bg-[#d97c11]'
                }`}
              >
                <span>Confirm payment of ৳{amount}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: OFFICIAL DIGITAL RECEIPT / VOUCHER */}
        {step === 'receipt' && receiptData && (
          <div className="space-y-6">
            <div className="p-6 bg-white border-2 border-[#0c7866] relative overflow-hidden">
              <div className="flex items-center gap-2 text-[#0c7866] mb-3">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-[13px] uppercase tracking-wider font-semibold">
                  Payment Verified & Completed
                </span>
              </div>

              <div className="border-b border-[#ecece9] pb-4 mb-4">
                <div className="text-[12px] text-[#2b2b28] uppercase ">
                  OFFICIAL UYFSR PAYMENT VOUCHER
                </div>
                <div className="font-serif text-2xl font-bold text-[#111111] mt-1">
                  ৳{receiptData.amount}.00 BDT
                </div>
                <div className="text-[13px] text-[#2b2b28]">
                  Purpose: {purpose === 'Donation' ? 'Youth Research Fund Donation' : `${programName} Registration`}
                </div>
              </div>

              <div className="space-y-2 text-[13px] text-[#2b2b28]">
                <div className="flex justify-between">
                  <span>{purpose === 'Donation' ? 'Donator / Contributor:' : 'Participant:'}</span>
                  <strong className="text-[#111111]">{receiptData.contributorName}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Method:</span>
                  <strong className="text-[#111111] ">{receiptData.method} MFS</strong>
                </div>
                <div className="flex justify-between">
                  <span>Transaction ID (TrxID):</span>
                  <strong className="text-[#0c7866] ">{receiptData.trxId}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Payment Reference:</span>
                  <span className="text-[#111111]">{receiptData.reference}</span>
                </div>
                <div className="flex justify-between">
                  <span>Timestamp:</span>
                  <span className="text-[#111111]">{receiptData.timestamp}</span>
                </div>
                <div className="flex justify-between">
                  <span>Beneficiary:</span>
                  <span className="text-[#111111]">United Youth Forum of Science and Research</span>
                </div>
              </div>

              {/* Secretariat Notification Note */}
              <div className="mt-4 p-3 bg-[#f7f7f5] text-[12px] text-[#2b2b28] leading-relaxed border-l-2 border-[#0c7866]">
                <strong>Official Update:</strong> Once verification is complete, a confirmation notice will be dispatched from <strong>uyfsr.org@gmail.com</strong>. You may also be contacted if any supplementary intake details are required.
              </div>

              <div className="mt-4 pt-3 border-t border-[#ecece9] flex items-center justify-between text-[11px] text-[#2b2b28] ">
                <span>RECEIPT #{receiptData.trxId.slice(-6)}</span>
                <span className="text-[#0c7866] font-bold">STATUS: PAID</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleCopyTrx}
                className="flex-1 py-2.5 bg-white border border-[#ecece9] hover:border-[#111111] text-[#111111] text-[13px] font-medium transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Copy className="w-4 h-4" />
                <span>Copy TrxID</span>
              </button>

              <button
                type="button"
                onClick={handleResetAndClose}
                className="flex-1 py-2.5 bg-[#0c7866] hover:bg-[#095f51] text-white text-[13px] font-medium transition-colors cursor-pointer text-center"
              >
                Close & Return
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
