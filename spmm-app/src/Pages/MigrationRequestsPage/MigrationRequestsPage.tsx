import { List } from '@fluentui/react';
import axios from 'axios';
import React from 'react';
import Navbar from '../../components/NavBar/NavBar';
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
          SPMigration
          <List onRenderCell={this.onRenderCell} items={migrationRequests} />
        </div>
      </div>
    );
  }

  private onRenderCell = (item?: any, index?: number, isScrolling?: boolean): React.ReactNode => {
    return item ? (
      <div className={styles.itemCell} data-is-focusable={true}>
      <div className={styles.itemContent}>
        <div className={styles.itemName}>{item.requestName}</div>
        <div className={styles.itemData}>{"Source URL: " + item.sourceURL}</div>
        <div className={styles.itemData}>{"Destination URL: " +item.destinationURL}</div>
      </div>
    </div>
    ) : null;
  };

  private async getMigrationRequests() {
    const response = await axios.get(`/allRequests`);
    this.setState({migrationRequests: response.data})
  }
}

export default MigrationRequestsPage;