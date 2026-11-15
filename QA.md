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

## Header search and You page refinement

- Moved the search entry from the header icon into a dedicated search bar below the header on tab screens.
- Reworked You with separate saved/bag cards, help rows, collection shortcut, and compact information links.
- Browser checked at 320, 390 and 768 CSS pixels; no page-level horizontal overflow at 320 or 768 pixels. Search for fleece returned the expected hoodie. Shipping & returns opened the correct information page and back navigation returned to You.
- TypeScript passed after these changes. Screenshots are in ignored output/.

## Complete mobile spacing and color review

- Reviewed Home, Shop, Saved (populated and empty), Bag (populated and empty), You, clothing and One Size product templates, Search (results and empty), checkout address/shipping/payment, confirmation, all five information pages, and the missing-page fallback in the local browser.
- Narrow mobile review used 320 x 760; standard mobile Shop review used 390 x 844. Checked rendered screenshots, header geometry and page width; checked pages did not have document-level horizontal overflow.
- Darkened secondary text and inactive tabs to sage #626f60. Calculated contrast is 5.30:1 on white and 4.83:1 on cream. White on the forest action color is 11.68:1. These are palette checks, not a complete accessibility certification.
- Unified saved hearts with rose #8e4b57, improved product badge readability, adjusted Home button spacing, allowed shipping-note text to wrap, and gave bag quantity controls more room.
- Search now appears below headers on browsing/product/information screens. Search itself uses one matching cream input. Checkout intentionally has its compact task header without an additional search bar.
- Tightened the demo payment card typography and wrapping. Field errors clear when their values are edited; validation still runs before continuing.
- Repeated the local $128 demo order through confirmation; bag reset to zero. Restored the original single saved favorite after empty-state testing.
- Final TypeScript, all 10 shopping tests, production web export and git whitespace check passed. Native-device behavior remains unverified. No APK was created or packaged.
- Updated preview screenshots: ignored output/aven-mobile-audit.png and output/aven-colors-you.png.
