/**
 * GlassTabBar.tsx — the floating frosted-glass tab bar.
 *
 * The highlight pill and each tab's opacity are driven by `scrollX` (a 0..n-1
 * Animated value fed from the pager's scroll position), so the pill slides
 * continuously as you swipe between pages AND when you tap a tab (the pager
 * animates the page change, which animates scrollX, which animates the pill).
 */
import React, { useRef, useState } from 'react';
import { Animated, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassSurface } from './GlassSurface';
import { NavIcon, IconName } from './NavIcons';
import { NavConfig, TabKey, ThemeName } from './navConfig';

export type Tab = { key: TabKey; label: string };

// `'transparent'` is transparent *black*, so a gradient from it to white passes
// through grays (the "stain"). Fade from a zero-alpha copy of the scrim color.
function transparentize(hex: string) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},0)`;
}

type Props = {
  tabs: Tab[];
  scrollX: Animated.AnimatedInterpolation<number> | Animated.Value | Animated.AnimatedAddition<number>;
  onPressTab: (index: number) => void;
  config: NavConfig;
  theme: ThemeName;
};

export function GlassTabBar({ tabs, scrollX, onPressTab, config, theme }: Props) {
  const [innerWidth, setInnerWidth] = useState(0);
  const tabWidth = innerWidth > 0 ? innerWidth / tabs.length : 0;
  const lastIndex = tabs.length - 1;

  // Per-tab press scale (spring down on press-in, back on release).
  const scales = useRef(tabs.map(() => new Animated.Value(1))).current;
  const pressIn = (i: number) =>
    Animated.spring(scales[i], { toValue: config.pressScale, useNativeDriver: true, speed: 50, bounciness: 0 }).start();
  const pressOut = (i: number) =>
    Animated.spring(scales[i], { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 8 }).start();

  // When not dragging, the pill tracks the pager (scrollX). While dragging it
  // follows the finger via `dragX` instead — see the PanResponder below.
  const pillTranslateX = (scrollX as any).interpolate({
    inputRange: [0, lastIndex],
    outputRange: [0, tabWidth * lastIndex],
    extrapolate: 'clamp',
  });

  // Drag-to-pick: pressing and dragging on the bar moves ONLY the pill (the page
  // doesn't change); on release we navigate to whatever tab the pill landed on.
  // The pill + bar also swell up (`swell`) for the classic glass press feel.
  // Refs (not closure values) so the long-lived PanResponder reads fresh data.
  const [dragging, setDragging] = useState(false);
  const dragX = useRef(new Animated.Value(0)).current;
  const swell = useRef(new Animated.Value(0)).current;
  const barScale = swell.interpolate({ inputRange: [0, 1], outputRange: [1, config.barSwell] });
  const pillScale = swell.interpolate({ inputRange: [0, 1], outputRange: [1, config.pillSwell] });

  const tabWidthRef = useRef(0);
  tabWidthRef.current = tabWidth;
  const countRef = useRef(tabs.length);
  countRef.current = tabs.length;
  const onPressTabRef = useRef(onPressTab);
  onPressTabRef.current = onPressTab;
  const scrollXRef = useRef(scrollX);
  scrollXRef.current = scrollX;
  const rowRef = useRef<View>(null);
  const rowLeftRef = useRef(0);
  // The tabs row is inset by barPadding; the pill's left:0 is the content origin,
  // so finger math must skip the padding to stay centered under the touch.
  const padRef = useRef(config.barPadding);
  padRef.current = config.barPadding;

  const measureRow = () =>
    rowRef.current?.measureInWindow((x) => {
      rowLeftRef.current = x;
    });

  // Pill-left for a finger at absolute screen x (centered under the finger, clamped to the bar).
  const pillLeftForX = (absX: number) => {
    const tw = tabWidthRef.current;
    const raw = absX - rowLeftRef.current - padRef.current - tw / 2;
    return Math.max(0, Math.min(tw * (countRef.current - 1), raw));
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponderCapture: (_e, g) =>
        Math.abs(g.dx) > 8 && Math.abs(g.dx) > Math.abs(g.dy),
      onPanResponderGrant: (e) => {
        measureRow();
        dragX.setValue(pillLeftForX(e.nativeEvent.pageX));
        setDragging(true);
        Animated.spring(swell, { toValue: 1, useNativeDriver: false, speed: 40, bounciness: 6 }).start();
      },
      onPanResponderMove: (_e, g) => {
        if (tabWidthRef.current <= 0) return;
        dragX.setValue(pillLeftForX(g.moveX));
      },
      onPanResponderRelease: (_e, g) => {
        const tw = tabWidthRef.current;
        const idx = Math.max(0, Math.min(countRef.current - 1, Math.round(pillLeftForX(g.moveX) / tw)));
        // Snap the pill to the chosen slot and release the swell.
        Animated.spring(dragX, { toValue: idx * tw, useNativeDriver: false, speed: 20, bounciness: 6 }).start();
        Animated.spring(swell, { toValue: 0, useNativeDriver: false, speed: 18, bounciness: 4 }).start();
        onPressTabRef.current(idx);
        // Hand the pill back to scrollX exactly when the pager has settled on idx,
        // so there's no visible jump between the two drivers.
        const sx: any = scrollXRef.current;
        const id = sx.addListener(({ value }: { value: number }) => {
          if (Math.abs(value - idx) < 0.01) {
            sx.removeListener(id);
            setDragging(false);
          }
        });
        setTimeout(() => {
          sx.removeListener(id);
          setDragging(false);
        }, 600);
      },
    })
  ).current;

  return (
    <View style={styles.root} pointerEvents="box-none">
      {/* Scrim so page content fades out under the floating bar */}
      <LinearGradient
        colors={[transparentize(config.scrimColor), config.scrimColor]}
        style={[styles.scrim, { height: config.scrimHeight }]}
        pointerEvents="none"
      />

      <View
        style={{
          marginHorizontal: config.horizontalMargin,
          marginBottom: config.bottomInset,
        }}
        pointerEvents="box-none"
      >
        <Animated.View style={[styles.barWrap, { transform: [{ scale: barScale }] }]}>
          {/* Glass is a background layer, NOT a parent of the pill — so the pill
              can swell past the bar edge on press without being clipped by the
              surface's rounded overflow. */}
          <GlassSurface
            radius={config.barRadius}
            tintColor={config.barTintColor}
            borderColor={config.barBorderColor}
            borderWidth={config.barBorderWidth}
            blurIntensity={config.blurIntensity}
            blurTint={config.blurTint}
            glassStyle={config.glassStyle}
            glassInteractive={config.glassInteractive}
            style={StyleSheet.absoluteFill}
          />
          <View
            ref={rowRef}
            style={[styles.inner, { padding: config.barPadding }]}
            onLayout={(e) => {
              setInnerWidth(e.nativeEvent.layout.width - config.barPadding * 2);
              measureRow();
            }}
            {...panResponder.panHandlers}
          >
            {/* Sliding highlight pill */}
            {tabWidth > 0 && (
              <Animated.View
                pointerEvents="none"
                style={[
                  styles.pill,
                  {
                    width: tabWidth,
                    height: config.tabHeight,
                    borderRadius: config.pillRadius,
                    backgroundColor: config.pillColor,
                    borderColor: config.pillBorderColor,
                    borderWidth: config.pillBorderWidth,
                    transform: [
                      { translateX: dragging ? dragX : pillTranslateX },
                      { scale: pillScale },
                    ],
                  },
                ]}
              />
            )}

            {/* Tabs */}
            <View style={styles.row}>
              {tabs.map((tab, i) => {
                const opacity = (scrollX as any).interpolate({
                  inputRange: [i - 1, i, i + 1],
                  outputRange: [config.idleOpacity, 1, config.idleOpacity],
                  extrapolate: 'clamp',
                });
                // Crossfade the outlined (idle) and filled (selected) glyphs as
                // the active page passes over this tab.
                const selectedOpacity = (scrollX as any).interpolate({
                  inputRange: [i - 1, i, i + 1],
                  outputRange: [0, 1, 0],
                  extrapolate: 'clamp',
                });
                const idleOpacity = (scrollX as any).interpolate({
                  inputRange: [i - 1, i, i + 1],
                  outputRange: [1, 0, 1],
                  extrapolate: 'clamp',
                });
                return (
                  <Pressable
                    key={tab.key}
                    style={styles.tab}
                    onPress={() => onPressTab(i)}
                    onPressIn={() => pressIn(i)}
                    onPressOut={() => pressOut(i)}
                    hitSlop={8}
                  >
                    {/* opacity is JS-driven (from scrollX); scale is native-driven.
                        Keep them on separate nodes so the drivers don't collide. */}
                    <Animated.View style={[styles.tabContent, { height: config.tabHeight, opacity }]}>
                      <Animated.View style={[styles.tabInner, { transform: [{ scale: scales[i] }] }]}>
                        <View style={{ width: config.iconSize, height: config.iconSize }}>
                          <Animated.View style={[StyleSheet.absoluteFill, { opacity: idleOpacity }]}>
                            <NavIcon name={tab.key as IconName} state="idle" theme={theme} size={config.iconSize} />
                          </Animated.View>
                          <Animated.View style={[StyleSheet.absoluteFill, { opacity: selectedOpacity }]}>
                            <NavIcon name={tab.key as IconName} state="selected" theme={theme} size={config.iconSize} />
                          </Animated.View>
                        </View>
                        {config.showLabels && (
                          <Text
                            style={{
                              color: config.labelColor,
                              fontSize: config.labelSize,
                              lineHeight: config.labelSize + 2,
                              fontWeight: '500',
                            }}
                          >
                            {tab.label}
                          </Text>
                        )}
                      </Animated.View>
                    </Animated.View>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  scrim: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  barWrap: {
    position: 'relative',
  },
  inner: {
    position: 'relative',
    justifyContent: 'center',
  },
  pill: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tab: {
    flex: 1,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabInner: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
});
