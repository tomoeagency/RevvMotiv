"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  ShieldCheck,
  Truck,
  Wrench,
  PackageCheck,
  MessageCircle,
  ArrowRight,
  RefreshCw,
  FileText,
} from "lucide-react";
import { getOrder, formatPrice, type ApiOrder } from "@/lib/api";
import { PrimaryCtaLink } from "@/app/components/PrimaryCtaButton";

const POLL_INTERVAL_MS = 3000;
const MAX_POLLS = 20;

type Phase = "loading" | "polling" | "settled";

export default function OrderConfirmationPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ just_paid?: string; payment_failed?: string }>;
}) {
  const { id } = use(params);
  const sp = use(searchParams);
  const justPaid = sp.just_paid === "1";
  const paymentFailedFlag = sp.payment_failed === "1";

  const [order, setOrder] = useState<ApiOrder | null>(null);
  const [phase, setPhase] = useState<Phase>("loading");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [restartToken, setRestartToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    async function poll(attempt: number) {
      try {
        const result = await getOrder(id);
        if (cancelled) return;
        setOrder(result);
        setLoadError(null);

        const settled =
          result.payment_status === "advance_paid" ||
          result.payment_status === "fully_paid" ||
          result.payment_status === "failed";

        if (settled || attempt >= MAX_POLLS) {
          setPhase("settled");
          return;
        }

        setPhase("polling");
        timer = setTimeout(() => poll(attempt + 1), POLL_INTERVAL_MS);
      } catch (err) {
        if (cancelled) return;
        setLoadError(
          err instanceof Error ? err.message : "Could not load this order."
        );
        setPhase("settled");
      }
    }

    setPhase("loading");
    poll(1);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [id, restartToken]);

  return (
    <div className="py-6 md:py-8 px-4 sm:px-6 max-w-screen-xl mx-auto w-full min-h-[calc(100vh-140px)] flex flex-col justify-center">
      <div className="max-w-2xl mx-auto w-full">
        {/* Compact Header */}
        <div className="flex items-center justify-between border-b border-hairline pb-3 mb-4">
          <div>
            <span className="text-[10px] font-black text-red-500 uppercase tracking-widest block leading-none mb-1">
              RevvMotiv Storefront
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-ink uppercase tracking-tight leading-none">
              Order #{id}
            </h1>
          </div>
          {order && (
            <span className="text-[11px] font-bold text-ink-muted uppercase tracking-wider px-2.5 py-1 bg-surface border border-hairline rounded">
              Status: {order.payment_status.replace("_", " ")}
            </span>
          )}
        </div>

        {loadError && (
          <StatusCard
            tone="red"
            icon={<XCircle className="w-4 h-4 text-red-400" />}
            title="Couldn't load this order"
          >
            <p className="text-xs text-ink-muted leading-relaxed mb-3">
              {loadError} If you recently completed payment, the transaction is
              recorded on our servers.
            </p>
            <button
              onClick={() => setRestartToken((n) => n + 1)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-red-400 uppercase tracking-widest hover:text-red-300 transition-colors border-b border-red-500 pb-0.5 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              Try Reloading
            </button>
          </StatusCard>
        )}

        {!loadError && !order && (
          <StatusCard
            tone="neutral"
            icon={<Loader2 className="w-4 h-4 animate-spin text-red-500" />}
            title="Connecting to Order System..."
          >
            <p className="text-xs text-ink-muted">
              Retrieving live status and payment confirmation from gateway...
            </p>
          </StatusCard>
        )}

        {!loadError && order && (
          <OrderStatus
            order={order}
            phase={phase}
            justPaid={justPaid}
            paymentFailedFlag={paymentFailedFlag}
            onRetry={() => setRestartToken((n) => n + 1)}
          />
        )}

        {/* Compact Footer Links */}
        <div className="flex items-center justify-between gap-4 mt-5 pt-3 border-t border-hairline text-xs">
          <Link
            href="/shop"
            className="font-bold text-ink uppercase tracking-wider hover:text-red-500 transition-colors border-b border-red-500 pb-0.5 inline-flex items-center gap-1"
          >
            ← Continue Shopping
          </Link>
          <Link
            href="/contact"
            className="font-bold text-ink-muted hover:text-ink uppercase tracking-wider transition-colors"
          >
            Need Help? Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}

function OrderStatus({
  order,
  phase,
  justPaid,
  paymentFailedFlag,
  onRetry,
}: {
  order: ApiOrder;
  phase: Phase;
  justPaid: boolean;
  paymentFailedFlag: boolean;
  onRetry: () => void;
}) {
  const isConfirmed =
    order.payment_status === "advance_paid" ||
    order.payment_status === "fully_paid";
  const isFailed = order.payment_status === "failed" || paymentFailedFlag;

  // 1. ORDER CONFIRMED & ADVANCE PAID
  if (isConfirmed) {
    return (
      <div className="space-y-3.5">
        {/* Banner */}
        <div className="border border-[var(--color-success)]/40 bg-[var(--color-success)]/5 p-4 sm:p-5 rounded relative overflow-hidden">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--color-success)]/20 flex items-center justify-center flex-none">
              <CheckCircle2 className="w-4 h-4 text-[var(--color-success)]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-ink uppercase tracking-tight mb-1">
                Order Confirmed & Advance Received!
              </h2>
              <p className="text-xs text-ink-muted leading-relaxed mb-2">
                Thank you! Your advance payment of{" "}
                <strong className="text-ink">
                  {formatPrice(order.advance_amount)}
                </strong>{" "}
                has been verified. Parts are queued for 1:1 laser inspection.
              </p>
              <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold text-ink uppercase tracking-wider">
                <span className="flex items-center gap-1 text-[var(--color-success)]">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Fitment Guarantee
                </span>
                <span className="text-ink-subtle">·</span>
                <span className="text-ink-muted">Invoice sent to email</span>
                <span className="text-ink-subtle">·</span>
                <a
                  href={`http://127.0.0.1:8000/api/v1/orders/${order.id}/invoice`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 underline underline-offset-2 transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  View Tax Invoice
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 3-Step Roadmap */}
        <div className="border border-hairline bg-surface p-3.5 rounded">
          <h3 className="text-[11px] font-bold text-ink uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <PackageCheck className="w-3.5 h-3.5 text-red-500" />
            What Happens Next:
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="border-l-2 border-red-500 pl-2">
              <span className="text-[9px] font-black text-red-500 uppercase tracking-widest block">
                01. QA
              </span>
              <span className="text-[11px] font-bold text-ink uppercase block leading-tight">
                Workshop Pre-fit
              </span>
              <p className="text-[10px] text-ink-muted leading-tight mt-0.5">
                Laser finish check
              </p>
            </div>
            <div className="border-l-2 border-hairline-strong pl-2">
              <span className="text-[9px] font-black text-ink-subtle uppercase tracking-widest block">
                02. Dispatch
              </span>
              <span className="text-[11px] font-bold text-ink uppercase block leading-tight">
                Express Cargo
              </span>
              <p className="text-[10px] text-ink-muted leading-tight mt-0.5">
                Crated & tracked
              </p>
            </div>
            <div className="border-l-2 border-hairline-strong pl-2">
              <span className="text-[9px] font-black text-ink-subtle uppercase tracking-widest block">
                03. Delivery
              </span>
              <span className="text-[11px] font-bold text-ink uppercase block leading-tight">
                COD Handover
              </span>
              <p className="text-[10px] text-ink-muted leading-tight mt-0.5">
                Pay {formatPrice(order.remaining_amount)}
              </p>
            </div>
          </div>
        </div>

        {/* Totals */}
        <OrderTotals order={order} />
      </div>
    );
  }

  // 2. PAYMENT DECLINED / FAILED
  if (isFailed) {
    return (
      <div className="space-y-3.5">
        <div className="border border-red-500/40 bg-red-500/10 p-4 sm:p-5 rounded relative overflow-hidden">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-none">
              <XCircle className="w-4 h-4 text-red-500" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-ink uppercase tracking-tight mb-1">
                Payment Incomplete or Declined
              </h2>
              <p className="text-xs text-ink-muted leading-relaxed mb-2">
                Your order is saved, but the advance payment was declined or
                cancelled before completion. No funds were charged.
              </p>
              <div className="text-[11px] text-red-400 font-bold uppercase tracking-wider">
                Reason: UPI/Gateway Timeout or Card Declined
              </div>
            </div>
          </div>
        </div>

        <OrderTotals order={order} />

        <div className="border border-hairline bg-surface p-3.5 rounded space-y-2.5">
          <h3 className="text-[11px] font-bold text-ink uppercase tracking-wider">
            How would you like to proceed?
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <PrimaryCtaLink
              href="/checkout"
              className="px-4 py-2.5 text-xs flex items-center justify-center gap-1.5 text-center"
            >
              <span>Retry Payment at Checkout</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </PrimaryCtaLink>

            <a
              href={`https://wa.me/918368343232?text=${encodeURIComponent(
                `Hi RevvMotiv, my advance payment for Order #${order.id} failed. Can you share direct UPI payment details or assist me?`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-surface-alt hover:bg-hover border border-hairline text-ink font-bold text-xs uppercase tracking-wider rounded flex items-center justify-center gap-1.5 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pay via Direct UPI</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // 3. PENDING / POLLING GATEWAY
  if (phase === "settled") {
    return (
      <div className="space-y-3.5">
        <StatusCard
          tone="amber"
          icon={<Clock className="w-4 h-4 text-amber-400" />}
          title="Payment Awaiting Confirmation"
        >
          <p className="text-xs text-ink-muted leading-relaxed mb-2.5">
            Confirmation from Razorpay is taking a moment. Your order #{order.id} is
            safe — our webhook will update status once settled.
          </p>
          <button
            onClick={onRetry}
            className="text-xs font-bold text-amber-400 uppercase tracking-wider hover:text-amber-300 transition-colors border-b border-amber-500 pb-0.5 cursor-pointer inline-flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            Check Live Status Again
          </button>
        </StatusCard>
        <OrderTotals order={order} />
      </div>
    );
  }

  return (
    <div className="space-y-3.5">
      <StatusCard
        tone="blue"
        icon={<Loader2 className="w-4 h-4 animate-spin text-blue-400" />}
        title={
          justPaid
            ? "Verifying Payment with Gateway..."
            : "Checking Order Status..."
        }
      >
        <p className="text-xs text-ink-muted leading-relaxed">
          {justPaid
            ? "Your payment was submitted to Razorpay. Syncing confirmation with our workshop system..."
            : "Checking live order status from the server..."}
        </p>
      </StatusCard>
      <OrderTotals order={order} />
    </div>
  );
}

function OrderTotals({ order }: { order: ApiOrder }) {
  const hasDiscount = order.discount_amount > 0;
  const subtotal = order.total_amount + order.discount_amount;

  return (
    <div className="border border-hairline bg-surface p-3.5 rounded flex flex-col gap-2">
      <h3 className="text-[11px] font-bold text-ink uppercase tracking-wider border-b border-hairline pb-1.5">
        Payment & Breakdown
      </h3>

      {hasDiscount && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-ink-muted">
            Discount{order.coupon_code ? ` (${order.coupon_code})` : ""}
          </span>
          <span className="text-red-500 font-bold">
            −{formatPrice(order.discount_amount)}
          </span>
        </div>
      )}

      <div className="flex items-center justify-between text-xs">
        <span className="text-ink-muted">Total Order Value</span>
        <span className="text-ink font-bold">{formatPrice(order.total_amount)}</span>
      </div>

      <div className="flex items-center justify-between text-xs bg-surface-alt p-2.5 rounded border border-hairline">
        <div>
          <span className="text-ink font-bold block">
            Advance ({order.advance_percent_applied}% Online)
          </span>
          <span className="text-[10px] text-ink-muted">
            {order.payment_status === "advance_paid"
              ? "Received & Verified"
              : "Payable via Gateway"}
          </span>
        </div>
        <span className="text-emerald-400 font-black text-sm">
          {formatPrice(order.advance_amount)}
        </span>
      </div>

      <div className="flex items-center justify-between text-xs px-2.5 py-1">
        <div>
          <span className="text-ink-muted font-bold block">
            Balance on Delivery (COD)
          </span>
          <span className="text-[10px] text-ink-subtle">
            Cash or UPI to delivery agent
          </span>
        </div>
        <span className="text-ink font-bold text-sm">
          {formatPrice(order.remaining_amount)}
        </span>
      </div>
    </div>
  );
}

const TONE_CLASSES = {
  green:
    "border-[var(--color-success)]/40 bg-[var(--color-success)]/5 text-[var(--color-success)]",
  red: "border-red-500/40 bg-red-500/10 text-red-400",
  amber: "border-amber-500/40 bg-amber-500/10 text-amber-400",
  blue: "border-blue-500/40 bg-blue-500/5 text-blue-400",
  neutral: "border-hairline bg-surface text-ink-muted",
} as const;

function StatusCard({
  tone,
  icon,
  title,
  children,
}: {
  tone: keyof typeof TONE_CLASSES;
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`border p-4 rounded ${TONE_CLASSES[tone]}`}>
      <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1.5">
        {icon} {title}
      </p>
      {children}
    </div>
  );
}


