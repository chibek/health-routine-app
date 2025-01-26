import { cva, VariantProps } from 'class-variance-authority';
import { Control, useController } from 'react-hook-form';
import { Text, TextInput, TextInputProps, View } from 'react-native';

import { cn } from '@/lib/cn';

const inputVariants = cva('w-full font-semibold border-gray-200 py-2', {
  variants: {
    variant: {
      simple: 'border-b',
      solid: 'border rounded-lg px-2',
    },
    textSize: {
      sm: 'text-sm',
      md: 'text-md',
      lg: 'text-lg',
    },
  },
  defaultVariants: {
    variant: 'simple',
    textSize: 'lg',
  },
});

type CustomTextInputProps = TextInputProps & {
  control: Control<any>;
  name: string;
  variant?: VariantProps<typeof inputVariants>;
};

export const CustomTextInput = ({ name, placeholder, control, variant }: CustomTextInputProps) => {
  const {
    field: { value, onChange, onBlur },
    fieldState: { error },
  } = useController({ control, name });

  return (
    <View>
      <TextInput
        className={cn(inputVariants(variant), error && 'border-destructive bg-red-50')}
        placeholder={placeholder}
        onChangeText={onChange}
        onBlur={onBlur}
        value={value}
      />
      {error && <Text className="mt-1 text-sm text-destructive">{error?.message}</Text>}
    </View>
  );
};
