import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, TouchableOpacity } from 'react-native';
import * as DropdownMenu from 'zeego/dropdown-menu';

import { deleteRoutine } from '@/services/routines';

const RoutineOptions = ({ routineId }: { routineId: number }) => {
  const handleDelete = async () => {
    const data = await deleteRoutine(routineId);
    console.log(data);
  };

  const handleDuplicate = () => {
    console.log('duplicate');
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <TouchableOpacity style={styles.button} activeOpacity={0.6}>
          <Ionicons name="ellipsis-horizontal-outline" size={30} />
        </TouchableOpacity>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content>
        <DropdownMenu.Group>
          <DropdownMenu.Item key="delete" onSelect={handleDelete}>
            <DropdownMenu.ItemTitle>Delete</DropdownMenu.ItemTitle>
            <DropdownMenu.ItemIcon
              ios={{
                name: 'trash',
                pointSize: 24,
              }}
            />
          </DropdownMenu.Item>

          <DropdownMenu.Item key="duplicate" onSelect={handleDuplicate}>
            <DropdownMenu.ItemTitle>Duplicate</DropdownMenu.ItemTitle>
            <DropdownMenu.ItemIcon
              ios={{
                name: 'square.stack',
                pointSize: 24,
              }}
            />
          </DropdownMenu.Item>
        </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default RoutineOptions;

const styles = StyleSheet.create({
  button: {
    padding: 8,
    borderRadius: 4,
  },
});
