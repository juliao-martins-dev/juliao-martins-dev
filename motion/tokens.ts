/**
 * Single source of truth for motion timing.
 * Components must never inline a duration, ease, stagger or offset.
 */

export const duration = {
  micro: 0.18,
  sm: 0.28,
  md: 0.36,
  lg: 0.42,
  xl: 0.8,
} as const;

export const ease = {
  /** Linear. Required for scrub-linked tweens, which must track scroll 1:1. */
  none: "none",
  out: "power3.out",
  in: "power2.in",
  inOut: "power2.inOut",
} as const;

/**
 * Total stagger spread, not per-item delay.
 *
 * `amount` keeps a sequence's wall-clock length fixed regardless of how many
 * chars or lines a split produces. That is what holds the hero morph under
 * its 2.5s ceiling when the stack lines rewrap at different viewport widths —
 * with `each`, the tail would drift past budget on narrow screens.
 */
export const staggerAmount = {
  tight: 0.14,
  base: 0.16,
  loose: 0.3,
} as const;

/**
 * Hero role/stack morph. Plays once on load, never loops.
 *
 * Budget (see the offsets resolved end to end):
 *   0.00  rest on state A
 *   1.60  connector fades in            (holdA)
 *   1.66  state A masks out upward      (connector start + outOverlap)
 *   1.90  state B masks in from below   (A-out start + stateOut + inOverlap)
 *   2.48  rest on state B
 */
export const hero = {
  holdA: 1.6,
  /**
   * Trailing dwell on state B, mirroring holdA.
   *
   * With `yoyo`, the timeline plays forward then backward. Putting an equal
   * hold at each end makes the reverse pass symmetric: state A is on screen
   * for holdA + holdB contiguous (its own head hold plus the reverse tail),
   * and state B gets exactly the same. Without this, B would be reached on the
   * final frame and immediately reverse — a flash rather than a headline.
   */
  holdB: 1.6,
  connectorIn: duration.sm,
  stateOut: duration.md,
  stateIn: duration.lg,
  /** state A begins leaving while the connector is still arriving */
  outOverlap: -0.22,
  /** state B begins arriving while state A is ~75% gone — sells the morph */
  inOverlap: -0.26,
  /** yPercent travel for the masked exit / entrance */
  outShift: -100,
  inShift: 100,
  connectorRise: 8,
} as const;
