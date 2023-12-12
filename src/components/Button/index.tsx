import { isLoading } from 'expo-font';
import {
  Button as NativeBaseButton,
  IButtonProps,
  Text,
  Spinner
} from 'native-base';

type Props = IButtonProps & {
  title: string;
  variant?: 'solid' | 'outline';
  isLoading?: boolean;
}

export function Button({ title, isLoading, variant = 'solid', ...rest }: Props) {
  return (
    <NativeBaseButton
      w='full'
      h={14}
      bg={variant === 'outline' ? 'transparent' : 'green.700'}
      borderWidth={variant === 'outline' ? '1px' : 0}
      borderColor={variant === 'outline' ? 'green.500' : ''}
      opacity={isLoading ? '0.6' : '1'}
      disabled={isLoading}
      rounded='sm'
      _pressed={{
        bg: variant === 'outline' ? "gray.500" : "green.500"
      }}
      {...rest}
    >
      {!isLoading ? (
        <Text
          color={variant === 'outline' ? 'green.500' : 'white'}
          fontFamily='heading'
          fontSize='sm'
        >
          {title}
        </Text>
      ) : (
        <Spinner color='white' />
      )}
    </NativeBaseButton>
  )
}