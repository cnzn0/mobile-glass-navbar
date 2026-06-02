/**
 * Glass navbar test bed.
 *
 * PagerView holds the 5 pages. Its onPageScroll feeds an Animated value
 * (`scrollX` = position + offset, ranging 0..4) that drives BOTH the page
 * sliding (native, via PagerView) and the highlight pill in GlassTabBar.
 * Tapping a tab calls pager.setPage(), which the pager animates — so the pill
 * slides for taps and swipes alike. This is the "page sliding" behavior to keep.
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Appearance, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import PagerView from 'react-native-pager-view';
import { GlassTabBar, Tab } from './src/GlassTabBar';
import { ControlsPanel } from './src/ControlsPanel';
import { DemoPage } from './src/DemoPage';
import { navThemes, NavConfig, ThemeName } from './src/navConfig';

const AnimatedPager = Animated.createAnimatedComponent(PagerView);

const TABS: Tab[] = [
  { key: 'home', label: 'Home' },
  { key: 'staking', label: 'Staking' },
  { key: 'trade', label: 'Trade' },
  { key: 'pools', label: 'Pools' },
  { key: 'portfolio', label: 'Portfolio' },
];

const PAGE_ACCENTS: Record<ThemeName, string[]> = {
  dark: ['#1b2a4a', '#3a1d4d', '#143a2e', '#4a2a16', '#16324a'],
  light: ['#cdd9f0', '#e6d2f0', '#cdeadd', '#f0e2cd', '#cfe2f0'],
};

export default function App() {
  const pagerRef = useRef<PagerView>(null);
  const [theme, setTheme] = useState<ThemeName>('dark');
  const [configs, setConfigs] = useState<Record<ThemeName, NavConfig>>(navThemes);
  const config = configs[theme];
  const setConfig = (next: NavConfig) => setConfigs((c) => ({ ...c, [theme]: next }));

  // Drive the whole app's native appearance from the theme toggle so iOS liquid
  // glass renders its light/dark variant correctly (the blur fallback follows
  // blurTint independently). Requires userInterfaceStyle "automatic" in app.json.
  useEffect(() => {
    Appearance.setColorScheme(theme);
  }, [theme]);

  // position + offset come straight off the native pager scroll.
  const position = useRef(new Animated.Value(0)).current;
  const offset = useRef(new Animated.Value(0)).current;
  const scrollX = useMemo(() => Animated.add(position, offset), [position, offset]);

  const onPageScroll = Animated.event(
    [{ nativeEvent: { position, offset } }],
    { useNativeDriver: false }
  );

  const goTo = (index: number) => pagerRef.current?.setPage(index);

  return (
    <View style={[styles.root, { backgroundColor: theme === 'dark' ? '#06060c' : '#FFFFFF' }]}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <AnimatedPager
        ref={pagerRef}
        style={StyleSheet.absoluteFill}
        initialPage={0}
        onPageScroll={onPageScroll}
      >
        {TABS.map((tab, i) => (
          <View key={tab.key} collapsable={false} style={styles.page}>
            <DemoPage title={tab.label} accent={PAGE_ACCENTS[theme][i]} theme={theme} />
          </View>
        ))}
      </AnimatedPager>

      <GlassTabBar tabs={TABS} scrollX={scrollX} onPressTab={goTo} config={config} theme={theme} />
      <ControlsPanel config={config} onChange={setConfig} theme={theme} onThemeChange={setTheme} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  page: { flex: 1 },
});
