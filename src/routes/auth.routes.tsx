import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';

import { SignIn } from '@screens/SignIn';
import { SignUp } from '@screens/SignUp';

export type AuthNavigatorRoutesProps = NativeStackNavigationProp<AuthRoutes>;

type AuthRoutes = {
  signIn: undefined;
  signUp: undefined;
}

const { Navigator, Screen } = createNativeStackNavigator<AuthRoutes>();

export function AuthRoutes() {
  return (
    <Navigator>
      <Screen
        name='signIn'
        component={SignIn}
        options={{ headerShown: false }}
      />
      <Screen
        name='signUp'
        component={SignUp}
        options={{ headerShown: false }}
      />
    </Navigator>
  )
}