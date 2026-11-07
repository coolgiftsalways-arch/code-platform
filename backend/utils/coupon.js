// Test coupon: makes any paid registration cost ₹1 (Razorpay's minimum),
// so you can try real payments cheaply.
//
// It only works while TEST_COUPON_CODE is set, e.g. in backend/.env:
//   TEST_COUPON_CODE=DEVTEST1
// Remove it (and restart) before going live.

export const TEST_COUPON_AMOUNT = 1; // rupees

export function testCouponCode() {
  return String(process.env.TEST_COUPON_CODE || "").trim().toUpperCase();
}

export function isValidCoupon(code) {
  const active = testCouponCode();
  return Boolean(active) && String(code || "").trim().toUpperCase() === active;
}

// What this registration should cost, in rupees.
export function priceFor(challenge, couponCode) {
  if (!challenge.fee) return 0;
  return isValidCoupon(couponCode) ? Math.min(TEST_COUPON_AMOUNT, challenge.fee) : challenge.fee;
}
