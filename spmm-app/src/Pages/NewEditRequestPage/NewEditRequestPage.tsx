import { ITag, Label, PrimaryButton, TextField } from '@fluentui/react';
import React from 'react';
import strings from '../../loc/strings';
import Navbar from '../../components/NavBar/NavBar';
import styles from './NewEditRequestPage.module.scss';
import UserPicker from '../../components/UserPicker/UserPicker';
import axios from 'axios';
import { User } from '../../global/globalInterfaces';

interface NewEditRequestState {
    userTags: ITag[];
    selectedTags: ITag[];

    [key: string]: NewEditRequestState[keyof NewEditRequestState];
    MigrationName: string;
    MigrationSource: string;
    MigrationDestination: string;

}


class NewEditRequestPage extends React.Component<{}, NewEditRequestState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            userTags: [],
            selectedTags: [],
            MigrationName: "",
            MigrationSource: "",
            MigrationDestination: "",
        }
    }

    public componentDidMount(): void {
        this.getUsers();
    }

    public render() {
        return (
            <div>
                <Navbar />
                <div className={styles.pageTitle}>Create Request </div>
                <div className={styles.Form}>
                    <div className={styles.leftForm}>
                        <TextField onChange={this.handleChange("MigrationName")} label={strings.MirgrationName} value={this.state["MigrationName"]} />
                        <TextField onChange={this.handleChange("MigrationSource")} label={strings.MirgrationSource} value={this.state["MigrationSource"]} />
                        <TextField onChange={this.handleChange("MigrationDestination")} label={strings.MirgrationDest} value={this.state["MigrationDestination"]} />
                        <UserPicker allTags={this.state.userTags} fieldTitle={strings.SelectUsers} setSelectedTags={this.setSelectedTags.bind(this)} />
                    </div>
                    <div className={styles.rightForm}>
                        <Label>Select Pages</Label>
                        <div className={styles.box}>TODO BOX</div>
                    </div>
                </div>
                <div className={styles.buttons}>
                    <PrimaryButton className={styles.button} text={strings.Create} onClick={() => this.onSubmit()} />
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

    private onSubmit(id?: number) {
        console.log(this.state);

    }
}

export default NewEditRequestPage;