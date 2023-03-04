import { DetailsList, IColumn } from '@fluentui/react';
import React from 'react';
import Navbar from '../../components/NavBar/NavBar';
import styles from './MigrationRequestsHistoryPage.module.scss';

class MigrationRequestsHistoryPage extends React.Component {
  render() {
    return (
      <div>
        <Navbar />
        <div className={styles.container}>
          SPMigration
          <DetailsList
            items={mock_items}
            columns={columns}
          />
        </div>
      </div>
    );
  }

  // private toRegisterPage() {
  //   window.open(window.location.origin,"/register");
  // }
}

const columns: IColumn[] = [
  { key: "assingedTo", fieldName: "assingedTo", name: "Assinged to", minWidth: 50, },
  { key: "source", fieldName: "source", name: "Source", minWidth: 50, },
  { key: "destination", fieldName: "destination", name: "Destination", minWidth: 50, },
  { key: "status", fieldName: "status", name: "Status", minWidth: 50, },
]

const mock_items = [
  { key: 0, assingedTo: "Worker 1", source: "URL", destination: "URL", status: "Active" },
  { key: 1, assingedTo: "Worker 2", source: "URL", destination: "URL", status: "Aproved" },
]


export default MigrationRequestsHistoryPage;