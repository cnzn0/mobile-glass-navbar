/**
 * NavIcons.tsx — renders the state- + theme-aware nav icons exported from Figma
 * (~/Downloads/native-navbar-icons, baked into navIconsData.ts).
 *
 * Each icon has 4 variants: idle/selected × light/dark. `idle` is the outlined
 * glyph, `selected` is the filled glyph; colors are baked per theme, so we just
 * pick the right SVG string — no tinting needed.
 */
import React, { useMemo } from 'react';
import { SvgXml } from 'react-native-svg';
import { navIconData, IconState, IconTheme } from './navIconsData';

export type IconName = keyof typeof navIconData; // 'home' | 'staking' | 'trade' | 'pools' | 'portfolio'

type Props = {
  name: IconName;
  state: IconState;
  theme: IconTheme;
  size?: number;
};

export function NavIcon({ name, state, theme, size = 24 }: Props) {
  const xml = navIconData[name]?.[state]?.[theme] ?? '';
  // SvgXml re-parses on xml change; memoize so it only parses per variant.
  const node = useMemo(() => <SvgXml xml={xml} width={size} height={size} />, [xml, size]);
  return node;
}

export const ICON_NAMES = Object.keys(navIconData) as IconName[];
