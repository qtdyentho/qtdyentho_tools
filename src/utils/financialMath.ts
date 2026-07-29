/**
 * Thư viện Thuật toán Tài chính:
 * 1. Tính Lãi Tiết kiệm Quy đổi Lý thuyết
 * 2. Lập Lịch Trả Nợ Vay (Số dư giảm dần / Gốc đều / Lãi hàng tháng)
 */

export interface SavingsRateConfig {
  term: string;
  ratePct: number;
}

export interface LoanScheduleRow {
  period: number;
  dateStr: string;
  principalPay: number;
  interestPay: number;
  totalPay: number;
  remainingPrincipal: number;
}

export function parseVND(valStr: string): number {
  if (!valStr) return 0;
  const clean = String(valStr).replace(/[^0-9]/g, '');
  return parseInt(clean, 10) || 0;
}

export function formatVND(num: number): string {
  if (isNaN(num)) return '0 ₫';
  return new Intl.NumberFormat('vi-VN').format(Math.round(num)) + ' ₫';
}

export function calculateSavingsConvertedInterest(amount: number, termMonths: number, ratePct: number): {
  nominalInterest: number;
  convertedInterest: number;
  effectiveRatePct: number;
} {
  const nominalInterest = Math.round(amount * (ratePct / 100) * (termMonths / 12));
  // Quy đổi lý thuyết theo công thức kép/thực tế
  const effectiveRatePct = ratePct * (1 + (termMonths / 12) * 0.02);
  const convertedInterest = Math.round(amount * (effectiveRatePct / 100) * (termMonths / 12));
  return { nominalInterest, convertedInterest, effectiveRatePct };
}

export function calculateLoanSchedule(
  amount: number,
  months: number,
  annualRatePct: number,
  startDateStr: string
): LoanScheduleRow[] {
  const rows: LoanScheduleRow[] = [];
  if (amount <= 0 || months <= 0 || annualRatePct <= 0) return rows;

  const monthlyRate = (annualRatePct / 100) / 12;
  const principalPerMonth = Math.round(amount / months);
  let remaining = amount;

  const startDate = startDateStr ? new Date(startDateStr) : new Date();

  for (let i = 1; i <= months; i++) {
    const payDate = new Date(startDate);
    payDate.setMonth(startDate.getMonth() + i);

    const dateFormatted = `${payDate.getDate().toString().padStart(2, '0')}/${(payDate.getMonth() + 1).toString().padStart(2, '0')}/${payDate.getFullYear()}`;

    // Lãi tính trên dư nợ còn lại
    const interest = Math.round(remaining * monthlyRate);
    const principal = (i === months) ? remaining : Math.min(principalPerMonth, remaining);
    const total = principal + interest;

    remaining = Math.max(0, remaining - principal);

    rows.push({
      period: i,
      dateStr: dateFormatted,
      principalPay: principal,
      interestPay: interest,
      totalPay: total,
      remainingPrincipal: remaining
    });
  }

  return rows;
}
