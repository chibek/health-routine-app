import { Ionicons } from '@expo/vector-icons';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Text, View, ScrollView } from 'react-native';
import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';
import { LayoutAnimationConfig } from 'react-native-reanimated';

import { Button } from '@/components/nativewindui/Button';
import RoutineCard from '@/components/routines/RoutineCard';
import { useRevenueCat } from '@/provider/RevenueCat';
import { getRoutines } from '@/services/routines';

const Workout = () => {
  const router = useRouter();
  // const { isPro } = useRevenueCat();
  const { data } = useLiveQuery(getRoutines(), []);
  const [routines, setRoutines] = React.useState(data);
  useEffect(() => {
    setRoutines(data);
  }, [data]);

  const onPressNewRoutine = () => {
    // if (data.length >= 5 && !isPro) {
    //   goPro();
    // } else {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/new-routine');
    // }
  };

  const goPro = async () => {
    const paywallResult: PAYWALL_RESULT = await RevenueCatUI.presentPaywall({
      displayCloseButton: false,
    });

    switch (paywallResult) {
      case PAYWALL_RESULT.NOT_PRESENTED:
      case PAYWALL_RESULT.ERROR:
      case PAYWALL_RESULT.CANCELLED:
        return false;
      case PAYWALL_RESULT.PURCHASED:
      case PAYWALL_RESULT.RESTORED:
        return true;
      default:
        return false;
    }
  };
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" className="flex-1 bg-background">
      <View className="gap-4 p-4">
        <View>
          <Text className="text-lg font-bold">Rutinas</Text>
          <View className="flex-row gap-4">
            <Button onPress={onPressNewRoutine} size="lg" className="grow text-center">
              <Ionicons name="clipboard-outline" size={24} />
              <Text>Nueva rutina</Text>
            </Button>
            <Button size="lg" className="grow text-center">
              <Ionicons name="search-outline" size={24} />
              <Text>Rutinas</Text>
            </Button>
          </View>
        </View>

        <Text className="text-gray-500">Mis rutinas ({data.length})</Text>
        <LayoutAnimationConfig>
          <View className="gap-2">
            {routines.map((routine) => (
              <RoutineCard key={routine.id} {...routine} />
            ))}
          </View>
        </LayoutAnimationConfig>
      </View>
    </ScrollView>
  );
};

export default Workout;
