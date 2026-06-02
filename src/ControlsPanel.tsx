/**
 * ControlsPanel.tsx — on-device tuning UI. Tap the gear (top-right) to open.
 * Drag the sliders / toggle the chips to dial in the glass look, then read the
 * live values at the bottom and paste them into navConfig.ts for handoff.
 */
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import Slider from '@react-native-community/slider';
import { NavConfig, ThemeName } from './navConfig';
import { isLiquidGlassActive } from './GlassSurface';

type Props = {
  config: NavConfig;
  onChange: (next: NavConfig) => void;
  theme: ThemeName;
  onThemeChange: (theme: ThemeName) => void;
};

export function ControlsPanel({ config, onChange, theme, onThemeChange }: Props) {
  const [open, setOpen] = useState(false);
  const set = <K extends keyof NavConfig>(key: K, value: NavConfig[K]) =>
    onChange({ ...config, [key]: value });

  return (
    <>
      <Pressable style={styles.fab} onPress={() => setOpen((o) => !o)}>
        <Text style={styles.fabText}>{open ? '×' : '⚙'}</Text>
      </Pressable>

      {open && (
        <View style={styles.panel}>
          <ScrollView contentContainerStyle={{ paddingBottom: 16 }} showsVerticalScrollIndicator={false}>
            <Text style={styles.heading}>Navbar styling</Text>
            <Text style={styles.mode}>
              Glass mode: {isLiquidGlassActive() ? 'iOS liquid glass' : 'expo-blur fallback'}
            </Text>

            <View style={styles.toggleRow}>
              <Text style={styles.label}>Theme</Text>
              <View style={styles.chips}>
                {(['dark', 'light'] as const).map((t) => (
                  <Pressable key={t} onPress={() => onThemeChange(t)}
                    style={[styles.chip, theme === t && styles.chipActive]}>
                    <Text style={[styles.chipText, theme === t && styles.chipTextActive]}>{t}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <Row label={`Press scale · ${config.pressScale.toFixed(2)}`}>
              <Slider minimumValue={0.7} maximumValue={1} step={0.01} value={config.pressScale}
                onValueChange={(v) => set('pressScale', Number(v.toFixed(2)))} {...sliderColors} />
            </Row>

            <Row label={`Blur intensity · ${config.blurIntensity}`}>
              <Slider minimumValue={0} maximumValue={100} step={1} value={config.blurIntensity}
                onValueChange={(v) => set('blurIntensity', Math.round(v))} {...sliderColors} />
            </Row>

            <Row label={`Tint opacity · ${tintOpacity(config.barTintColor).toFixed(2)}`}>
              <Slider minimumValue={0} maximumValue={0.4} step={0.01} value={tintOpacity(config.barTintColor)}
                onValueChange={(v) => set('barTintColor', `rgba(243,243,243,${v.toFixed(2)})`)} {...sliderColors} />
            </Row>

            <Row label={`Pill opacity · ${tintOpacity(config.pillColor).toFixed(2)}`}>
              <Slider minimumValue={0} maximumValue={0.4} step={0.01} value={tintOpacity(config.pillColor)}
                onValueChange={(v) => set('pillColor', `rgba(243,243,243,${v.toFixed(2)})`)} {...sliderColors} />
            </Row>

            <Row label={`Bar radius · ${config.barRadius}`}>
              <Slider minimumValue={0} maximumValue={60} step={1} value={config.barRadius}
                onValueChange={(v) => set('barRadius', Math.round(v))} {...sliderColors} />
            </Row>

            <Row label={`Pill radius · ${config.pillRadius}`}>
              <Slider minimumValue={0} maximumValue={60} step={1} value={Math.min(config.pillRadius, 60)}
                onValueChange={(v) => set('pillRadius', Math.round(v))} {...sliderColors} />
            </Row>

            <Row label={`Bar padding · ${config.barPadding}`}>
              <Slider minimumValue={0} maximumValue={12} step={1} value={config.barPadding}
                onValueChange={(v) => set('barPadding', Math.round(v))} {...sliderColors} />
            </Row>

            <Row label={`Idle opacity · ${config.idleOpacity.toFixed(2)}`}>
              <Slider minimumValue={0.2} maximumValue={1} step={0.05} value={config.idleOpacity}
                onValueChange={(v) => set('idleOpacity', Number(v.toFixed(2)))} {...sliderColors} />
            </Row>

            <Row label={`Bottom inset · ${config.bottomInset}`}>
              <Slider minimumValue={0} maximumValue={60} step={1} value={config.bottomInset}
                onValueChange={(v) => set('bottomInset', Math.round(v))} {...sliderColors} />
            </Row>

            <View style={styles.toggleRow}>
              <Text style={styles.label}>Show labels</Text>
              <Switch value={config.showLabels} onValueChange={(v) => set('showLabels', v)} />
            </View>

            <View style={styles.toggleRow}>
              <Text style={styles.label}>Blur tint</Text>
              <View style={styles.chips}>
                {(['dark', 'light', 'default'] as const).map((t) => (
                  <Pressable key={t} onPress={() => set('blurTint', t)}
                    style={[styles.chip, config.blurTint === t && styles.chipActive]}>
                    <Text style={[styles.chipText, config.blurTint === t && styles.chipTextActive]}>{t}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <Text style={styles.heading}>Current values · {theme}</Text>
            <Text style={styles.code} selectable>
              {`blurIntensity: ${config.blurIntensity}
blurTint: '${config.blurTint}'
barTintColor: '${config.barTintColor}'
barBorderColor: '${config.barBorderColor}'
barRadius: ${config.barRadius}
barPadding: ${config.barPadding}
pillColor: '${config.pillColor}'
pillRadius: ${config.pillRadius}
labelColor: '${config.labelColor}'
idleOpacity: ${config.idleOpacity}
pressScale: ${config.pressScale}
bottomInset: ${config.bottomInset}
showLabels: ${config.showLabels}`}
            </Text>
          </ScrollView>
        </View>
      )}
    </>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.controlRow}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

function tintOpacity(rgba: string): number {
  const m = rgba.match(/rgba?\([^)]*,\s*([\d.]+)\s*\)/);
  return m ? parseFloat(m[1]) : 0;
}

const sliderColors = {
  minimumTrackTintColor: '#F3F3F3',
  maximumTrackTintColor: 'rgba(243,243,243,0.2)',
  thumbTintColor: '#F3F3F3',
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(20,20,28,0.85)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(243,243,243,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabText: { color: '#F3F3F3', fontSize: 20 },
  panel: {
    position: 'absolute',
    top: 112,
    right: 16,
    left: 16,
    maxHeight: '70%',
    backgroundColor: 'rgba(12,12,18,0.96)',
    borderRadius: 24,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(243,243,243,0.15)',
    padding: 18,
  },
  heading: { color: '#F3F3F3', fontSize: 16, fontWeight: '700', marginTop: 8, marginBottom: 4 },
  mode: { color: '#7CF7B0', fontSize: 12, marginBottom: 8, fontWeight: '600' },
  controlRow: { marginTop: 10 },
  label: { color: 'rgba(243,243,243,0.85)', fontSize: 13, marginBottom: 2 },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  chips: { flexDirection: 'row', gap: 6 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(243,243,243,0.08)',
  },
  chipActive: { backgroundColor: '#F3F3F3' },
  chipText: { color: 'rgba(243,243,243,0.7)', fontSize: 12, fontWeight: '600' },
  chipTextActive: { color: '#06060c' },
  code: {
    color: 'rgba(243,243,243,0.9)',
    fontFamily: 'Menlo',
    fontSize: 11,
    lineHeight: 17,
    marginTop: 6,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 10,
    padding: 12,
  },
});
