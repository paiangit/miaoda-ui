import { MButton } from '~/components';
import styles from './App.module.less';

function App() {
  return (
    <div className={styles.app}>
      <MButton type="primary" innerText="按钮"></MButton>
    </div>
  );
}

export default App;
