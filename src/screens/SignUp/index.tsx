import { useAuth } from '@hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Platform } from 'react-native';

import {
  VStack,
  Image,
  Text,
  Center,
  Heading,
  ScrollView,
  useToast
} from 'native-base';

import { api } from '@services/api';
import { AppError } from '@utils/AppError';

import { AuthNavigatorRoutesProps } from '@routes/auth.routes';


import backgroundImg from '@assets/background.png';
import LogoSvg from '@assets/logo.svg';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { useState } from 'react';


type FormDataProps = {
  name: string;
  email: string;
  password: string;
  password_confirm: string;
}

const signUpSchema = yup.object({
  name: yup.string().required('Informe o nome.'),
  email: yup.string().required('Informe o email.').email('E-mail inválido.'),
  password: yup.string().required('Informe a senha.').min(6, 'A senha deve ter pelo menos 6 caractéres.'),
  password_confirm: yup.string().required('Confirme a senha.').oneOf([yup.ref('password')], 'Confirmação de senha não confere')
});

export function SignUp() {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormDataProps>({
    resolver: yupResolver(signUpSchema)
  });

  const navigation = useNavigation<AuthNavigatorRoutesProps>();

  function handleGotoSignIn() {
    navigation.navigate('signIn')
  }

  // function handleSignUp() {
  //   console.log({
  //     name,
  //     email,
  //     password,
  //     confirmPassword
  //   })
  // }

  async function handleSignUp({ name, email, password }: FormDataProps) {
    setIsLoading(true)
    try {
      await api.post('/users', { name, email, password });
      signIn(email, password)

    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível criar a conta. Tente mais tarde.';
      toast.show({
        title,
        placement: 'top',
        background: 'red.500',
      });

      setIsLoading(false);

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
        contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 180 : 16 }}
        showsVerticalScrollIndicator={false}
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
            mb={1}
            fontFamily={'heading'}
          >
            Acesse a sua conta
          </Heading>


          <Controller
            control={control}
            name='name'
            // rules={{
            //   required: 'Informe seu nome'
            // }}
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder='Nome'
                keyboardType='default'
                onChangeText={onChange}
                value={value}
                errorMessage={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name='email'
            // rules={{
            //   required: 'Informe seu email',
            //   pattern: {
            //     value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            //     message: 'E-mail inválido'
            //   }
            // }}
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
                placeholder='Senha'
                secureTextEntry
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password?.message}
              />
            )}
          />
          <Controller
            control={control}
            name='password_confirm'
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder='Confirmar senha'
                secureTextEntry
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password_confirm?.message}
                onSubmitEditing={handleSubmit(handleSignUp)}
                returnKeyType='send'
              />
            )}
          />


          <Button
            title='Criar e acessar'
            onPress={handleSubmit(handleSignUp)}
            isLoading={isLoading}
          />
        </Center>

        <Center mt={19}>
          <Button
            onPress={handleGotoSignIn}
            title='Voltar para o login'
            variant='outline'
          />
        </Center>
      </ScrollView>
    </VStack>
  )
}