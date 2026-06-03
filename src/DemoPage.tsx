/**
 * DemoPage.tsx — throwaway screen content. Two jobs:
 *   1. Put colorful, scrollable texture behind the native tab bar so the Liquid
 *      Glass material is visible (and so minimize-on-scroll has something to do).
 *   2. Showcase expo-glass-effect directly (the OTHER doc): a floating glass
 *      "balance" card built from GlassContainer + GlassView — no custom blur.
 *
 * Theme follows the OS appearance via useColorScheme(); the native tab bar does
 * the same, so the whole screen stays in sync with the system light/dark toggle.
 */
import React from 'react';
import { ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassContainer, GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';

type Props = { title: string; accent: string };

export function DemoPage({ title, accent }: Props) {
  const dark = useColorScheme() !== 'light';
  const base = dark ? '#06060c' : '#FFFFFF';
  const ink = dark ? '243,243,243' : '6,6,12';
  const text = dark ? '#F3F3F3' : '#06060c';
  // GlassView renders a plain (transparent) View on < iOS 26, so give the card a
  // translucent fallback fill there; on iOS 26 the real glass shows through.
  const glass = isLiquidGlassAvailable();
  const cardFallback = glass ? 'transparent' : `rgba(${ink},0.06)`;

  return (
    <View style={[styles.root, { backgroundColor: base }]}>
      <LinearGradient colors={[accent, base]} style={StyleSheet.absoluteFill} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.kicker, { color: `rgba(${ink},0.5)` }]}>SOURCE OF TRUTH · MOBILE</Text>
        <Text style={[styles.title, { color: text }]}>{title}</Text>

        {/* expo-glass-effect showcase: a glass balance card. */}
        <GlassContainer spacing={20} style={styles.glassRow}>
          <GlassView
            glassEffectStyle="regular"
            colorScheme={dark ? 'dark' : 'light'}
            tintColor={cardFallback}
            style={[styles.glassCard, { borderColor: `rgba(${ink},0.08)` }]}
          >
            <Text style={[styles.balanceLabel, { color: `rgba(${ink},0.5)` }]}>Total balance</Text>
            <Text style={[styles.balanceValue, { color: text }]}>$48,210.66</Text>
          </GlassView>
          <GlassView
            glassEffectStyle="clear"
            isInteractive
            colorScheme={dark ? 'dark' : 'light'}
            tintColor={cardFallback}
            style={[styles.glassChip, { borderColor: `rgba(${ink},0.08)` }]}
          >
            <Text style={[styles.chipText, { color: text }]}>+2.4%</Text>
          </GlassView>
        </GlassContainer>

        {Array.from({ length: 12 }).map((_, i) => (
          <View key={i} style={[styles.card, { backgroundColor: `rgba(${ink},${0.06 + (i % 3) * 0.03})` }]}>
            <View style={[styles.dot, { backgroundColor: accent }]} />
            <View style={{ flex: 1 }}>
              <View style={[styles.bar, { width: `${60 + (i * 7) % 35}%`, backgroundColor: `rgba(${ink},0.8)` }]} />
              <View style={[styles.bar, { width: `${30 + (i * 11) % 40}%`, backgroundColor: `rgba(${ink},0.8)`, opacity: 0.5, marginTop: 8 }]} />
            </View>
            <Text style={[styles.amount, { color: text }]}>{(1000 + i * 137.5).toFixed(2)}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingTop: 80, paddingHorizontal: 20, paddingBottom: 40 },
  kicker: { fontSize: 11, letterSpacing: 1.5, fontWeight: '600' },
  title: { fontSize: 34, fontWeight: '700', marginTop: 6, marginBottom: 20 },
  glassRow: { flexDirection: 'row', alignItems: 'stretch', gap: 12, marginBottom: 24 },
  glassCard: {
    flex: 1,
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    padding: 18,
    justifyContent: 'center',
  },
  balanceLabel: { fontSize: 12, fontWeight: '600' },
  balanceValue: { fontSize: 26, fontWeight: '700', marginTop: 4, fontVariant: ['tabular-nums'] },
  glassChip: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    paddingHorizontal: 18,
    justifyContent: 'center',
  },
  chipText: { fontSize: 16, fontWeight: '700' },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
  },
  dot: { width: 38, height: 38, borderRadius: 19 },
  bar: { height: 10, borderRadius: 5 },
  amount: { fontSize: 15, fontWeight: '600', fontVariant: ['tabular-nums'] },
});
