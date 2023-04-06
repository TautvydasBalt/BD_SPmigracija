import axios from 'axios';
import React from 'react';
import Navbar from '../../components/NavBar/NavBar';
import { showData } from '../../global/dataHandler';
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

            </div>
          </div>
        </div>
      </div>
    );
  }

  private async getMigrationRequest() {
    let url = window.location.href;
    let urlarr = url.split('/');
    console.log(urlarr);
    const response = await axios.get(`/viewRequest`);
    this.setState({ ViewRequest: response.data })
  }
}

export default ViewRequestPage;