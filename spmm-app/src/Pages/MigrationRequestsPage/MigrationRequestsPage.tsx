import { GroupedList } from '@fluentui/react';
import React from 'react';
import Navbar from '../../components/NavBar/NavBar';
import styles from './MigrationRequestsPage.module.scss';

class MigrationRequestsPage extends React.Component {
  render() {
    return (
      <div>
        <Navbar />
        <div className={styles.container}>
          SPMigration
          <GroupedList onRenderCell={this.onRenderCell} items={mock_items} />
        </div>
      </div>
    );
  }

  private onRenderCell = (nestingDepth?: number, item?: any, itemIndex?: number): React.ReactNode => {
    return item ? (
      <div className={styles.card} data-selection-index={itemIndex}>
          {item.assingedTo}

          {item.source}
      </div>
    ) : null;
  };

}

const mock_items = [
  { key: 0, assingedTo: "Worker 1", source: "URL", destination: "URL", status: "Active" },
  { key: 1, assingedTo: "Worker 2", source: "URL", destination: "URL", status: "Aproved" },
]


export default MigrationRequestsPage;