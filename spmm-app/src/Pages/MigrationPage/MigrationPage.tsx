import { PrimaryButton, Separator } from '@fluentui/react';
import React from 'react';
import strings from '../../loc/strings';
import styles from './MigrationPage.module.scss';
import axios from 'axios';
import NavBar from '../../components/NavBar/NavBar';
import MigrationAuth from '../../components/MigrationAuth/MigrationAuth';
import { getRequestIdFromURL } from '../../global/dataHandler';

interface MigrationState {
    [key: string]: MigrationState[keyof MigrationState];
    RequestName: string;

    MigrationSource: string;
    SPEmailSource: string;
    SPPasswordSource: string;
    errSource: string;
    succSource: string;

    MigrationDest: string;
    SPEmailDest: string;
    SPPasswordDest: string;
    errDest: string;
    succDest: string;
}


class MigrationPage extends React.Component<{}, MigrationState> {

    constructor(props: {}) {
        super(props);
        this.state = {
            RequestName: "",
            MigrationSource: "",
            MigrationDest: "",
            SPEmailSource: "",
            SPPasswordSource: "",
            SPEmailDest: "",
            SPPasswordDest: "",
            errSource: "",
            errDest: "",
            succSource: "",
            succDest: "",
        }
    }

    public componentDidMount(): void {
        let id = getRequestIdFromURL(window.location.href) ? getRequestIdFromURL(window.location.href) : "";
        this.loadMigrationData(id);
    }

    public render() {
        return (
            <div>
                <NavBar />
                <form className={styles.pageContainer}>
                    <div className={styles.pageTitle}> {this.state.RequestName} </div>
                    <div className={styles.Form}>
                        <div className={styles.leftForm}>
                            <MigrationAuth
                                url={this.state["MigrationSource"]}
                                email={this.state["SPEmailSource"]}
                                password={this.state["SPPasswordSource"]}
                                onChange={this.handleChange}
                                errorMessage={this.state.errSource}
                                sucessMessage={this.state.succSource}
                            />
                        </div>
                        <Separator vertical />
                        <div className={styles.rightForm}>
                            <MigrationAuth
                                destination
                                url={this.state["MigrationDest"]}
                                email={this.state["SPEmailDest"]}
                                password={this.state["SPPasswordDest"]}
                                onChange={this.handleChange}
                                errorMessage={this.state.errDest}
                                sucessMessage={this.state.succDest}
                            />
                        </div>
                    </div>
                    <Separator />
                    <PrimaryButton className={styles.button} text={strings.CheckContinue} onClick={this.onContinue.bind(this)}></PrimaryButton>
                </form>
            </div >
        );
    }

    private async loadMigrationData(id: string) {
        const response = await axios.get(`/viewRequest?id=${id}`);
        if (response && response.data) {
            let data = response.data;
            this.setState({
                RequestName: data.requestName,
                MigrationSource: data.sourceURL,
                MigrationDest: data.destinationURL,
            })
        }
    }

    private handleChange = (field: string) => (event: any) => {
        const value = event.target.value;
        this.setState({ [field]: value });
    };

    private async checkConnectionSource() {
        const response = await axios.get(`SharePoint?userLogin=${this.state.SPEmailSource}&userPassword=${this.state.SPPasswordSource}&siteUrl=${this.state.MigrationSource}`);
        let result: any[] = response.data;
        if (result) {
            this.setState({
                errSource: "",
                succSource: strings.succDest
            });
            setTimeout(() => this.setState({ succSource: "" }), 5000);
            return true;
        }
        else {
            this.setState({ errSource: strings.errSource });
            return false;
        }
    }

    private async checkConnectionDest() {
        const response = await axios.get(`SharePoint?userLogin=${this.state.SPEmailDest}&userPassword=${this.state.SPPasswordDest}&siteUrl=${this.state.MigrationDest}`);
        let result: any[] = response.data;
        if (result) {
            this.setState({
                errDest: "",
                succDest: strings.succDest
            });
            setTimeout(() => this.setState({ succDest: "" }), 5000);
            return true;
        }
        else {
            this.setState({ errDest: strings.errDest });
            return false;
        }
    }

    private async onContinue() {
        let sconn = await this.checkConnectionSource();
        let dconn = await this.checkConnectionDest();

        if (sconn && dconn) {
            console.log("Both Connections are valid");
        }
    }


}

export default MigrationPage;