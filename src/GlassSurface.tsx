/**
 * GlassSurface.tsx — renders real iOS liquid glass (expo-glass-effect) when the
 * OS supports it, otherwise falls back to a frosted expo-blur BlurView. In Expo
 * Go / the simulator liquid glass is unavailable, so you'll see the BlurView
 * path; on a physical iOS 26 dev build you get the native GlassView.
 *
 * A translucent tint layer is always drawn on top so the Figma off-white/5 fill
 * reads identically across both paths.
 */
import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { BlurView } from 'expo-blur';

// expo-glass-effect is a native module that may be absent in Expo Go. Guard the
// require so the bundle never crashes when it isn't linked.
let GlassView: any = null;
let liquidGlassAvailable = () => false;
try {
  const glass = require('expo-glass-effect');
  GlassView = glass.GlassView ?? null;
  if (typeof glass.isLiquidGlassAvailable === 'function') {
    liquidGlassAvailable = glass.isLiquidGlassAvailable;
  }
} catch {
  // module not present — fall back to BlurView
}

export function isLiquidGlassActive(): boolean {
  return !!GlassView && liquidGlassAvailable();
}

type GlassSurfaceProps = {
  style?: StyleProp<ViewStyle>;
  radius: number;
  tintColor: string;
  borderColor: string;
  borderWidth: number;
  blurIntensity: number;
  blurTint: 'dark' | 'light' | 'default';
  glassStyle?: 'regular' | 'clear';
  glassInteractive?: boolean;
  children?: React.ReactNode;
  onLayout?: (e: any) => void;
};

export function GlassSurface({
  style,
  radius,
  tintColor,
  borderColor,
  borderWidth,
  blurIntensity,
  blurTint,
  glassStyle = 'regular',
  glassInteractive = false,
  children,
  onLayout,
}: GlassSurfaceProps) {
  const useLiquid = isLiquidGlassActive();

  const frame: ViewStyle = {
    borderRadius: radius,
    borderColor,
    borderWidth,
    overflow: 'hidden',
  };

  if (useLiquid) {
    return (
      <GlassView
        glassEffectStyle={glassStyle}
        isInteractive={glassInteractive}
        style={[styles.fill, frame, style]}
        onLayout={onLayout}
      >
        <View style={[StyleSheet.absoluteFill, { backgroundColor: tintColor }]} pointerEvents="none" />
        {children}
      </GlassView>
    );
  }

  return (
    <View style={[frame, style]} onLayout={onLayout}>
      <BlurView intensity={blurIntensity} tint={blurTint} style={StyleSheet.absoluteFill} />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: tintColor }]} pointerEvents="none" />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { position: 'relative' },
});
