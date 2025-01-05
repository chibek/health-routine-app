import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity } from 'react-native';
import Reanimated from 'react-native-reanimated';
type RightActionProps = {
  onDelete: () => void;
};
function RightAction({ onDelete }: RightActionProps) {
  return (
    <Reanimated.View>
      <TouchableOpacity onPress={onDelete} className="h-full flex-row items-center pl-1 pr-4">
        <Text className="pr-2 font-semibold text-white">Eliminar</Text>
        <Ionicons name="trash" size={26} color="#fff" />
      </TouchableOpacity>
    </Reanimated.View>
  );
}

export default RightAction;
