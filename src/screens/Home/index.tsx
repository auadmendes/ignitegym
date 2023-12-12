import { useCallback, useEffect, useState } from "react"
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import {
  VStack,
  FlatList,
  HStack,
  Heading,
  Text,
  useToast
} from "native-base"

import { api } from "@services/api";
import { AppError } from "@utils/AppError";

import { AppNavigationRouteProps } from "@routes/app.routes";

import { ExerciseCard } from "@components/ExerciseCard";
import { HomeHeader } from "@components/HomeHeader"
import { Group } from "@components/Group"
import { exercisesDTO } from "@dtos/exercisesDTO";
import { date } from "yup";
import { Loading } from "@components/Loading";


export function Home() {
  const [isLOading, setIsLoading] = useState(true);
  const [groups, setGroups] = useState<string[]>([]);
  const [groupSelected, setGroupSelected] = useState('antebraço');
  const [exercises, setExercises] = useState<exercisesDTO[]>([]);

  const navigation = useNavigation<AppNavigationRouteProps>()
  const toast = useToast();

  function handleOpenExerciseDetails(exerciseId: string) {
    navigation.navigate('exercise', { exerciseId })
  }

  async function fetchGroups() {
    try {
      const response = await api.get('/groups')
      setGroups(response.data)

    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível carregar os grupos musculares';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    }
  }

  async function fetchExercisesByGroup() {
    try {
      setIsLoading(true);
      const response = await api.get(`/exercises/bygroup/${groupSelected}`);
      setExercises(response.data)

    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível carregar os exercísios';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchGroups();
  }, []);

  useFocusEffect(useCallback(() => {
    fetchExercisesByGroup()
  }, [groupSelected]))

  return (
    <VStack flex={1}>
      <HomeHeader />

      <FlatList
        data={groups}
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <Group
            name={item}
            isActive={String(groupSelected).toUpperCase() === String(item).toUpperCase()}
            onPress={() => setGroupSelected(item)}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        _contentContainerStyle={{ px: 8 }}
        my={6}
        maxH={10}
        minH={10}
      />

      {isLOading ?
        (<Loading />)
        :
        (<VStack flex={1} px={8}>
          <HStack justifyContent="space-between" mb={5}>
            <Heading
              color="gray.200"
              fontSize="md"
            >
              Exercícios
            </Heading>
            <Text
              color="gray.200"
              fontSize="sm">
              {exercises.length}
            </Text>
          </HStack >

          <FlatList
            data={exercises}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <ExerciseCard
                onPress={() => handleOpenExerciseDetails(item.id)}
                data={item}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </VStack >
        )
      }
    </VStack >
  )
}