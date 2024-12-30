import { Control, Controller, useController } from 'react-hook-form';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

import { cn } from '@/lib/cn';

type CustomTextInputProps = TextInputProps & {
  control: Control<any>;
  name: string;
};

export const CustomTextInput = ({ name, placeholder, control }: CustomTextInputProps) => {
  const {
    field: { value, onChange, onBlur },
    fieldState: { error },
  } = useController({ control, name });
  return (
    <View>
      <TextInput
        style={styles.input}
        className={cn(
          'w-full rounded-lg border px-4 py-3 text-base',
          error ? 'border-destructive bg-red-50' : 'border-gray-300 bg-white'
        )}
        placeholder={placeholder}
        onChangeText={onChange}
        onBlur={onBlur}
        value={value}
      />
      {error && <Text className="mt-1 text-sm text-destructive">{error?.message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    padding: 12,
    paddingHorizontal: 12,
    fontSize: 16,
  },
});
