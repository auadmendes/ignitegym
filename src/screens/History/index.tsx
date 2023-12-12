import { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

import { SectionList, Text, useToast } from "native-base";
import { api } from "@services/api";

import { Heading, VStack } from "native-base";

import { ScreenHeader } from "@components/ScreenHeader/index";
import { AppError } from "@utils/AppError";
import { Loading } from "@components/Loading";
import { HistoryCard } from "@components/HistoryCard";

import { HistoryByDayDTO } from "@dtos/historyByDayDTO";



export function History() {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [exercises, setExercises] = useState<HistoryByDayDTO[]>([])

  async function fetchHistory() {
    try {
      setIsLoading(true);

      const response = await api.get('/history');
      setExercises(response.data)
      console.log(JSON.stringify(response.data))

    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : "Não foi possível carregar o histórico."

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      });

    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(useCallback(() => {
    fetchHistory();
  }, []))

  return (
    <VStack flex={1}>
      <ScreenHeader title='Histórico de exercícios' />

      {isLoading ? (<Loading />) : (
        <SectionList
          sections={exercises}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <HistoryCard data={item} />
          )}
          renderSectionHeader={({ section }) => (
            <Heading color='gray.200' fontSize='md' mt={10} mb={3}>
              {section.title}
            </Heading>
          )}
          px={4}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={exercises.length === 0 && { flex: 1, justifyContent: 'center' }}
          ListEmptyComponent={() => (
            <VStack>
              <Text color='gray.200' textAlign='center'>
                Não há exercícios registrados ainda.
              </Text>
              <Text color='gray.100' fontSize='md' textAlign='center'>
                Bora treinar hoje!
              </Text>
            </VStack>
          )}
        />
      )}
    </VStack>
  )
}