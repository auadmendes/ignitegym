import { useAuth } from "@hooks/useAuth";
import { useState } from "react";
import { Platform, TouchableOpacity } from "react-native";

import {
  Center,
  ScrollView,
  VStack,
  Skeleton,
  Text,
  Heading,
  useToast
} from "native-base";

import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import { Input } from "@components/Input";
import { Button } from "@components/Button";

import defaultUserPhotoImg from '@assets/userPhotoDefault.png'

const PHOTO_SIZE = 24;

export function Profile() {
  const [photoIsLoading, setPhotoIsLoading] = useState(false);
  const [userPhoto, setUserPhoto] = useState('https://github.com/auadmendes.png')
  const toast = useToast();
  const { user } = useAuth();

  async function handleUserPhotoSelect() {
    setPhotoIsLoading(true)
    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      });

      if (photoSelected.canceled) {
        return;
      }
      if (photoSelected.assets[0].uri) {
        const photoInfo = await FileSystem.getInfoAsync(photoSelected.assets[0].uri);

        if (photoInfo.size && (photoInfo.size / 1024 / 1024) > 5) {
          toast.show({
            title: 'Essa imagem é muito grande. Escolha uma até 4MB',
            placement: 'top',
            background: 'red.500',
          })
          return;

        }
        setUserPhoto(photoSelected.assets[0].uri);
      }

      setUserPhoto(photoSelected.assets[0].uri)

    } catch (error) {
      console.log(error)
    } finally {
      setPhotoIsLoading(false)
    }
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Profile" />
      <ScrollView
        contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 56 : 16 }}
        showsVerticalScrollIndicator={false}
      >
        <Center mt={6} px={8}>
          {photoIsLoading ?
            <Skeleton
              w={PHOTO_SIZE}
              h={PHOTO_SIZE}
              rounded='full'
              startColor='gray.500'
              endColor='gray.400'
            />
            :
            <UserPhoto
              source={user.avatar ? { uri: userPhoto } : defaultUserPhotoImg}
              alt="Profile"
              size={PHOTO_SIZE}
            />}
          <TouchableOpacity
            onPress={handleUserPhotoSelect}
          >
            <Text color='green.500' fontWeight='bold' fontSize='md' mt={2} mb={8}>
              Alterar foto
            </Text>
          </TouchableOpacity>

          <Input
            bg='gray.600'
            placeholder="Nome"
          />
          <Input
            bg='gray.600'
            placeholder="Email"
            isDisabled
            value={user.email}
          />
        </Center>

        <VStack px={8} mt={12} mb={9}>
          <Heading color='gray.200' fontSize='md' mb={2} alignSelf='flex-start' mt={12}>
            Alterar senha
          </Heading>

          <Input
            bg='gray.600'
            placeholder="Senha antiga"
            secureTextEntry
          />
          <Input
            bg='gray.600'
            placeholder="Nova senha"
            secureTextEntry
          />
          <Input
            bg='gray.600'
            placeholder="Confirme nova senha"
            secureTextEntry
          />
          <Button title="Atualizar" mt={4} />
        </VStack>
      </ScrollView>
    </VStack>
  )
}
