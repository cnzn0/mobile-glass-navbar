/**
 * app/_layout.tsx — the entire bottom navigation, built ONLY from
 * expo-router's NativeTabs (https://docs.expo.dev/router/advanced/native-tabs/).
 *
 * This is the real native UITabBar: on iOS 26 it renders Apple Liquid Glass
 * automatically (no custom blur/pill/gesture code), and it gets the native
 * behaviors for free — minimize-on-scroll, scroll-to-top, the lot. There is no
 * custom implementation here, which is the point: the old PanResponder/Animated
 * bar is gone, so are its memory leaks.
 *
 * Icons are the lighter.xyz custom set (assets/tabs/*), exported from Figma.
 * Each tab supplies an idle (outline) and selected (filled) PNG via `src`.
 * They're monochrome masks rendered in `template` mode, so the native bar tints
 * them. The Figma design distinguishes idle vs selected by shape, so we lean on
 * the SELECTED tint and let the system colour the unselected glyphs (see below).
 *
 * Icon SIZE: there is no `size` prop on NativeTabs.Trigger.Icon — a native
 * UITabBarItem renders the image at its intrinsic point size (pixels ÷ scale).
 * So the glyph size is set by the asset dimensions: these are exported at 24pt,
 * i.e. 24 / 48 / 72 px for @1x / @2x / @3x. To resize, re-export the PNGs in
 * assets/tabs/ at the new point size — not via a prop.
 *
 * WHAT THE LIQUID GLASS BAR ACTUALLY HONOURS (tested on iOS 26, sim, by forcing
 * extreme values and reading the result — not guessed):
 *
 *   HONOURED
 *     • tintColor                       — selected-item accent
 *     • iconColor.selected              — selected icon colour
 *     • labelStyle.selected.color       — selected label colour
 *     • labelStyle.*.fontSize/Weight    — typography for BOTH states
 *     • the icon images / label text / minimizeBehavior
 *
 *   IGNORED (the glass material owns these; the system overrides them)
 *     • iconColor.default               — idle icon colour → forced system tint
 *     • labelStyle.default.color        — idle label colour → forced system tint
 *     • blurEffect                      — bar stays Liquid Glass, never flattens
 *     • backgroundColor                 — glass material, can't be back-filled
 *     • shadowColor                     — no hairline under glass
 *
 * Net: under Liquid Glass you control the SELECTED accent + all typography, but
 * unselected icon/label colour and the bar material are the system's. The only
 * way to flatten the bar / colour idle items / show a hairline is the app-wide
 * `UIDesignRequiresCompatibility` opt-out in app.json (which also strips Liquid
 * Glass from expo-glass-effect). We chose to keep the glass, so the IGNORED
 * props are omitted below rather than left in as no-ops.
 */
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { DynamicColorIOS } from 'react-native';

// lighter.xyz ink, per appearance. Off White/100 (#f3f3f3) selected,
// the same ink at 50% for idle — matching the Figma tokens (idle = opacity 0.5).
const tint = DynamicColorIOS({ light: '#06060c', dark: '#f3f3f3' });
const tintIdle = DynamicColorIOS({
  light: 'rgba(6,6,12,0.5)',
  dark: 'rgba(243,243,243,0.5)',
});

// SF Pro Text Medium 10 / lineHeight 12 (the `pro/xxs/medium` Figma style).
const labelBase = { fontSize: 10, fontWeight: '500' } as const;

export default function TabLayout() {
  return (
    <NativeTabs
      tintColor={tint}
      // Selected glyph = full ink; idle glyph colour is set by the system under
      // Liquid Glass (the `default` here only takes effect if glass is disabled).
      iconColor={{ default: tintIdle, selected: tint }}
      // Sizes/weights apply to both states; only the SELECTED colour lands.
      labelStyle={{
        default: { ...labelBase, color: tintIdle },
        selected: { ...labelBase, color: tint },
      }}
      minimizeBehavior="onScrollDown"
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Icon
          renderingMode="template"
          src={{
            default: require('../assets/tabs/home-idle.png'),
            selected: require('../assets/tabs/home-selected.png'),
          }}
        />
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="markets">
        <NativeTabs.Trigger.Icon
          renderingMode="template"
          src={{
            default: require('../assets/tabs/markets-idle.png'),
            selected: require('../assets/tabs/markets-selected.png'),
          }}
        />
        <NativeTabs.Trigger.Label>Markets</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="trade">
        <NativeTabs.Trigger.Icon
          renderingMode="template"
          src={{
            default: require('../assets/tabs/trade-idle.png'),
            selected: require('../assets/tabs/trade-selected.png'),
          }}
        />
        <NativeTabs.Trigger.Label>Trade</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="pools">
        <NativeTabs.Trigger.Icon
          renderingMode="template"
          src={{
            default: require('../assets/tabs/pools-idle.png'),
            selected: require('../assets/tabs/pools-selected.png'),
          }}
        />
        <NativeTabs.Trigger.Label>Pools</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="portfolio">
        <NativeTabs.Trigger.Icon
          renderingMode="template"
          src={{
            default: require('../assets/tabs/portfolio-idle.png'),
            selected: require('../assets/tabs/portfolio-selected.png'),
          }}
        />
        <NativeTabs.Trigger.Label>Portfolio</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
