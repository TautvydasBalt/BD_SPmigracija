import { List, PrimaryButton } from '@fluentui/react';
import React from 'react';
import Navbar from '../../components/NavBar/NavBar';
import styles from './MigrationRequestsHistoryPage.module.scss';
import axios from 'axios';
import { showData } from '../../global/dataHandler';
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
          <div className={styles.itemName}>{showData(item.title)}</div>
          <div className={styles.itemData}>{"Source URL: " + showData(item.sourceURL)}</div>
          <div className={styles.itemData}>{"Destination URL: " + showData(item.destinationURL)}</div>
          <div className={styles.itemData}>{"Migration date: " + showData(item.migrationDate)}</div>
        </div>
        <div className={styles.sideBar}>
          <div className={styles.status}>{"Status: " + showData(item.status)} </div>
          <div className={styles.buttons}>
            <PrimaryButton className={styles.button} text={strings.Delete} onClick={() => this.deleteMigrationHistory(item.id)} />
            <PrimaryButton disabled={item.logURL === ""} className={styles.button} text={strings.downLogs} onClick={() => window.open(item.logURL)} />
          </div>
        </div>
      </div>
    ) : null;
  };

  private async deleteMigrationHistory(id: any) {
    await axios.delete(`/deleteMigrationHistory?id=${id}`);
    window.open(window.location.origin + "/migrationRequestsHistory", "_self");
  }

  private async getMigrationHistory() {
    const response = await axios.get(`/migrationHistory`);
    console.log(response.data);
    this.setState({ migrations: response.data })
  }
}


export default MigrationRequestsHistoryPage;