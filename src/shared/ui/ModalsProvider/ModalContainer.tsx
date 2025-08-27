import { Sheet } from 'react-modal-sheet';
import { useData } from 'shared/DataProvider';
import { ModalsContext } from './ModalsContext';
import styles from './ModalContainer.module.scss';

function ModalContainer() {
  const { isModalVisible, modalContent, closeModal } = useData({
    Context: ModalsContext,
  });

  return (
    <Sheet
      isOpen={isModalVisible || false}
      onClose={() => {
        closeModal?.();
      }}
    >
      <Sheet.Container>
        <Sheet.Header className={styles.header} />
        <Sheet.Content className={styles.content}>
          <Sheet.Scroller>{modalContent}</Sheet.Scroller>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop />
    </Sheet>
  );
}

export default ModalContainer;
