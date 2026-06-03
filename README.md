# mobile-glass-navbar

A **fully native** iOS bottom tab bar for the lighter.xyz mobile app, built with
zero custom navigation code. The bar is Apple's real `UITabBar`, driven by
expo-router's [`NativeTabs`](https://docs.expo.dev/router/advanced/native-tabs/),
so on iOS 26 it renders Apple **Liquid Glass** automatically and gets the native
behaviors for free (minimize-on-scroll, scroll-to-top, haptics, accessibility).

Screen content separately showcases
[`expo-glass-effect`](https://docs.expo.dev/versions/v55.0.0/sdk/glass-effect/)
via a `GlassContainer` + `GlassView` balance card.

> **No custom implementation.** There is no PanResponder, no Animated pill, no
> blur-fallback wrapper. That was deliberate: the old hand-rolled bar leaked
> memory, and the native tab bar doesn't.

Built on **Expo SDK 55** / React Native 0.83.

## What's where

| File | Purpose |
| --- | --- |
| [`app/_layout.tsx`](app/_layout.tsx) | The entire navbar — `NativeTabs` with five tabs using the custom lighter.xyz icon set. Tint + labels + icons. |
| [`app/index.tsx`](app/index.tsx), `markets.tsx`, `trade.tsx`, `pools.tsx`, `portfolio.tsx` | The five tab screens (each just renders `DemoPage`). |
| [`src/DemoPage.tsx`](src/DemoPage.tsx) | Throwaway screen content + the `expo-glass-effect` glass card showcase. |
| [`assets/tabs/`](assets/tabs) | Custom tab icons (`<tab>-idle` / `<tab>-selected`, `@1x/@2x/@3x`), rendered as tinted templates. |

Routing is file-based (expo-router): each file in `app/` is a route; the tab
named `index` is Home. To rename/reorder tabs, edit the `<NativeTabs.Trigger>`
list in `app/_layout.tsx` and match the route filenames.

## Run it

```bash
npm install --legacy-peer-deps
npx expo run:ios      # builds the dev client + launches on simulator or device
```

> `--legacy-peer-deps` is needed because expo-router lists `react-native-reanimated`
> as an optional peer that conflicts with the strict npm resolver. NativeTabs
> doesn't use reanimated.

> The `ios/` and `android/` folders are **not** committed (`.gitignore`). Expo
> regenerates them from `app.json` via prebuild — that's expected.

If you change `app.json` (plugins/scheme) or native deps, regenerate native:

```bash
LANG=en_US.UTF-8 npx expo prebuild --clean -p ios   # LANG avoids a CocoaPods UTF-8 crash
```

### Liquid glass only shows on a real iOS 26 device

The simulator can't render Liquid Glass, so `NativeTabs` shows a standard
translucent tab bar there and the `GlassView` card falls back to a plain view.
To see true Liquid Glass, run on a physical iOS 26 device.

## Standalone build (no Metro / no WiFi)

Bakes the JS bundle into the app so it runs without a Metro connection:

```bash
xcodebuild -workspace ios/mobileglassnavbar.xcworkspace \
  -configuration Release -scheme mobileglassnavbar \
  -destination "id=<DEVICE_UDID>" \
  -allowProvisioningUpdates -allowProvisioningDeviceRegistration \
  ENABLE_DEBUG_DYLIB=NO

# install + launch
xcrun devicectl device install app --device <DEVICE_UDID> \
  ~/Library/Developer/Xcode/DerivedData/mobileglassnavbar-*/Build/Products/Release-iphoneos/mobileglassnavbar.app
xcrun devicectl device process launch --device <DEVICE_UDID> com.anonymous.mobile-glass-navbar
```

Get `<DEVICE_UDID>` from `xcrun devicectl list devices`. The device needs
Developer Mode on (Settings → Privacy & Security → Developer Mode) and the
developer profile trusted on first launch (Settings → General → VPN & Device
Management).

## Customizing the tab bar

Everything lives in [`app/_layout.tsx`](app/_layout.tsx):

- **Icons** — `<NativeTabs.Trigger.Icon src={{ default, selected }} renderingMode="template" />`
  points at the PNGs in `assets/tabs/` (idle = outline, selected = filled).
  `template` mode means the bar tints them, so one monochrome asset set covers
  light **and** dark — no separate art per theme. (You can still use `sf=` for
  SF Symbols or `xcasset=` for asset-catalog art.)
- **Icon size** — there is **no `size` prop**. A native `UITabBarItem` renders
  the image at its intrinsic point size (px ÷ scale), so size is set by the
  asset dimensions. The set ships at **24pt** (24 / 48 / 72 px for @1x/@2x/@3x);
  re-export the PNGs to resize.
- **Selected color** — `tintColor` (a `DynamicColorIOS` so it tracks light/dark).
- **Minimize on scroll** — `minimizeBehavior="onScrollDown"` (iOS 26).

### What the iOS 26 Liquid Glass bar actually honours

The glass material renders itself, so several appearance props you'd expect to
work are **silently ignored** by the system. Tested on-device by forcing extreme
values (not guessed):

| Prop | Effect under Liquid Glass |
| --- | --- |
| `tintColor` | ✅ selected-item accent |
| `iconColor.selected` | ✅ selected icon colour |
| `labelStyle.selected.color` | ✅ selected label colour |
| `labelStyle.*` `fontSize` / `fontWeight` | ✅ typography, both states |
| icon images / label text / `minimizeBehavior` | ✅ |
| `iconColor.default` (idle) | ❌ forced to system tint |
| `labelStyle.default.color` (idle) | ❌ forced to system tint |
| `blurEffect` | ❌ bar never flattens |
| `backgroundColor` | ❌ glass can't be back-filled |
| `shadowColor` | ❌ no hairline under glass |

**Rule of thumb:** you own the *selected* accent and *all typography*; the
system owns the bar material and the *unselected* item colour. The only way to
flatten the bar / colour idle items is to opt the whole app out of the iOS 26
redesign with `ios.infoPlist.UIDesignRequiresCompatibility: true` in `app.json`
— which also strips Liquid Glass from `expo-glass-effect`, so it's all-or-nothing.

See the [NativeTabs docs](https://docs.expo.dev/router/advanced/native-tabs/)
for the full prop list (badges, search role, bottom accessory, etc.).
