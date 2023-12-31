import { useNavigation } from '@react-navigation/native';

import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  VStack,
  Image,
  Text,
  Center,
  Heading,
  ScrollView,
  useToast
} from 'native-base';

import { AuthNavigatorRoutesProps } from '@routes/auth.routes';

import { useAuth } from '@hooks/useAuth';

import { Alert, Platform } from 'react-native';

import backgroundImg from '@assets/background.png';
import LogoSvg from '@assets/logo.svg';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { AppError } from '@utils/AppError';
import { useState } from 'react';


type FormDataProps = {
  email: string;
  password: string;
}

const signInSchema = yup.object({
  email: yup.string().required('Informe o email.').email('E-mail inválido.'),
  password: yup.string().required('Informe a senha.').min(6, 'A senha deve ter pelo menos 6 caractéres.'),
});

export function SignIn() {
  const navigation = useNavigation<AuthNavigatorRoutesProps>();
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const toast = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormDataProps>({
    resolver: yupResolver(signInSchema)
  });

  function handleNewAccount() {
    navigation.navigate('signUp')
  }

  async function handleSignIn({ email, password }: FormDataProps) {
    setIsLoading(true)
    try {
      await signIn(email, password)
    } catch (error) {
      const isAppError = error instanceof AppError;

      const title = isAppError ? error.message : 'Não foi possível entrar, tente mais tarde.';

      setIsLoading(false)
      toast.show({
        title,
        placement: 'top',
        background: 'red.500',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <VStack flex={1} flexGrow={1} px={10} pb={16}>
      <Image
        source={backgroundImg}
        defaultSource={backgroundImg}
        alt='Gym'
        resizeMode='contain'
        position='absolute'
      />
      <ScrollView
        contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 280 : 16 }}
        showsVerticalScrollIndicator={false}
      >
        <Center my={24} justifyContent={'center'} alignItems={'center'}>
          <LogoSvg />
          <Text
            color={'gray.100'}
            fontSize={'sm'}
          >
            Treine a sua mente e o seu corpo
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

          <Controller
            control={control}
            name='email'
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder='Email'
                keyboardType='email-address'
                autoCapitalize='none'
                onChangeText={onChange}
                value={value}
                errorMessage={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name='password'
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder='senha'
                secureTextEntry
                autoCapitalize='none'
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password?.message}
              />
            )}
          />


          <Button
            title='Acessar'
            onPress={handleSubmit(handleSignIn)}
            isLoading={isLoading}
          />
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
            onPress={handleNewAccount}
            title='Criar conta'
            variant='outline'
          />
        </Center>
      </ScrollView>
    </VStack>
  )
}