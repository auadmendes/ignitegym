import {
  VStack,
  Image,
  Text,
  Center,
  Heading,
  ScrollView,
  KeyboardAvoidingView
} from 'native-base';

import { Platform } from 'react-native';

import backgroundImg from '@assets/background.png';
import LogoSvg from '@assets/logo.svg';
import { Input } from '@components/Input';
import { Button } from '@components/Button';

export function SignIn() {
  return (

    <VStack flex={1} flexGrow={1} bg='gray.700' px={10} pb={16}>
      <Image
        source={backgroundImg}
        alt='Gym'
        resizeMode='contain'
        position='absolute'
      />
      <ScrollView contentContainerStyle={{ flexGrow: 1, height: '100%', paddingBottom: Platform.OS === 'ios' ? 180 : 16 }}
      >
        <Center my={24} justifyContent={'center'} alignItems={'center'}>
          <LogoSvg />
          <Text
            color={'gray.100'}
            fontSize={'sm'}
          >
            Treine sua mente e o seu corpo
          </Text>
        </Center>

        <Center>
          <Heading
            color={'gray.100'}
            fontSize={'xl'}
            mb={6}
            fontFamily={'heading'}
          >
            Acesse sua conta
          </Heading>
          <Input
            placeholder='Email'
            keyboardType='email-address'
            autoCapitalize='none'
          />

          <Input
            placeholder='senha'
            secureTextEntry
          />
          <Button title='Acessar' />
        </Center>

        <Center mt={24}>
          <Text
            color='gray.100'
            fontFamily='body'
            fontSize='sm'
            mb={3}
          >
            Ainda não tem acesso?
          </Text>
          <Button
            title='Criar conta'
            variant='outline'
          />
        </Center>
      </ScrollView>
    </VStack>
  )
}