/**
 * DemoPage.tsx — throwaway page content. Its only job is to put colorful,
 * scrollable texture *behind* the glass bar so the frosted blur is visible,
 * in both dark and light themes.
 */
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemeName } from './navConfig';

type Props = { title: string; accent: string; theme: ThemeName };

export function DemoPage({ title, accent, theme }: Props) {
  const dark = theme === 'dark';
  const base = dark ? '#06060c' : '#FFFFFF';
  const ink = dark ? '243,243,243' : '6,6,12';
  const text = dark ? '#F3F3F3' : '#06060c';

  return (
    <View style={[styles.root, { backgroundColor: base }]}>
      <LinearGradient colors={[accent, base]} style={StyleSheet.absoluteFill} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.kicker, { color: `rgba(${ink},0.5)` }]}>SOURCE OF TRUTH · MOBILE</Text>
        <Text style={[styles.title, { color: text }]}>{title}</Text>
        {Array.from({ length: 10 }).map((_, i) => (
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
  content: { paddingTop: 80, paddingHorizontal: 20, paddingBottom: 180 },
  kicker: { fontSize: 11, letterSpacing: 1.5, fontWeight: '600' },
  title: { fontSize: 34, fontWeight: '700', marginTop: 6, marginBottom: 24 },
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
