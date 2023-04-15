import { List, PrimaryButton } from '@fluentui/react';
import axios from 'axios';
import React from 'react';
import Navbar from '../../components/NavBar/NavBar';
import { showAssignedUsersNames, showData } from '../../global/dataHandler';
import strings from '../../loc/strings';
import styles from './MigrationRequestsPage.module.scss';

class MigrationRequestsPage extends React.Component<{}, { migrationRequests: any }> {

  constructor(props: {}) {
    super(props);

    this.state = {
      migrationRequests: [],
    }
    this.getMigrationRequests = this.getMigrationRequests.bind(this);
  }

  public componentDidMount(): void {
    this.getMigrationRequests();
  }

  public render() {
    const { migrationRequests } = this.state;
    return (
      <div>
        <Navbar />
        <div className={styles.container}>
          <div className={styles.pageTitle}> Migration Requests </div>
          <List onRenderCell={this.onRenderCell} items={migrationRequests} />
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

  private async getMigrationRequests() {
    const response = await axios.get(`/allRequests`);
    this.setState({ migrationRequests: response.data })
  }
}

export default MigrationRequestsPage;