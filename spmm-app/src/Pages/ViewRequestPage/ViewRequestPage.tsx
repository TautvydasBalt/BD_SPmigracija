import { PrimaryButton } from '@fluentui/react';
import axios from 'axios';
import React from 'react';
import Navbar from '../../components/NavBar/NavBar';
import { getRequestIdFromURL, showAssignedPageTitles, showAssignedUsersNames, showData } from '../../global/dataHandler';
import strings from '../../loc/strings';
import styles from './ViewRequestPage.module.scss';

interface ViewRequestState {
  ViewRequest: any
}

class ViewRequestPage extends React.Component<{}, ViewRequestState> {

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
              <div className={styles.itemData}>{"Assigned To: " + showAssignedUsersNames(ViewRequest.assignedUsers)}</div>
              <div className={styles.itemData}>{"Source URL: " + showData(ViewRequest.sourceURL)}</div>
              <div className={styles.itemData}>{"Destination URL: " + showData(ViewRequest.destinationURL)}</div>
              <div className={styles.itemData}>{"Selected Pages: " + showAssignedPageTitles(ViewRequest.sharepointPages)}</div>

            </div>
          </div>
          <div className={styles.buttons}>
            <PrimaryButton className={styles.button} text={strings.Edit} onClick={this.editMigrationRequest} />
            <PrimaryButton className={styles.button} text={strings.Delete} onClick={this.deleteMigrationRequest} />
            <PrimaryButton className={styles.button} disabled={ViewRequest.status !== "New"} text={strings.Approve} onClick={this.approveMigrationRequest} />
            <PrimaryButton className={styles.button} disabled={ViewRequest.status === "New"} text={strings.Migrate} onClick={this.startMigration} />
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

  private async editMigrationRequest() {
    let id = getRequestIdFromURL(window.location.href);
    window.open(window.location.origin + "/editRequest/" + id, "_self");
  }

  private async deleteMigrationRequest() {
    let id = getRequestIdFromURL(window.location.href);
    await axios.delete(`/deleteRequest?id=${id}`);
    window.open(window.location.origin + "/migrationRequests", "_self");
  }

  private async approveMigrationRequest() {
    let id = getRequestIdFromURL(window.location.href);
    await axios.put(`/approveRequest?id=${id}`);
    window.open(window.location.origin + "/migrationRequests", "_self");
  }

  private async startMigration() {
    let id = getRequestIdFromURL(window.location.href);
    window.open(window.location.origin + "/migration/" + id, "_self");
  }

}

export default ViewRequestPage;