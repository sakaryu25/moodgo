import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import Svg, { Path, Circle, Ellipse } from 'react-native-svg';

const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);

type Props = { size?: number };

export default function BrainCharacter({ size = 140 }: Props) {
  const floatY   = useRef(new Animated.Value(0)).current;
  const squeeze  = useRef(new Animated.Value(1)).current;
  const blinkRy  = useRef(new Animated.Value(9)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatY, {
          toValue: -10, duration: 2200,
          easing: Easing.inOut(Easing.sin), useNativeDriver: true,
        }),
        Animated.timing(floatY, {
          toValue: 0, duration: 2200,
          easing: Easing.inOut(Easing.sin), useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(squeeze, {
          toValue: 1.05, duration: 2200,
          easing: Easing.inOut(Easing.sin), useNativeDriver: true,
        }),
        Animated.timing(squeeze, {
          toValue: 1, duration: 2200,
          easing: Easing.inOut(Easing.sin), useNativeDriver: true,
        }),
      ])
    ).start();

    const blink = () => {
      Animated.sequence([
        Animated.timing(blinkRy, { toValue: 0.5, duration: 60, useNativeDriver: false }),
        Animated.timing(blinkRy, { toValue: 9,   duration: 80, useNativeDriver: false }),
      ]).start(() => {
        setTimeout(blink, 2500 + Math.random() * 2000);
      });
    };
    const t = setTimeout(blink, 1500);
    return () => clearTimeout(t);
  }, []);

  const h = size * 1.2;

  return (
    <Animated.View style={{ transform: [{ translateY: floatY }, { scale: squeeze }] }}>
      <Svg width={size} height={h} viewBox="0 0 100 120">

        {/* 影 */}
        <Ellipse cx="50" cy="116" rx="20" ry="2.8" fill="rgba(200,100,130,0.12)" />

        {/* 本体 */}
        <Path
          d="M50 12
             C44 6,20 13,14 33
             C9 49,13 65,12 76
             C11 88,24 98,39 96
             C43 99,47 100,50 100
             C53 100,57 99,61 96
             C76 98,89 88,88 76
             C87 65,91 49,86 33
             C80 13,56 6,50 12 Z"
          fill="#FFB8CE"
        />

        {/* ハイライト */}
        <Path
          d="M22 23 C16 33,12 47,14 59"
          fill="none"
          stroke="rgba(255,255,255,0.55)"
          strokeWidth="5.5"
          strokeLinecap="round"
        />

        {/* 中央溝 */}
        <Path
          d="M50 13 C49 40,49 65,50 98"
          fill="none" stroke="#E070A0" strokeWidth="1.5"
        />

        {/* 左の脳みそシワ */}
        <Path d="M18 35 C24 29,33 38,37 31" fill="none" stroke="#E070A0" strokeWidth="2" strokeLinecap="round" />
        <Path d="M15 50 C23 44,32 53,38 46" fill="none" stroke="#E070A0" strokeWidth="2" strokeLinecap="round" />
        <Path d="M15 64 C22 59,31 67,36 61" fill="none" stroke="#E070A0" strokeWidth="2" strokeLinecap="round" />

        {/* 右の脳みそシワ */}
        <Path d="M82 35 C76 29,67 38,63 31" fill="none" stroke="#E070A0" strokeWidth="2" strokeLinecap="round" />
        <Path d="M85 50 C77 44,68 53,62 46" fill="none" stroke="#E070A0" strokeWidth="2" strokeLinecap="round" />
        <Path d="M85 64 C78 59,69 67,64 61" fill="none" stroke="#E070A0" strokeWidth="2" strokeLinecap="round" />

        {/* アンテナ */}
        <Path
          d="M50 12 C51 6,55 3,57 6"
          fill="none" stroke="#D060A0" strokeWidth="2.2" strokeLinecap="round"
        />
        <Circle cx="58" cy="5" r="3.5" fill="#FF8BAA" />
        <Circle cx="57.2" cy="3.8" r="1.2" fill="rgba(255,255,255,0.75)" />

        {/* きらきら（左） */}
        <Path d="M27 42 L27 49 M23.5 45.5 L30.5 45.5" stroke="#FFD0E4" strokeWidth="2" strokeLinecap="round" />
        {/* きらきら（右） */}
        <Path d="M71 40 L71 45 M68.5 42.5 L73.5 42.5" stroke="#FFD0E4" strokeWidth="1.6" strokeLinecap="round" />

        {/* まつ毛（左目） */}
        <Path d="M26 68 C29 63,33 62,36 65" fill="none" stroke="#3a1828" strokeWidth="2" strokeLinecap="round" />
        <Path d="M36 64 C39 61,43 61,44 65" fill="none" stroke="#3a1828" strokeWidth="1.6" strokeLinecap="round" />

        {/* まつ毛（右目） */}
        <Path d="M56 64 C57 61,61 61,64 64" fill="none" stroke="#3a1828" strokeWidth="1.6" strokeLinecap="round" />
        <Path d="M64 65 C67 62,71 63,74 68" fill="none" stroke="#3a1828" strokeWidth="2" strokeLinecap="round" />

        {/* 目（まばたきあり） */}
        <AnimatedEllipse cx="35" cy="75" rx={9.5} ry={blinkRy} fill="white" />
        <Circle cx="36.5" cy="75" r="6.5" fill="#1e1020" />
        <Circle cx="39.5" cy="71.5" r="2.8" fill="white" />
        <Circle cx="35" cy="78" r="1.1" fill="rgba(255,255,255,0.7)" />

        <AnimatedEllipse cx="65" cy="75" rx={9.5} ry={blinkRy} fill="white" />
        <Circle cx="66.5" cy="75" r="6.5" fill="#1e1020" />
        <Circle cx="69.5" cy="71.5" r="2.8" fill="white" />
        <Circle cx="65" cy="78" r="1.1" fill="rgba(255,255,255,0.7)" />

        {/* ほっぺ */}
        <Ellipse cx="20" cy="83" rx="9.5" ry="6.5" fill="#FF7A9A" opacity={0.45} />
        <Ellipse cx="80" cy="83" rx="9.5" ry="6.5" fill="#FF7A9A" opacity={0.45} />

        {/* 口（ω猫口） */}
        <Path
          d="M41 91 C44 97,47 93,50 95 C53 93,56 97,59 91"
          fill="none" stroke="#CC5080" strokeWidth="2.8"
          strokeLinecap="round" strokeLinejoin="round"
        />

      </Svg>
    </Animated.View>
  );
}
