import { ITag, Label, PrimaryButton, TextField } from '@fluentui/react';
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

}


class NewEditRequestPage extends React.Component<{}, NewEditRequestState> {
    private editPageId: string;
    constructor(props: {}) {
        super(props);
        this.editPageId = "";
        this.state = {
            userTags: [],
            selectedTags: [],
            RequestName: "",
            MigrationSource: "",
            MigrationDestination: "",
        }
    }

    public componentDidMount(): void {
        this.getUsers();
        this.editPageId = getRequestIdFromURL(window.location.href) ? getRequestIdFromURL(window.location.href) : "";
        if (this.editPageId) this.loadEditFormData(this.editPageId);
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
                            <TextField onChange={this.handleChange("MigrationSource")} label={strings.MirgrationSource} value={this.state["MigrationSource"]} />
                            <TextField onChange={this.handleChange("MigrationDestination")} label={strings.MirgrationDest} value={this.state["MigrationDestination"]} />
                            <UserPicker setdefaultSelectedItems={this.state.selectedTags} allTags={this.state.userTags} fieldTitle={strings.SelectUsers} setSelectedTags={this.setSelectedTags.bind(this)} />
                        </div>
                        <div className={styles.rightForm}>
                            <Label>Select Pages</Label>
                            <div className={styles.box}>TODO BOX</div>
                        </div>
                    </div>
                    <div className={styles.buttons}>
                        <PrimaryButton className={styles.button} text={this.editPageId ? strings.Edit : strings.Create} onClick={() => this.onSubmit()} />
                    </div>
                </div>
            </div>
        );
    }

    private handleChange = (field: string) => (event: any) => {
        const value = event.target.value;
        this.setState({ [field]: value });
    };

    private setSelectedTags(selectedItems: ITag[]) {
        const tags = selectedItems;
        this.setState({ selectedTags: tags });
    }

    private async getUsers() {
        const response = await axios.get(`User/allUsers`);
        let allUsers: User[] = response.data;
        let tags: ITag[] = allUsers.map((user: User) => ({ key: user.id, name: user.userName }));
        this.setState({ userTags: tags });
    }

    private async onSubmit() {
        if (this.editPageId === "") {
            try {
                const response = await axios.post(`/createRequest?RequestName=${this.state.RequestName}&SourceURL=${this.state.MigrationSource}
            &DestinationURL=${this.state.MigrationDestination}${this.setAssignedUserIDs(this.state.selectedTags)}`);
                const data = response.data;
                if (data) window.open(window.location.origin + "/migrationRequests", "_self");
            } catch (error) {
                console.log(error);
            }
        }
        else {
            try {
                const response = await axios.put(`/updateRequest?id=${this.editPageId}&RequestName=${this.state.RequestName}&SourceURL=${this.state.MigrationSource}&DestinationURL=${this.state.MigrationDestination}${this.setAssignedUserIDs(this.state.selectedTags)}`);
                const data = response.data;
                if (data) window.open(window.location.origin + "/migrationRequests", "_self");
            } catch (error) {
                console.log(error);
            }
        }
    }

    private setAssignedUserIDs(tags: ITag[]): string {
        let result: string[] = [];
        tags.forEach(tag => {
            let id: any = tag.key;
            result.push(id);
        });
        return result ? "&userIDs=" + result.join("&userIDs=") : "";
    }

    private async loadEditFormData(id: string) {
        const response = await axios.get(`/viewRequest?id=${id}`);
        let data = response.data;
        if (data) {
            console.log(response.data);
            this.setState({
                selectedTags: this.getTagsFromUserData(data.assignedUsers),
                RequestName: data.requestName,
                MigrationSource: data.sourceURL,
                MigrationDestination: data.destinationURL,
            })
        }
    }

    private getTagsFromUserData(users: User[]): ITag[] {
        const tags: ITag[] = users.map((user: User) => ({ key: user.id, name: user.userName }));
        console.log(tags);
        return tags;
    }
}

export default NewEditRequestPage;