import { Tabs } from '@/components/Tabs';

const TabLayout = () => {
  return (
    // <RevenueCatProvider>
    <Tabs ignoresTopSafeArea hapticFeedbackEnabled backBehavior="history">
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => ({
            sfSymbol: focused ? 'house.fill' : 'house',
          }),
        }}
      />
      <Tabs.Screen
        name="workout"
        options={{
          title: 'Workout',
          tabBarIcon: ({ focused }) => ({
            sfSymbol: focused ? 'gym.bag.fill' : 'gym.bag',
          }),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => ({
            sfSymbol: focused ? 'person.fill' : 'person',
          }),
        }}
      />
    </Tabs>
    // </RevenueCatProvider>
  );
};

export default TabLayout;
