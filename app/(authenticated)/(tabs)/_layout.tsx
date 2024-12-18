import { Tabs } from '@/components/Tabs';

const TabLayout = () => {
  return (
    <Tabs ignoresTopSafeArea hapticFeedbackEnabled>
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
  );
};

export default TabLayout;
