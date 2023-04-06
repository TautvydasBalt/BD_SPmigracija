import { PrimaryButton } from '@fluentui/react';
import axios from 'axios';
import React from 'react';
import Navbar from '../../components/NavBar/NavBar';
import { getRequestIdFromURL, showData } from '../../global/dataHandler';
import strings from '../../loc/strings';
import styles from './ViewRequestPage.module.scss';

class ViewRequestPage extends React.Component<{}, { ViewRequest: any }> {

  constructor(props: {}) {
    super(props);

    this.state = {
      ViewRequest: [],
    }

  }

  public componentDidMount(): void {
    this.getMigrationRequest();
  }

  public render() {
    const { ViewRequest } = this.state;
    return (
      <div>
        <Navbar />
        <div className={styles.container}>
          <div className={styles.pageTitle}> Migration Request - {ViewRequest.requestName}</div>
          <div className={styles.itemCell} data-is-focusable={true}>
            <div className={styles.itemContent}>
              <div className={styles.itemData}>{"Status: " + showData(ViewRequest.status)} </div>
              <div className={styles.itemData}>{"Assigned To: " + showData(ViewRequest.assignedTo)}</div>
              <div className={styles.itemData}>{"Source URL: " + showData(ViewRequest.sourceURL)}</div>
              <div className={styles.itemData}>{"Destination URL: " + showData(ViewRequest.destinationURL)}</div>
              <div className={styles.itemData}>{"Selected Pages: " + showData(ViewRequest.SelectedPages)}</div>

            </div>
          </div>
          <div className={styles.buttons}>
            <PrimaryButton className={styles.button} text={strings.Edit} onClick={() => { }} />
            <PrimaryButton className={styles.button} text={strings.Delete} onClick={this.deleteMigrationRequest} />
            <PrimaryButton className={styles.button} disabled={ViewRequest.status === "Aproved"} text={strings.Approve} onClick={() => { }} />
            <PrimaryButton className={styles.button} disabled={ViewRequest.status === "New"} text={strings.Migrate} onClick={() => { }} />
          </div>
        </div>
      </div>
    );
  }

  private async getMigrationRequest() {
    let id = getRequestIdFromURL(window.location.href);
    const response = await axios.get(`/viewRequest?id=${id}`);
    this.setState({ ViewRequest: response.data })
  }

  private async deleteMigrationRequest() {
    let id = getRequestIdFromURL(window.location.href);
    axios.delete(`/deleteRequest?id=${id}`);
    window.open(window.location.origin + "/migrationRequests", "_self");
  }

}

export default ViewRequestPage;