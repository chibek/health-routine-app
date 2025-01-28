import { FlashList } from '@shopify/flash-list';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { useRouter } from 'expo-router';
import { memo, useCallback, useMemo } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import { db } from '@/db/db';
import { categoriesSelectSchemaType } from '@/db/schema';
import { useCategory } from '@/stores/categories';

const AddCategory = () => {
  const { data: categoriesData } = useLiveQuery(db.query.categories.findMany(), []);

  const data = useMemo(() => {
    const allCategory: categoriesSelectSchemaType = {
      id: -1,
      name: 'Todos',
      createdAt: new Date().toDateString(),
      updatedAt: new Date().toDateString(),
    };
    return [allCategory, ...(categoriesData || [])];
  }, [categoriesData]);

  const renderItem = useCallback(
    ({ item }: { item: categoriesSelectSchemaType }) => <MemoizedCategoryItem item={item} />,
    []
  );
  return (
    <FlashList
      data={data}
      renderItem={renderItem}
      estimatedItemSize={200}
      ItemSeparatorComponent={() => <View className="mx-4 h-px bg-gray-100" />}
      contentContainerStyle={{ paddingVertical: 8 }}
    />
  );
};

type ExerciseItemProps = {
  item: categoriesSelectSchemaType;
};
const CategoryItem = ({ item }: ExerciseItemProps) => {
  const router = useRouter();
  const addCategory = useCategory((state) => state.addCategory);

  const handlePress = useCallback(() => {
    addCategory(item);
    router.back();
  }, [item.id]);

  return (
    <TouchableOpacity
      className="mx-2 flex flex-row items-center gap-2 px-4 py-2"
      onPress={handlePress}>
      <View className="overflow-hidden rounded-md">
        <Image src="https://picsum.photos/200" className="aspect-square size-12" />
      </View>
      <View className="flex-grow">
        <View className="flex gap-2">
          <Text className="text-left text-base">{item.name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const MemoizedCategoryItem = memo(CategoryItem);
export default AddCategory;
