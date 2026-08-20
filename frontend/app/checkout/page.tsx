"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import Image from "next/image";
import Link from "next/link";
import { Loader2, Lock, ShieldCheck } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import {
  createOrder,
  formatPrice,
  getAvailableCoupons,
  getSiteSettings,
  previewCoupon,
  ApiRequestError,
  type ApiOrder,
  type AvailableCoupon,
  type CouponPreview,
} from "@/lib/api";
import { PrimaryCtaButton } from "@/app/components/PrimaryCtaButton";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open: () => void; on: (event: string, handler: () => void) => void };
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  order_id?: string;
  name: string;
  description: string;
  handler: () => void;
  modal?: { ondismiss?: () => void };
  theme?: { color?: string };
}

type FormState = {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
};

const EMPTY_FORM: FormState = {
  customer_name: "",
  customer_email: "",
  customer_phone: "",
};

export type AddressState = {
  house_no: string;
  area: string;
  landmark: string;
  pincode: string;
  city: string;
  state: string;
};

const EMPTY_ADDRESS: AddressState = {
  house_no: "",
  area: "",
  landmark: "",
  pincode: "",
  city: "",
  state: "Uttar Pradesh",
};

export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

// Only these keys render inline under a specific field — anything else the
// backend sends back (e.g. "items", "items.0.quantity" for a stock/quantity
// failure) is a real, specific error that still needs to reach the customer.
const CUSTOMER_FIELD_KEYS: (keyof FormState)[] = [
  "customer_name",
  "customer_email",
  "customer_phone",
];
// coupon_code also renders inline (next to the coupon input), so it's kept
// out of the generic banner list the same way customer fields are.
const INLINE_FIELD_KEYS: string[] = [...CUSTOMER_FIELD_KEYS, "coupon_code", "shipping_address"];

type Status = "idle" | "submitting" | "error";

export default function CheckoutPage() {
  const { items, subtotal, clearCart, openDrawer } = useCart();
  const router = useRouter();

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [address, setAddress] = useState<AddressState>(EMPTY_ADDRESS);
  const [addressErrors, setAddressErrors] = useState<Partial<Record<keyof AddressState, string>>>({});
  const [couponCode, setCouponCode] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [infraError, setInfraError] = useState<string | null>(null);

  const [availableCoupons, setAvailableCoupons] = useState<AvailableCoupon[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<CouponPreview | null>(null);
  const [couponStatus, setCouponStatus] = useState<"idle" | "checking">("idle");
  const [couponError, setCouponError] = useState<string | null>(null);
  const [paymentOption, setPaymentOption] = useState<"advance" | "full">("advance");
  const [advancePercent, setAdvancePercent] = useState<number>(20);

  useEffect(() => {
    getAvailableCoupons().then(setAvailableCoupons);
    getSiteSettings().then((settings) => {
      if (settings?.razorpay_advance_percent) {
        setAdvancePercent(settings.razorpay_advance_percent);
      }
    });
  }, []);

  const cartItemPayload = items.map((i) => ({
    product_id: i.productId,
    variant_id: i.variantId || null,
    variant_name: i.variantName || null,
    quantity: i.quantity,
  }));

  async function handleApplyCoupon(codeOverride?: string) {
    const code = (codeOverride ?? couponCode).trim();
    if (!code) return;

    setCouponCode(code.toUpperCase());
    setCouponStatus("checking");
    setCouponError(null);
    try {
      const preview = await previewCoupon({ coupon_code: code, items: cartItemPayload });
      setAppliedCoupon(preview);
    } catch (err) {
      setAppliedCoupon(null);
      if (err instanceof ApiRequestError) {
        setCouponError(err.errors?.coupon_code?.[0] ?? err.message);
      } else {
        setCouponError("Could not check that coupon. Please try again.");
      }
    } finally {
      setCouponStatus("idle");
    }
  }

  function handleCouponInputChange(value: string) {
    setCouponCode(value.toUpperCase());
    // Any edit invalidates the last preview — force a fresh Apply before
    // the (possibly different) code is trusted again.
    if (appliedCoupon) setAppliedCoupon(null);
    if (couponError) setCouponError(null);
  }

  const discountAmount = appliedCoupon?.discount_amount ?? 0;
  const totalAfterDiscount = appliedCoupon
    ? appliedCoupon.total_after_discount
    : subtotal;

  if (items.length === 0) {
    return (
      <div className="pt-12 md:pt-16 pb-24 px-6 max-w-screen-2xl mx-auto w-full text-center">
        <h1 className="text-3xl md:text-4xl font-black text-ink uppercase tracking-tight mb-4">
          Your cart is empty
        </h1>
        <Link
          href="/shop"
          className="text-xs font-bold text-ink uppercase tracking-widest hover:text-[var(--brand-red)] transition-colors border-b border-[var(--brand-red)] pb-1"
        >
          Browse Catalog
        </Link>
      </div>
    );
  }

  function handleChange(field: keyof FormState, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleAddressChange(field: keyof AddressState, value: string) {
    setAddress((a) => ({ ...a, [field]: value }));
    if (addressErrors[field]) {
      setAddressErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  // Opens the Razorpay Checkout.js popup for the order's advance amount.
  function openRazorpay(order: ApiOrder) {
    if (typeof window === "undefined" || !window.Razorpay) {
      setInfraError(
        "The payment gateway failed to load in your browser. Your order was NOT charged. Please refresh the page and try again."
      );
      setStatus("error");
      return;
    }

    const tokenParam = order.access_token ? `&token=${encodeURIComponent(order.access_token)}` : "";

    const rzp = new window.Razorpay({
      key: order.razorpay.key_id,
      amount: order.razorpay.amount,
      currency: order.razorpay.currency,
      order_id: order.razorpay.order_id ?? undefined,
      name: "RevvMotiv",
      description: `Advance payment — Order #${order.id}`,
      handler: () => {
        clearCart();
        router.push(`/order-confirmation/${order.id}?just_paid=1${tokenParam}`);
      },
      modal: {
        ondismiss: () => {
          // DO NOT clear cart on dismiss — allow customer to retry
          setStatus("error");
          setInfraError("Payment window was closed before completing checkout. Your cart has been preserved.");
        },
      },
      theme: { color: "#c9182b" },
    });

    rzp.on("payment.failed", () => {
      // DO NOT clear cart on failure — keep items for retry
      setStatus("error");
      setInfraError("Payment transaction was declined or failed. Your cart is preserved so you can retry.");
    });

    rzp.open();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setFieldErrors({});
    setAddressErrors({});
    setCouponError(null);
    setInfraError(null);

    // Client-side structured address validation
    const addrErrs: Partial<Record<keyof AddressState, string>> = {};
    if (!address.house_no.trim()) {
      addrErrs.house_no = "Flat / House / Building details are required.";
    }
    if (!address.area.trim()) {
      addrErrs.area = "Street / Area / Locality is required.";
    }
    if (!/^\d{6}$/.test(address.pincode.trim())) {
      addrErrs.pincode = "Enter a valid 6-digit PIN code.";
    }
    if (!address.city.trim()) {
      addrErrs.city = "City / District is required.";
    }
    if (!address.state.trim()) {
      addrErrs.state = "State selection is required.";
    }

    if (Object.keys(addrErrs).length > 0) {
      setAddressErrors(addrErrs);
      setStatus("error");
      return;
    }

    // Format into authoritative clean multi-line shipping address
    const parts = [
      address.house_no.trim(),
      address.area.trim(),
      address.landmark.trim() ? `Landmark: ${address.landmark.trim()}` : null,
      `${address.city.trim()}, ${address.state.trim()} - ${address.pincode.trim()}`,
      "India",
    ].filter(Boolean);
    const formattedShippingAddress = parts.join(", ");

    try {
      // coupon_code is re-validated and re-priced authoritatively here —
      // the Apply button above is a preview for the customer's benefit,
      // not what actually determines the charge.
      const order = await createOrder({
        ...form,
        shipping_address: formattedShippingAddress,
        coupon_code: couponCode.trim() || undefined,
        payment_option: paymentOption,
        items: cartItemPayload,
      });

      openRazorpay(order);
    } catch (err) {
      if (err instanceof ApiRequestError && err.status === 422) {
        setFieldErrors(err.errors ?? {});
        // A coupon that previewed fine but got rejected on final submit
        // (e.g. someone else used up its last slot in the meantime) needs
        // the applied-state cleared too, or the summary keeps showing a
        // discount that no longer applies.
        if (err.errors?.coupon_code) setAppliedCoupon(null);
        setStatus("error");
      } else if (err instanceof ApiRequestError) {
        setInfraError(err.message);
        setStatus("error");
      } else {
        setInfraError(
          err instanceof Error ? err.message : "Something went wrong."
        );
        setStatus("error");
      }
    }
  }

  const hasCustomerErrors = CUSTOMER_FIELD_KEYS.some(
    (key) => (fieldErrors[key]?.length ?? 0) > 0
  ) || Object.keys(addressErrors).length > 0;
  const itemErrors = Object.entries(fieldErrors)
    .filter(([key]) => !INLINE_FIELD_KEYS.includes(key))
    .flatMap(([, msgs]) => msgs);

  return (
    <div className="pt-6 sm:pt-8 md:pt-12 pb-20 px-6 max-w-screen-2xl mx-auto w-full">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />

      <h1 className="text-3xl md:text-4xl font-black text-ink uppercase tracking-tight mb-12">
        Checkout
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {infraError && (
            <div className="border border-amber-500/40 bg-amber-500/10 p-4">
              <p className="text-sm font-bold text-amber-400 uppercase tracking-widest mb-1">
                Payment processing unavailable
              </p>
              <p className="text-sm text-ink-muted leading-relaxed">
                Your order details look correct, but payment couldn&apos;t be
                started just now.
              </p>
              <p className="text-xs text-ink-subtle mt-2">{infraError}</p>
            </div>
          )}

          {(itemErrors.length > 0 || hasCustomerErrors) && (
            <div className="border border-red-500/40 bg-red-500/10 p-4">
              <p className="text-sm font-bold text-red-400 uppercase tracking-widest">
                Please fix the errors below
              </p>
              {itemErrors.length > 0 && (
                <>
                  <ul className="mt-2 space-y-1">
                    {itemErrors.map((msg) => (
                      <li key={msg} className="text-sm text-ink-muted">
                        {msg}
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={openDrawer}
                    className="mt-3 text-xs font-bold text-red-400 uppercase tracking-widest hover:text-red-300 transition-colors border-b border-red-500 pb-1"
                  >
                    Review Cart
                  </button>
                </>
              )}
            </div>
          )}

          <Field
            label="Full Name"
            value={form.customer_name}
            onChange={(v) => handleChange("customer_name", v)}
            errors={fieldErrors.customer_name}
            autoComplete="name"
          />
          <Field
            label="Email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={form.customer_email}
            onChange={(v) => handleChange("customer_email", v)}
            errors={fieldErrors.customer_email}
          />
          <Field
            label="Phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={form.customer_phone}
            onChange={(v) => handleChange("customer_phone", v)}
            errors={fieldErrors.customer_phone}
          />

          {/* Structured Indian Address Section */}
          <div className="border border-hairline bg-surface p-5 rounded flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-hairline pb-3">
              <label className="text-xs font-bold text-ink uppercase tracking-wider">
                Delivery & Shipping Address
              </label>
              <span className="text-[10px] text-ink-subtle uppercase tracking-wider font-semibold">
                Pan-India Express Delivery
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label
                  htmlFor="checkout-field-house-no"
                  className="block text-[10px] font-bold text-ink-subtle uppercase tracking-widest mb-1.5"
                >
                  Flat / House No. / Building / Floor <span className="text-red-500">*</span>
                </label>
                <input
                  id="checkout-field-house-no"
                  required
                  autoComplete="address-line1"
                  placeholder="e.g. Flat 402, Tower B, Galaxy Heights"
                  value={address.house_no}
                  onChange={(e) => handleAddressChange("house_no", e.target.value)}
                  className="w-full bg-surface-alt border border-hairline focus:border-[var(--brand-red)] outline-none px-3.5 py-2.5 text-sm text-ink transition-colors rounded"
                />
                {addressErrors.house_no && (
                  <p className="text-xs text-red-400 mt-1">{addressErrors.house_no}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="checkout-field-area"
                  className="block text-[10px] font-bold text-ink-subtle uppercase tracking-widest mb-1.5"
                >
                  Street / Area / Sector / Colony <span className="text-red-500">*</span>
                </label>
                <input
                  id="checkout-field-area"
                  required
                  autoComplete="address-line2"
                  placeholder="e.g. Sector 62, Near Metro Station"
                  value={address.area}
                  onChange={(e) => handleAddressChange("area", e.target.value)}
                  className="w-full bg-surface-alt border border-hairline focus:border-[var(--brand-red)] outline-none px-3.5 py-2.5 text-sm text-ink transition-colors rounded"
                />
                {addressErrors.area && (
                  <p className="text-xs text-red-400 mt-1">{addressErrors.area}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="checkout-field-landmark"
                  className="block text-[10px] font-bold text-ink-subtle uppercase tracking-widest mb-1.5"
                >
                  Landmark <span className="text-ink-subtle font-normal">(Optional)</span>
                </label>
                <input
                  id="checkout-field-landmark"
                  placeholder="e.g. Opp. Apollo Pharmacy"
                  value={address.landmark}
                  onChange={(e) => handleAddressChange("landmark", e.target.value)}
                  className="w-full bg-surface-alt border border-hairline focus:border-[var(--brand-red)] outline-none px-3.5 py-2.5 text-sm text-ink transition-colors rounded"
                />
              </div>

              <div>
                <label
                  htmlFor="checkout-field-pincode"
                  className="block text-[10px] font-bold text-ink-subtle uppercase tracking-widest mb-1.5"
                >
                  6-Digit PIN Code <span className="text-red-500">*</span>
                </label>
                <input
                  id="checkout-field-pincode"
                  required
                  maxLength={6}
                  pattern="[0-9]{6}"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  placeholder="e.g. 201301"
                  value={address.pincode}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                    handleAddressChange("pincode", val);
                  }}
                  className="w-full bg-surface-alt border border-hairline focus:border-[var(--brand-red)] outline-none px-3.5 py-2.5 text-sm text-ink transition-colors rounded font-mono"
                />
                {addressErrors.pincode && (
                  <p className="text-xs text-red-400 mt-1">{addressErrors.pincode}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="checkout-field-city"
                  className="block text-[10px] font-bold text-ink-subtle uppercase tracking-widest mb-1.5"
                >
                  City / District <span className="text-red-500">*</span>
                </label>
                <input
                  id="checkout-field-city"
                  required
                  autoComplete="address-level2"
                  placeholder="e.g. Greater Noida"
                  value={address.city}
                  onChange={(e) => handleAddressChange("city", e.target.value)}
                  className="w-full bg-surface-alt border border-hairline focus:border-[var(--brand-red)] outline-none px-3.5 py-2.5 text-sm text-ink transition-colors rounded"
                />
                {addressErrors.city && (
                  <p className="text-xs text-red-400 mt-1">{addressErrors.city}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="checkout-field-state"
                  className="block text-[10px] font-bold text-ink-subtle uppercase tracking-widest mb-1.5"
                >
                  State <span className="text-red-500">*</span>
                </label>
                <select
                  id="checkout-field-state"
                  required
                  autoComplete="address-level1"
                  value={address.state}
                  onChange={(e) => handleAddressChange("state", e.target.value)}
                  className="w-full bg-surface-alt border border-hairline focus:border-[var(--brand-red)] outline-none px-3.5 py-2.5 text-sm text-ink transition-colors rounded cursor-pointer"
                >
                  <option value="" disabled>Select State</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                {addressErrors.state && (
                  <p className="text-xs text-red-400 mt-1">{addressErrors.state}</p>
                )}
              </div>
            </div>

            {fieldErrors.shipping_address?.map((msg) => (
              <p key={msg} className="text-xs text-red-400 mt-1">
                {msg}
              </p>
            ))}
          </div>

          {/* Payment Mode Selector */}
          <div className="mt-2 border border-hairline bg-surface p-5 flex flex-col gap-3 rounded">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-ink uppercase tracking-wider">
                Select Payment Option
              </label>
              <span className="text-[10px] text-ink-subtle uppercase tracking-wider">
                {paymentOption === "full" ? "100% Online" : `${advancePercent}% Advance Online`}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option 1: Dynamic % Advance */}
              <button
                type="button"
                onClick={() => setPaymentOption("advance")}
                className={`p-3.5 border text-left transition-all rounded cursor-pointer relative ${
                  paymentOption === "advance"
                    ? "border-[var(--brand-red)] bg-red-500/10 shadow-[0_0_15px_rgba(225,29,72,0.15)]"
                    : "border-hairline bg-surface-alt hover:border-hairline-strong opacity-75"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-ink uppercase">
                    Pay {advancePercent}% Advance
                  </span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 bg-surface border border-hairline text-ink-muted uppercase rounded">
                    COD Available
                  </span>
                </div>
                <p className="text-sm font-black text-ink">
                  {formatPrice(Math.round(totalAfterDiscount * (advancePercent / 100)))} Online
                </p>
                <p className="text-[10px] text-ink-muted mt-1">
                  Pay rest {formatPrice(Math.round(totalAfterDiscount * ((100 - advancePercent) / 100)))} on Delivery
                </p>
              </button>

              {/* Option 2: 100% Full Payment */}
              <button
                type="button"
                onClick={() => setPaymentOption("full")}
                className={`p-3.5 border text-left transition-all rounded cursor-pointer relative ${
                  paymentOption === "full"
                    ? "border-emerald-500 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                    : "border-hairline bg-surface-alt hover:border-hairline-strong opacity-75"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-ink uppercase">
                    100% Full Payment
                  </span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase rounded">
                    Fast Track
                  </span>
                </div>
                <p className="text-sm font-black text-ink">
                  {formatPrice(totalAfterDiscount)} Online
                </p>
                <p className="text-[10px] text-emerald-400 mt-1">
                  ₹0 COD Due · Priority Workshop Queue
                </p>
              </button>
            </div>
          </div>

          <PrimaryCtaButton
            type="submit"
            disabled={status === "submitting"}
            className="mt-6 w-full px-8 py-4 text-sm flex items-center justify-center gap-2.5 relative overflow-hidden group cursor-pointer"
          >
            {status === "submitting" ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-white" />
                <span>Securing Order & Opening Gateway...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-white/90 group-hover:scale-110 transition-transform" />
                <span>
                  {paymentOption === "full"
                    ? `Pay Full ${formatPrice(totalAfterDiscount)} & Place Order`
                    : `Pay Advance ${formatPrice(Math.round(totalAfterDiscount * (advancePercent / 100)))} & Place Order`}
                </span>
              </>
            )}
          </PrimaryCtaButton>
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-ink-subtle uppercase tracking-wider mt-2.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-success)]" />
            <span>256-Bit Encrypted · Razorpay Secure Gateway</span>
          </div>
        </form>

        <div className="border border-hairline bg-surface p-6 h-fit flex flex-col gap-6">
          <h2 className="text-sm font-bold text-ink uppercase tracking-widest">
            Order Summary
          </h2>

          <div className="flex flex-col gap-4">
            {items.map((item) => (
              <div key={`${item.productId}-${item.variantId || 'default'}`} className="flex gap-4">
                <div className="relative w-16 h-16 flex-none bg-surface border border-hairline overflow-hidden rounded">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="64px"
                    className="object-cover object-center"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div className="min-w-0">
                    <span className="text-sm font-bold text-ink truncate block">
                      {item.title}
                    </span>
                    {item.variantName && (
                      <span className="inline-block px-1.5 py-0.5 mt-0.5 rounded bg-red-500/10 border border-red-500/20 text-[10px] font-bold text-red-500 uppercase tracking-wider">
                        {item.variantName}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-ink-muted">
                    Qty {item.quantity}
                  </span>
                </div>
                <span className="text-sm font-bold text-ink-muted">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-hairline pt-4">
            <label className="block text-[10px] font-bold text-ink-subtle uppercase tracking-widest mb-2">
              Coupon Code
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => handleCouponInputChange(e.target.value)}
                placeholder="e.g. SAVE10"
                className="flex-1 min-w-0 bg-surface border border-hairline focus:border-[var(--brand-red)] outline-none px-4 py-3 text-sm text-ink uppercase tracking-widest placeholder:normal-case placeholder:tracking-normal placeholder:text-ink-subtle transition-colors"
              />
              <button
                type="button"
                onClick={() => handleApplyCoupon()}
                disabled={!couponCode.trim() || couponStatus === "checking"}
                className="shrink-0 px-4 py-2 border border-[var(--brand-red)] text-[var(--brand-red)] text-xs font-bold uppercase tracking-widest hover:bg-[var(--brand-red)]/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {couponStatus === "checking" ? "Checking…" : "Apply"}
              </button>
            </div>

            {(fieldErrors.coupon_code?.[0] || couponError) && (
              <p className="text-xs text-red-400 mt-2">
                {fieldErrors.coupon_code?.[0] ?? couponError}
              </p>
            )}

            {appliedCoupon && (
              <p className="text-xs text-[var(--color-success)] mt-2">
                &quot;{appliedCoupon.code}&quot; applied — {appliedCoupon.applies_to} · you save{" "}
                {formatPrice(appliedCoupon.discount_amount)}
              </p>
            )}

            {availableCoupons.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {availableCoupons.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => handleApplyCoupon(c.code)}
                    className="px-4 py-2 border border-hairline text-[11px] font-bold text-ink-muted uppercase tracking-wider hover:border-[var(--brand-red)] hover:text-[var(--brand-red)] transition-colors"
                  >
                    {c.code} · {c.type === "percent" ? `${c.value}% off` : `${formatPrice(c.value)} off`}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-hairline pt-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-ink-muted uppercase tracking-widest">
                Subtotal
              </span>
              <span
                className={
                  appliedCoupon
                    ? "text-sm text-ink-subtle line-through"
                    : "text-lg font-bold text-ink"
                }
              >
                {formatPrice(subtotal)}
              </span>
            </div>
            {appliedCoupon && (
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--color-success)] uppercase tracking-widest">
                  Discount
                </span>
                <span className="text-sm font-bold text-[var(--color-success)]">
                  -{formatPrice(discountAmount)}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-ink-muted uppercase tracking-widest">
                Total Order Value
              </span>
              <span className="text-lg font-bold text-ink">
                {formatPrice(totalAfterDiscount)}
              </span>
            </div>

            <div className="border-t border-hairline pt-3 mt-1 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs bg-surface-alt p-2.5 rounded border border-hairline">
                <div>
                  <span className="text-ink font-bold block">
                    Payable Now ({paymentOption === "full" ? "100%" : "20% Advance"}):
                  </span>
                  <span className="text-[10px] text-ink-muted">Via Razorpay Secure Gateway</span>
                </div>
                <span className="text-emerald-400 font-black text-sm">
                  {formatPrice(
                    paymentOption === "full"
                      ? totalAfterDiscount
                      : Math.round(totalAfterDiscount * 0.2)
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs px-2.5 py-1">
                <div>
                  <span className="text-ink-muted font-bold block">
                    Balance on Delivery (COD):
                  </span>
                  <span className="text-[10px] text-ink-subtle">
                    {paymentOption === "full"
                      ? "Zero COD Due (Fully Prepaid)"
                      : "Pay cash/UPI to delivery agent"}
                  </span>
                </div>
                <span className="text-ink font-bold text-sm">
                  {formatPrice(
                    paymentOption === "full"
                      ? 0
                      : Math.round(totalAfterDiscount - Math.round(totalAfterDiscount * 0.2))
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  errors,
  type = "text",
  inputMode,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  errors?: string[];
  type?: string;
  inputMode?: "text" | "tel" | "email" | "numeric";
  autoComplete?: string;
}) {
  const inputId = `checkout-field-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  return (
    <div>
      <label
        htmlFor={inputId}
        className="block text-[10px] font-bold text-ink-subtle uppercase tracking-widest mb-1.5"
      >
        {label} <span className="text-red-500">*</span>
      </label>
      <input
        id={inputId}
        required
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-surface-alt border border-hairline focus:border-[var(--brand-red)] outline-none px-3.5 py-2.5 text-sm text-ink transition-colors rounded"
      />
      {errors?.map((msg) => (
        <p key={msg} className="text-xs text-red-400 mt-1">
          {msg}
        </p>
      ))}
    </div>
  );
}
