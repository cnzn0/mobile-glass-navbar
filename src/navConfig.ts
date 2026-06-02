/**
 * navConfig.ts — single source of truth for the glass navbar styling.
 *
 * This is the file to hand off to dev. Every tweakable value lives here, split
 * into a DARK and a LIGHT theme preset. The in-app Controls panel mutates a copy
 * of the active theme at runtime so you can dial in numbers on-device, then read
 * the final values back out of the panel and paste them here.
 *
 * Defaults are transcribed from the Figma "Bottom Navigation / Default" frame,
 * DARK = node 6361:79806, LIGHT = node 6361:80280.
 */

export type ThemeName = 'dark' | 'light';

export type NavConfig = {
  // ----- Glass surface (the pill-shaped bar itself) -----
  /** Blur radius used by the expo-blur fallback. iOS liquid glass ignores this. */
  blurIntensity: number;
  /** Blur tint for the fallback BlurView. */
  blurTint: 'dark' | 'light' | 'default';
  /** Translucent color layered over the blur to match the Figma fill. */
  barTintColor: string;
  barBorderColor: string;
  barBorderWidth: number;
  /** Corner radius of the bar. Figma uses 48. */
  barRadius: number;
  /** Inner padding between the bar edge and the tabs. Figma uses 4. */
  barPadding: number;

  // ----- The sliding highlight pill behind the active tab -----
  pillColor: string;
  pillBorderColor: string;
  pillBorderWidth: number;
  pillRadius: number;

  // ----- Tabs / icons / labels -----
  iconSize: number;
  tabHeight: number;
  labelSize: number;
  labelColor: string;
  activeColor: string;
  /** Opacity applied to idle (non-active) tabs. Figma uses 0.5. */
  idleOpacity: number;
  /** Scale the tab content shrinks to while pressed. */
  pressScale: number;
  showLabels: boolean;

  // ----- Floating placement -----
  /** Left/right margin of the floating bar. Figma uses 20. */
  horizontalMargin: number;
  /** Gap between the bar and the bottom of the screen (above home indicator). */
  bottomInset: number;
  /** Scrim faded up behind the bar so content reads under the glass. */
  scrimColor: string;
  scrimHeight: number;
};

export const darkNavConfig: NavConfig = {
  blurIntensity: 24,
  blurTint: 'dark',
  barTintColor: 'rgba(243,243,243,0.05)',
  barBorderColor: 'rgba(243,243,243,0.08)',
  barBorderWidth: 0.5,
  barRadius: 48,
  barPadding: 4,

  pillColor: 'rgba(243,243,243,0.06)',
  pillBorderColor: 'rgba(243,243,243,0.05)',
  pillBorderWidth: 0.5,
  pillRadius: 999,

  iconSize: 24,
  tabHeight: 48,
  labelSize: 10,
  labelColor: '#F3F3F3',
  activeColor: '#F3F3F3',
  idleOpacity: 0.5,
  pressScale: 0.86,
  showLabels: true,

  horizontalMargin: 20,
  bottomInset: 28,
  scrimColor: '#06060c',
  scrimHeight: 140,
};

export const lightNavConfig: NavConfig = {
  blurIntensity: 12,
  blurTint: 'light',
  barTintColor: 'rgba(6,6,12,0.10)',
  barBorderColor: 'rgba(6,6,12,0.10)',
  barBorderWidth: 0.5,
  barRadius: 48,
  barPadding: 4,

  pillColor: 'rgba(6,6,12,0.05)',
  pillBorderColor: 'rgba(6,6,12,0.05)',
  pillBorderWidth: 0.5,
  pillRadius: 999,

  iconSize: 24,
  tabHeight: 48,
  labelSize: 10,
  labelColor: '#06060c',
  activeColor: '#06060c',
  idleOpacity: 0.5,
  pressScale: 0.86,
  showLabels: true,

  horizontalMargin: 20,
  bottomInset: 28,
  scrimColor: '#FFFFFF',
  scrimHeight: 140,
};

export const navThemes: Record<ThemeName, NavConfig> = {
  dark: darkNavConfig,
  light: lightNavConfig,
};

export type TabKey = 'home' | 'staking' | 'trade' | 'pools' | 'portfolio';
