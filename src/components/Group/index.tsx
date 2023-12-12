import {
  Text,
  Pressable,
  IPressableProps,
  Skeleton
} from "native-base";
import { useState } from "react";

type Props = IPressableProps & {
  name: string;
  isActive: boolean;
}

export function Group({ name, isActive, ...rest }: Props) {
  const [isGroupLoading, setIsGroupLoading] = useState(true);

  return (
    <>
      {!name ?
        <Skeleton
          mr={3}
          w={24}
          h={10}
          rounded='lg'
          startColor='gray.500'
          endColor='gray.400'

        />
        :

        <Pressable
          mr={3}
          w={24}
          h={10}
          bg="gray.600"
          rounded="md"
          justifyContent="center"
          alignItems="center"
          overflow="hidden"
          isPressed={isActive}
          _pressed={{
            borderColor: "green.500",
            borderWidth: 1
          }}
          {...rest}
        >
          <Text
            color={isActive ? "green.500" : "gray.200"}
            textTransform="uppercase"
            fontSize="xs"
            fontWeight="bold"
          >{name}</Text>
        </Pressable>
      }
    </>
  )
}