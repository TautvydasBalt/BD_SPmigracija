import { DetailsList, IColumn, Selection, ITag, IconButton, Label, Modal, PrimaryButton, SelectionMode, TextField } from '@fluentui/react';
import React from 'react';
import strings from '../../loc/strings';
import Navbar from '../../components/NavBar/NavBar';
import styles from './NewEditRequestPage.module.scss';
import UserPicker from '../../components/UserPicker/UserPicker';
import axios from 'axios';
import { User } from '../../global/globalInterfaces';
import { getRequestIdFromURL } from '../../global/dataHandler';

interface NewEditRequestState {
    userTags: ITag[];
    selectedTags: ITag[];

    [key: string]: NewEditRequestState[keyof NewEditRequestState];
    RequestName: string;
    MigrationSource: string;
    MigrationDestination: string;

    SPEmail: string;
    SPPassword: string;
    SPlists: any[];
    selectedSPlists: any[];

    isModalOpen: boolean;
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
            MigrationDestination: "",
            SPEmail: "",
            SPPassword: "",
            SPlists: [],
            selectedSPlists: [],
            isModalOpen: false,
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
                <div className={styles.pageContainer}>
                    <div className={styles.pageTitle}>Create Request </div>
                    <div className={styles.Form}>
                        <div className={styles.leftForm}>
                            <TextField onChange={this.handleChange("RequestName")} label={strings.MirgrationName} value={this.state["RequestName"]} />
                            <TextField onChange={this.handleChange("MigrationDestination")} label={strings.MirgrationDest} value={this.state["MigrationDestination"]} />
                            <UserPicker allTags={this.state.userTags}
                                fieldTitle={strings.SelectUsers}
                                value={this.state.selectedTags}
                                onChange={this.handleUserChange.bind(this)}
                            />
                        </div>
                        <div className={styles.rightForm}>
                            <div className={styles.LoadPages}>
                                <TextField onChange={this.handleChange("MigrationSource")} label={strings.MirgrationSource} value={this.state["MigrationSource"]} />
                                <PrimaryButton className={styles.button} text={strings.LoadPages} onClick={() => this.setState({ isModalOpen: true })} />
                            </div>
                            <Label>Select Pages</Label>
                            {this.state.SPlists.length > 0 ?
                                <DetailsList
                                    selection={this.selection}
                                    selectionMode={SelectionMode.multiple}
                                    columns={this.columns}
                                    className={styles.list}
                                    items={this.state.SPlists} />
                                : "No data loaded"}
                        </div>
                    </div>
                    <div className={styles.buttons}>
                        <PrimaryButton className={styles.button} text={this.editPageId ? strings.Edit : strings.Create} onClick={() => this.onSubmit()} />
                    </div>
                </div>
                <Modal
                    isOpen={this.state.isModalOpen}
                    onDismiss={() => this.setState({ isModalOpen: false })}
                    isBlocking={false}
                >
                    <div className={styles.modal}>
                        <div className={styles.modalTop}>
                            <Label>Connect with Microsoft Credentials</Label>
                            <IconButton
                                iconProps={{ iconName: 'Cancel' }}
                                ariaLabel="Close popup modal"
                                onClick={() => this.setState({ isModalOpen: false })}
                            />
                        </div>
                        <TextField onChange={this.handleChange("SPEmail")} label={strings.Email} value={this.state["SPEmail"]} />
                        <TextField onChange={this.handleChange("SPPassword")} label={strings.Password} value={this.state["SPPassword"]} type="password" />
                        <PrimaryButton className={styles.button} text={strings.Connect} onClick={this.getPages.bind(this)} />
                    </div>
                </Modal>
            </div>
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
                    destinationURL: this.state.MigrationDestination,
                    assignedUsers: this.setAssignedUserIDs(this.state.selectedTags),
                    sharepointLists: this.state.selectedSPlists
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
                    destinationURL: this.state.MigrationDestination,
                    assignedUsers: this.setAssignedUserIDs(this.state.selectedTags),
                    sharepointLists: this.state.selectedSPlists
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
                MigrationDestination: data.destinationURL,
            })
        }
    }

    private async getPages() {
        const response = await axios.get(`SharePointUser/getSharepointLists?userLogin=${this.state.SPEmail}&userPassword=${this.state.SPPassword}&siteUrl=${this.state.MigrationSource}`);
        let result: any[] = response.data;
        this.setState({ SPlists: result });
        this.setState({ isModalOpen: false });
    }

    private selection = new Selection({
        onSelectionChanged: () => {
            let selectedItems = this.selection.getSelection();
            this.setState({ selectedSPlists: selectedItems });
        },
    });

}

export default NewEditRequestPage;