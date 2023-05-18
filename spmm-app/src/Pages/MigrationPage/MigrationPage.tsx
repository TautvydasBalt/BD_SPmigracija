import { Modal, PrimaryButton, ProgressIndicator, Separator } from '@fluentui/react';
import React from 'react';
import strings from '../../loc/strings';
import styles from './MigrationPage.module.scss';
import axios from 'axios';
import NavBar from '../../components/NavBar/NavBar';
import MigrationAuth from '../../components/MigrationAuth/MigrationAuth';
import { getRequestIdFromURL, showAssignedPageTitles } from '../../global/dataHandler';

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

    sharepointPages: any[];
    migrating: boolean;
    modalMessage: string;

    migrationStatusMessage: string;
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
            sharepointPages: [],
            migrating: false,
            modalMessage: "",
            migrationStatusMessage: "",
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
                    <div className={styles.itemData}>{"Migrating the following pages: " + showAssignedPageTitles(this.state.sharepointPages)}</div>
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
                    <PrimaryButton disabled={this.state.migrating} className={styles.button} text={strings.CheckContinue} onClick={this.onContinue.bind(this)}></PrimaryButton>
                    {this.state.migrating ? <ProgressIndicator label="Migration is in progress." description={this.state.migrationStatusMessage} /> : ""}
                    <Modal className={styles.modal} isOpen={this.state.modalMessage ? true : false}>
                        <div className={styles.itemData} >{this.state.modalMessage}</div>
                        <PrimaryButton className={styles.button} text={strings.Ok} onClick={() => { window.open(window.location.origin + "/migrationRequestsHistory", "_self"); }} />
                    </Modal>

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
                sharepointPages: data.sharepointPages,
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
        let sconn = this.checkConnectionSource();
        let dconn = this.checkConnectionDest();

        if (await sconn && await dconn) {
            this.setState({ migrating: true });
            const interval = setInterval(this.getMigrationStatusMessage.bind(this), 1000);
            let bodyParameters = {
                sourceURL: this.state.MigrationSource,
                sourceUsername: this.state.SPEmailSource,
                sourcePassword: this.state.SPPasswordSource,
                destinationURL: this.state.MigrationDest,
                destinationUsername: this.state.SPEmailDest,
                destinationPassword: this.state.SPPasswordDest,
                sharepointPages: this.state.sharepointPages
            }
            axios.post("/SharePoint/MigratePages", bodyParameters).then((response) => {
                const data = response.data;
                if (data) {
                    console.log(data);
                    this.archiveMigration("Completed", response.data);
                    this.setState({ modalMessage: "Migration completed successfuly. " })
                    this.setState({ migrating: false });
                    clearInterval(interval);
                }
            }).catch(() => {
                this.archiveMigration("Error", " ");
                console.log("An Error Ocurred");
                this.setState({ modalMessage: "An Error Ocurred during migration. " })
                clearInterval(interval);
            });
        }
    }

    private archiveMigration(status: string, logUrl?: string) {
        let dateTime = new Date();
        console.log(dateTime);
        try {
            let bodyParameters = {
                title: this.state.RequestName,
                sourceURL: this.state.MigrationSource,
                destinationURL: this.state.MigrationDest,
                migrationDate: dateTime,
                status: status,
                LogUrl: logUrl,
            };
            axios.post("/archiveMigration", bodyParameters);
        } catch (error) {
            console.log(error);
        }
    }

    private async getMigrationStatusMessage() {
        try {
            const response = await axios.get("/SharePoint/getStatus")
            this.setState({ migrationStatusMessage: response.data });
        } catch (error) {
            console.log(error);
        }
    }
}

export default MigrationPage;