# AVEN verification

Verified 2026-11-15.

- TypeScript: passed (`npm run typecheck`).
- Shopping logic: 10 tests passed (`npm test`). Covers variant merging, quantity bounds, malformed storage, address validation, discount rounding and shipping thresholds.
- Expo Doctor: 20/20 checks passed.
- Production web bundle: exported successfully (`npm run export:web`).
- Local browser: inspected phone layouts at 320 and 390 CSS pixels and tablet layout at 768 CSS pixels. Shop content width matched viewport width at 390 and 768 pixels; no page-level horizontal overflow. Product, bag, address, shipping and payment screens remained usable at 320 pixels.
- Adaptive shop/saved grids use two columns on phones and three at tablet widths. Button text can shrink/wrap within its container. Scroll indicators are hidden on shopping lists.
- Browser journey: selected size M, added Restore Oversized Mock Neck, opened bag, entered fictional address, continued through shipping, selected Demo Visa and placed a demo order. Confirmation displayed $128 and bag reset to zero. Payment correctly rejected submission before selecting the demo card.
- Local screenshots: ignored `output/aven-mobile.png`.

## Limits

This is a frontend shopping prototype. No live payment, order, email, inventory or account service is connected. Address/contact details are not persisted. Product photography is reference material and must be licensed or replaced before commercial publication.

No APK was created. Native Android/iOS device behavior has not been verified. Android build experimentation was stopped at the user's request; native build settings are source configuration, not evidence of a successful native build. Browser checks use React Native Web and do not replace device QA.
