
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import 'react-native-gesture-handler';
import { AppContext } from './src/providers/AppContext';
import { AuthStack, RootStack } from './src/routes';


const Stacks = createNativeStackNavigator()

const Index = () => {
    return (
        <AppContext.Consumer>
            {({ storedInformation }) => {
                return(
                storedInformation ?
                    <RootStack /> :
                    <AuthStack />
            )}
            }
        </AppContext.Consumer>
    );
}


export default Index