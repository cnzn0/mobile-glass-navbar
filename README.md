# mobile-glass-navbar

A floating frosted-glass bottom tab bar for the lighter.xyz mobile app. Renders
real iOS 26 **liquid glass** (`expo-glass-effect`) on a supported device and
falls back to a frosted `expo-blur` BlurView elsewhere (simulator, older iOS).

Built on Expo SDK 56 / React Native 0.85. The whole look is data-driven from one
file so it's easy to hand off and tune.

## What's where

| File | Purpose |
| --- | --- |
| [`src/navConfig.ts`](src/navConfig.ts) | **Single source of truth** for styling. `dark` + `light` presets — every tweakable value lives here. |
| [`src/GlassTabBar.tsx`](src/GlassTabBar.tsx) | The bar itself: sliding pill, drag-to-pick gesture, glass swell, crossfading icons. |
| [`src/GlassSurface.tsx`](src/GlassSurface.tsx) | Liquid-glass vs blur-fallback wrapper. |
| [`src/ControlsPanel.tsx`](src/ControlsPanel.tsx) | On-device tuning UI (gear button, top-right). Dial in values, copy them back into `navConfig.ts`. |
| `App.tsx` | Test bed: a `PagerView` with 5 pages driving the bar. |

## Run it (normal dev workflow)

```bash
npm install
npx expo run:ios      # builds the native app and launches on simulator or a connected device
```

> The `ios/` and `android/` folders are **not** committed (`.gitignore`). Expo
> regenerates them from `app.json` on first run — that's expected. You don't need
> anyone else's Xcode setup.

**SDK 56 note:** the App Store Expo Go app can't run this — use `expo run:ios`
(a dev build) or the iOS simulator, which auto-installs the matching runtime.

### Liquid glass only shows on a real device

The simulator and Expo Go can't render `expo-glass-effect`, so there you'll see
the blur fallback. To see true liquid glass, run on a physical iOS 26 device.

## Standalone build (no Metro / no WiFi)

Useful for demoing on a phone that isn't on the same network as the dev machine.
This bakes the JS bundle into the app so it runs on its own:

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

## Tuning the look

Open the app, tap the **gear** (top-right), and adjust the sliders/toggles —
glass style (regular/clear), interactive lensing, blur, tint, borders, radii,
swell, margins, icon size, and more. The panel shows the live values at the
bottom; paste them into the matching preset in
[`src/navConfig.ts`](src/navConfig.ts).
