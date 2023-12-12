import { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";

import {
  ScrollView,
  Heading,
  VStack,
  HStack,
  Image,
  Icon,
  Text,
  Box,
  Skeleton,
  useToast
} from "native-base";

import { api } from "@services/api";

import { TouchableOpacity } from "react-native";

import { Feather } from '@expo/vector-icons';

import BodySvg from '@assets/body.svg';
import SeriesSvg from '@assets/series.svg';
import RepetitionsSvg from '@assets/repetitions.svg';

import { AppNavigationRouteProps } from "@routes/app.routes";
import { Button } from "@components/Button";
import { AppError } from "@utils/AppError";
import { Loading } from "@components/Loading";
import { exercisesDTO } from "@dtos/exercisesDTO";

type RoutesParamsProps = {
  exerciseId: string;
}

export function Exercise() {
  const [exercise, setExercise] = useState<exercisesDTO>({} as exercisesDTO)
  const navigation = useNavigation<AppNavigationRouteProps>();
  const [photoIsLoading, setPhotoIsLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [sendingRegister, setSendingRegister] = useState(false);
  const routes = useRoute();
  const toast = useToast();

  const { exerciseId } = routes.params as RoutesParamsProps

  async function fetchExerciseDetails() {
    try {
      setIsLoading(true);
      const response = await api.get(`/exercises/${exerciseId}`);
      setExercise(response.data)

    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : "Não foi possível carregar os detalhes, tente novemente mais tarde!"

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsLoading(false);
      setPhotoIsLoading(false)
    }
  }

  async function handleExerciseHistory() {
    try {
      setSendingRegister(true);

      await api.post('/history', { exercise_id: exerciseId });

      toast.show({
        title: 'Parabéns! Exercício registrado no seu histórico!',
        placement: 'top',
        bgColor: 'green.700'
      });

      navigation.navigate('history');

    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : "Não foi possível marcar como realizado"

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      });
    } finally {
      setSendingRegister(false)
    }
  }
  useEffect(() => {
    fetchExerciseDetails();
  }, [exerciseId])

  function handleGoBack() {
    navigation.goBack();
  }

  return (
    <VStack flex={1}>

      <VStack px={6} bg='gray.600' pt={12}>
        <TouchableOpacity
          onPress={handleGoBack}
        >
          <Icon
            as={Feather}
            name="arrow-left"
            color='green.500'
            size={6}
          />
        </TouchableOpacity>

        <HStack justifyContent='space-between' mt={4} mb={8} alignItems='center'>
          <Heading
            color='gray.100'
            fontSize='lg'
            flexShrink={1}
          >
            {exercise.name}
          </Heading>
          <HStack alignItems='center'>
            <BodySvg />
            <Text color='gray.200' ml={1} textTransform='capitalize'>
              {exercise.group}
            </Text>
          </HStack>
        </HStack>
      </VStack>
      <ScrollView>
        {isLoading ? (<Loading />) : (
          <VStack p={6}>
            {photoIsLoading ?
              <Skeleton
                w='full'
                h={80}
                rounded='lg'
                startColor='gray.500'
                endColor='gray.400'
                mb={3}
              />
              :
              <Box mb={3} rounded={'lg'} overflow={'hidden'}>
                <Image
                  w='full'
                  h={80}
                  source={{ uri: `${api.defaults.baseURL}/exercise/demo/${exercise.demo}` }}
                  alt='Nome do exercício'
                  resizeMode="cover"
                  rounded='lg'
                />
              </Box>
            }
            <Box
              bg='gray.600'
              rounded='md'
              pb={4}
              px={4}
            >
              <HStack
                alignItems='center'
                justifyContent='space-around'
                mb={6}
                mt={5}
              >

                <HStack>
                  {photoIsLoading ?
                    <Skeleton
                      w={140}
                      h={8}
                      ml={2}
                      rounded='sm'
                      startColor='gray.500'
                      endColor='gray.400'
                    />
                    :
                    <>
                      <SeriesSvg />
                      <Text color='gray.200' ml={2}>
                        {exercise.series} séries
                      </Text>
                    </>
                  }
                </HStack>

                <HStack>
                  {photoIsLoading ?
                    <Skeleton
                      w={140}
                      h={8}
                      ml={2}
                      rounded='sm'
                      startColor='gray.500'
                      endColor='gray.400'
                    />
                    :
                    <>
                      <RepetitionsSvg />
                      <Text color='gray.200' ml={2}>
                        {exercise.repetitions} repetições
                      </Text>
                    </>}
                </HStack>

              </HStack>

              <Button
                title="Marcar como realizado"
                isLoading={sendingRegister}
                onPress={handleExerciseHistory}
              />
            </Box>
          </VStack>
        )}
      </ScrollView>
    </VStack>
  )
}