import Main from './pages/Main/ui/Main.tsx';
import { DataProvider } from './shared/DataProvider';
import { ModalsContext, useModals } from './shared/ui';
import ModalContainer from './shared/ui/ModalsProvider/ModalContainer.tsx';
import './App.scss';
import 'react-spring-bottom-sheet/dist/style.css';

function App() {
  const modalsContextData = useModals();

  return (
    <DataProvider Context={ModalsContext} value={modalsContextData}>
      <div>
        <Main />
      </div>
      <ModalContainer />
    </DataProvider>
  );
}

export default App;
