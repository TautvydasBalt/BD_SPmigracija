import { DetailsList, IColumn, Selection, ITag, Label, PrimaryButton, SelectionMode, TextField, Separator, CheckboxVisibility, Spinner } from '@fluentui/react';
import React from 'react';
import strings from '../../loc/strings';
import Navbar from '../../components/NavBar/NavBar';
import styles from './NewEditRequestPage.module.scss';
import UserPicker from '../../components/UserPicker/UserPicker';
import axios from 'axios';
import { User } from '../../global/globalInterfaces';
import { getRequestIdFromURL } from '../../global/dataHandler';
import MigrationAuth from '../../components/MigrationAuth/MigrationAuth';

interface NewEditRequestState {
    userTags: ITag[];
    selectedTags: ITag[];

    [key: string]: NewEditRequestState[keyof NewEditRequestState];
    RequestName: string;
    MigrationSource: string;
    MigrationDest: string;

    SPEmailSource: string;
    SPPasswordSource: string;
    SPEmailDest: string;
    SPPasswordDest: string;

    SPpages: any[];
    selectedSPpages: any[];

    errSource: string;
    errDest: string;
    succSource: string;
    succDest: string;

    loadingPages: boolean;
}


class NewEditRequestPage extends React.Component<{}, NewEditRequestState> {
    private editPageId: string;
    private columns: IColumn[];
    constructor(props: {}) {
        super(props);
        this.editPageId = "";
        this.columns = [{ key: "column1", name: "Title", fieldName: "title", minWidth: 100 }];
        this.state = {
            userTags: [],
            selectedTags: [],
            RequestName: "",
            MigrationSource: "",
            MigrationDest: "",
            SPEmailSource: "",
            SPPasswordSource: "",
            SPEmailDest: "",
            SPPasswordDest: "",
            SPpages: [],
            selectedSPpages: [],
            errSource: "",
            errDest: "",
            succSource: "",
            succDest: "",
            loadingPages: false,
        }
    }

    public componentDidMount(): void {
        this.editPageId = getRequestIdFromURL(window.location.href) ? getRequestIdFromURL(window.location.href) : "";
        if (this.editPageId) this.loadEditFormData(this.editPageId);
        this.getUsers();
    }

    public render() {
        return (
            <div>
                <Navbar />
                <form className={styles.pageContainer}>
                    <div className={styles.pageTitle}>{this.editPageId ? strings.Update : strings.Create} Request </div>
                    <div className={styles.Form}>
                        <div className={styles.leftForm}>
                            <TextField onChange={this.handleChange("RequestName")} label={strings.MirgrationName} value={this.state["RequestName"]} />
                            <UserPicker allTags={this.state.userTags}
                                fieldTitle={strings.SelectUsers}
                                value={this.state.selectedTags}
                                onChange={this.handleUserChange.bind(this)}
                            />
                            <Separator />
                            <MigrationAuth
                                buttonLabel={strings.LoadPages}
                                url={this.state["MigrationSource"]}
                                email={this.state["SPEmailSource"]}
                                password={this.state["SPPasswordSource"]}
                                onChange={this.handleChange}
                                onClick={this.getPages.bind(this)}
                                errorMessage={this.state.errSource}
                                sucessMessage={this.state.succSource}
                            />
                        </div>
                        <Separator vertical />
                        <div className={styles.rightForm}>
                            <MigrationAuth
                                destination
                                buttonLabel={strings.CheckConn}
                                url={this.state["MigrationDest"]}
                                email={this.state["SPEmailDest"]}
                                password={this.state["SPPasswordDest"]}
                                onChange={this.handleChange}
                                onClick={this.checkConnection.bind(this)}
                                errorMessage={this.state.errDest}
                                sucessMessage={this.state.succDest}
                            />
                        </div>
                    </div>
                    <Separator />
                    <div className={styles.LoadPages}>
                        <Label>Select Pages</Label>
                        {this.state.loadingPages ? <Spinner label="Loading pages..." /> :
                            this.state.SPpages.length > 0 ?
                                <DetailsList
                                    checkboxVisibility={CheckboxVisibility.always}
                                    selection={this.selection}
                                    selectionMode={SelectionMode.multiple}
                                    columns={this.columns}
                                    className={styles.list}
                                    items={this.state.SPpages} />
                                : "No Pages loaded"}

                    </div>
                    <div className={styles.buttons}>
                        <PrimaryButton className={styles.button} text={this.editPageId ? strings.Update : strings.Create} onClick={() => this.onSubmit()} />
                    </div>
                </form>
            </div >
        );
    }

    private handleChange = (field: string) => (event: any) => {
        const value = event.target.value;
        this.setState({ [field]: value });
    };

    private handleUserChange(items: ITag[]) {
        const tags = items;
        this.setState({ selectedTags: tags });
    };

    private async getUsers() {
        const response = await axios.get(`User/allUsers`);
        let allUsers: User[] = response.data;
        let tags: ITag[] = allUsers.map((user: User) => ({ key: user.id, name: user.userName }));
        this.setState({ userTags: tags });
    }

    private async onSubmit() {
        if (this.editPageId === "") {
            try {
                let bodyParameters = {
                    requestName: this.state.RequestName,
                    sourceURL: this.state.MigrationSource,
                    destinationURL: this.state.MigrationDest,
                    assignedUsers: this.setAssignedUserIDs(this.state.selectedTags),
                    sharepointPages: this.state.selectedSPpages
                };
                const response = await axios.post("/createRequest", bodyParameters);
                const data = response.data;
                if (data) window.open(window.location.origin + "/migrationRequests", "_self");
            } catch (error) {
                console.log(error);
            }
        }
        else {
            try {
                let bodyParameters = {
                    id: this.editPageId,
                    requestName: this.state.RequestName,
                    sourceURL: this.state.MigrationSource,
                    destinationURL: this.state.MigrationDest,
                    assignedUsers: this.setAssignedUserIDs(this.state.selectedTags),
                    sharepointPages: this.state.selectedSPpages
                };
                const response = await axios.put("/updateRequest", bodyParameters);
                const data = response.data;
                if (data) window.open(window.location.origin + "/migrationRequests", "_self");
            } catch (error) {
                console.log(error);
            }
        }
    }

    private setAssignedUserIDs(tags: ITag[]): any[] {
        let users: any[] = tags.map((tag: ITag) => ({ id: tag.key }));
        return users;
    }

    private async loadEditFormData(id: string) {
        const response = await axios.get(`/viewRequest?id=${id}`);
        if (response && response.data) {
            let data = response.data;
            let assignedUsers: User[] = data.assignedUsers;
            let tags = assignedUsers.map((user: User) => ({ key: user.id, name: user.userName }));
            this.setState({
                selectedTags: tags,
                RequestName: data.requestName,
                MigrationSource: data.sourceURL,
                MigrationDest: data.destinationURL,
            })
        }
    }

    private async getPages() {
        this.setState({ loadingPages: true });
        const response = await axios.get(`SharePoint/getSPPages?userLogin=${this.state.SPEmailSource}&userPassword=${this.state.SPPasswordSource}&siteUrl=${this.state.MigrationSource}`);
        let result: any[] = response.data;
        if (result) {
            this.setState({ loadingPages: false });
            this.setState({ SPpages: result });
        }
        else {
            this.setState({ errSource: strings.errSource });
            this.setState({ loadingPages: false });
        }
    }

    private async checkConnection() {
        const response = await axios.get(`SharePoint?userLogin=${this.state.SPEmailDest}&userPassword=${this.state.SPPasswordDest}&siteUrl=${this.state.MigrationDest}`);
        let result: any[] = response.data;
        if (result) {
            this.setState({ errDest: "" });
            this.setState({ succDest: strings.succDest });
            setTimeout(() => this.setState({ succDest: "" }), 5000);
        }
        else this.setState({ errDest: strings.errDest });
    }

    private selection = new Selection({
        onSelectionChanged: () => {
            let selectedItems = this.selection.getSelection();
            this.setState({ selectedSPpages: selectedItems });
        },
    });

}

export default NewEditRequestPage;