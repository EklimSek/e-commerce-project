import { useEffect, useRef, useState } from "react";
import { X, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */

const getRemainingSeconds = (expiresAt) => {
  if (!expiresAt) return 0;
  return Math.max(0, Math.floor((new Date(expiresAt) - Date.now()) / 1000));
};

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

/* ─────────────────────────────────────────────
   Status config — drives UI per payment state
───────────────────────────────────────────── */

const STATUS_CONFIG = {
  pending: {
    icon:  null, // shows QR + countdown
    label: null,
    class: "",
  },
  paid: {
    icon:  CheckCircle,
    label: "Payment Successful",
    class: "transaction-modal__status--success",
    color: "var(--color-secondary-dark)",
  },
  expired: {
    icon:  Clock,
    label: "QR Code Expired",
    class: "transaction-modal__status--warning",
    color: "#C8A84B",
  },
  failed: {
    icon:  XCircle,
    label: "Payment Failed",
    class: "transaction-modal__status--error",
    color: "#BA1A1A",
  },
};

/* ─────────────────────────────────────────────
   Component
───────────────────────────────────────────── */

export default function TransactionModal({
  open,
  qrCode, // raw KHQR string, rendered client-side via QRCodeSVG — NOT an image URL
  amount,
  expiresAt,
  status = "pending",
  merchantName = "Lumina Skincare",
  onCancel,
  onClose,
  onExpire,
}) {
  const [secondsLeft, setSecondsLeft] = useState(() => getRemainingSeconds(expiresAt));
  const expiredFiredRef = useRef(false);
  const intervalRef     = useRef(null);

  /* Countdown timer */
  useEffect(() => {
    if (!open || status !== "pending") return;

    expiredFiredRef.current = false;
    setSecondsLeft(getRemainingSeconds(expiresAt));

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          if (!expiredFiredRef.current) {
            expiredFiredRef.current = true;
            onExpire?.();          // fire immediately when countdown hits 0
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [open, expiresAt, status]);

  /* Lock body scroll when open */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  const config     = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  const isPending  = status === "pending";
  const isTerminal = status === "paid" || status === "expired" || status === "failed";
  const timerClass = secondsLeft <= 30 ? "transaction-modal__timer--urgent" : "";

  return (
    <div
      className="transaction-modal-backdrop"
      onClick={(e) => {
        // don't let a backdrop click abandon a live, unconfirmed payment
        if (e.target === e.currentTarget && !isPending) onClose?.();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="KHQR Payment"
    >
      <div className="transaction-modal">

        {/* ── Close button — hidden while pending, same reasoning as backdrop above ── */}
        {!isPending && (
          <button
            className="transaction-modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        )}

        {/* ── Header ── */}
        <div className="transaction-modal__header">
          <p className="transaction-modal__brand">KHQR</p>
          {/* <h2 className="transaction-modal__merchant">{merchantName}</h2> */}

          {/* Countdown pill — only during pending */}
          {isPending && (
            <div className={`transaction-modal__timer-pill ${timerClass}`}>
              <Clock size={12} strokeWidth={2} />
              <span>
                Expires in{" "}
                <span className="transaction-modal__timer-value">
                  {secondsLeft > 0 ? formatTime(secondsLeft) : "EXPIRED"}
                </span>
              </span>
            </div>
          )}
        </div>

        {/* ── Body ── */}
        <div className="transaction-modal__body">

          {/* QR code — shown only when pending */}
          {isPending && (
            <div className="transaction-modal__qr-wrap">
              {qrCode ? (
                <QRCodeSVG
                  value={qrCode}
                  size={220}
                  className="transaction-modal__qr-image"
                />
              ) : (
                /* Skeleton while QR loads */
                <div className="transaction-modal__qr-skeleton" aria-label="Loading QR code" />
              )}
            </div>
          )}

          {/* Terminal status icon — paid / expired / failed */}
          {isTerminal && config.icon && (
            <div className={`transaction-modal__status ${config.class}`}>
              <config.icon
                size={56}
                strokeWidth={1.25}
                style={{ color: config.color }}
              />
              <p className="transaction-modal__status-label" style={{ color: config.color }}>
                {config.label}
              </p>
            </div>
          )}

          {/* Amount */}
          <div className="transaction-modal__amount-wrap">
            <p className="transaction-modal__amount-label">Total Amount</p>
            <p className="transaction-modal__amount">
              ${typeof amount === "number" ? amount.toFixed(2) : "—"}
            </p>
          </div>

          {/* Instruction — pending only */}
          {isPending && (
            <div className="transaction-modal__instruction">
              <p>Scan this QR code with your banking app to complete the purchase.</p>
            </div>
          )}

        </div>

        {/* ── Footer actions ── */}
        <div className="transaction-modal__footer">
          {isPending && (
            <button className="transaction-modal__cancel-btn" onClick={onCancel}>
              Cancel Transaction
            </button>
          )}

          {isTerminal && (
            <button className="transaction-modal__close-btn" onClick={onClose}>
              {status === "paid" ? "Done" : "Close"}
            </button>
          )}
        </div>

        {/* Decorative bottom bar */}
        <div className="transaction-modal__bar" />

      </div>
    </div>
  );
}