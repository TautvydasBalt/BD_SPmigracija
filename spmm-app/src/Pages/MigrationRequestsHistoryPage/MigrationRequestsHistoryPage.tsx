import { List, PrimaryButton } from '@fluentui/react';
import React from 'react';
import Navbar from '../../components/NavBar/NavBar';
import styles from './MigrationRequestsHistoryPage.module.scss';
import axios from 'axios';
import { showAssignedUsersNames, showData } from '../../global/dataHandler';
import strings from '../../loc/strings';

class MigrationRequestsHistoryPage extends React.Component<{},{ migrations: any }> {
  
  constructor(props: {}) {
    super(props);

    this.state = {
      migrations: [],
    }
    this.getMigrationHistory = this.getMigrationHistory.bind(this);
  }

  public componentDidMount(): void {
    this.getMigrationHistory();
  }

  public render() {
    const { migrations } = this.state;
    return (
      <div>
        <Navbar />
        <div className={styles.container}>
          <div className={styles.pageTitle}> Migration History </div>
          <List className={styles.list} onRenderCell={this.onRenderCell} items={migrations} />
        </div>
      </div>
    );
  }

  private onRenderCell = (item?: any, index?: number, isScrolling?: boolean): React.ReactNode => {
    return item ? (
      <div className={styles.itemCell} data-is-focusable={true}>
        <div className={styles.itemContent}>
          <div className={styles.itemName}>{showData(item.requestName)}</div>
          <div className={styles.itemData}>{"Assigned To: " + showAssignedUsersNames(item.assignedUsers)}</div>
          <div className={styles.itemData}>{"Source URL: " + showData(item.sourceURL)}</div>
          <div className={styles.itemData}>{"Destination URL: " + showData(item.destinationURL)}</div>
        </div>
        <div className={styles.sideBar}>
          <div className={styles.status}>{"Status: " + showData(item.status)} </div>
          <div className={styles.buttons}>
            <PrimaryButton className={styles.button} text={strings.Open} onClick={() => this.openRequest(item.id)} />
          </div>
        </div>
      </div>
    ) : null;
  };

  private async openRequest(id: string) {
    window.open(window.location.origin + "/viewRequest/" + id, "_self");
  }

  private async getMigrationHistory() {
    const response = await axios.get(`/migrationHistory`);
    this.setState({ migrations: response.data })
  }
}


export default MigrationRequestsHistoryPage;