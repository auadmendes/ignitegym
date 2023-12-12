import {
  TouchableOpacity,
  TouchableOpacityProps
} from 'react-native';

import {
  HStack,
  Heading,
  Image,
  Text,
  VStack,
  Icon,
  Skeleton,
  Pressable
} from 'native-base';

import { api } from '@services/api';

import { Entypo } from '@expo/vector-icons';
import { useState } from 'react';
import { exercisesDTO } from '@dtos/exercisesDTO';

type Props = TouchableOpacityProps & {
  data: exercisesDTO;
}

export function ExerciseCard({ data, ...rest }: Props) {
  const [isLoadingCard, setIsLoadingCard] = useState(false);

  return (
    <>
      {isLoadingCard ?
        <Skeleton
          //w={16}
          h={16}


          rounded="md"
          mb={3}

          startColor='gray.500'
          endColor='gray.400'
        />
        :
        <TouchableOpacity {...rest}>
          <HStack
            bg="gray.500"
            alignItems="center"
            p={2}
            pr={4}
            rounded="md"
            mb={3}
          >
            <Image
              source={{ uri: `${api.defaults.baseURL}/exercise/thumb/${data.thumb}` }}
              alt='costas'
              w={16}
              h={16}
              rounded="md"
              mr={4}
              resizeMode='cover'
            />
            <VStack flex={1}>
              <Heading
                color="white"
                fontSize="lg"
              >
                {data.name}
              </Heading>
              <Text
                color="gray.200"
                fontSize="md"
                mt={1}
                numberOfLines={2}
              >
                {data.series} séries x {data.repetitions} repetições
              </Text>
            </VStack>
            <Icon as={Entypo} name='chevron-thin-right' color="gray.300" />
          </HStack>
        </TouchableOpacity>
      }

    </>
  )
}