import { ITag, TextField } from '@fluentui/react';
import React from 'react';
import strings from '../../loc/strings';
import Navbar from '../../components/NavBar/NavBar';
import styles from './NewEditRequestPage.module.scss';
import UserPicker from '../../components/UserPicker/UserPicker';
import axios from 'axios';
import { User } from '../../global/globalInterfaces';

class NewEditRequestPagePage extends React.Component<{}, {}> {
    private userTags: ITag[];

    private MigrationName: string;
    private MigrationSource: string;

    constructor(props: {}) {
        super(props);
        this.MigrationName = "";
        this.MigrationSource = "";
        this.userTags = [];
    }

    public componentDidMount(): void {
        this.getUsers();
    }

    public render() {
        return (
            <div>
                <Navbar />
                <div className={styles.pageTitle}>Create Request </div>
                <TextField onChange={this.handleTextFieldChangeMigrationName} label={strings.MirgrationName} />
                <TextField onChange={this.handleTextFieldChangeMigrationSource} label={strings.MirgrationSource} />
                <TextField onChange={this.handleTextFieldChangeMigrationSource} label={strings.MirgrationDest} />
                <UserPicker allTags={this.userTags} fieldTitle={strings.SelectUsers} />
            </div>
        );
    }

    private handleTextFieldChangeMigrationName = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        if (newValue) this.MigrationName = newValue;
    };

    private handleTextFieldChangeMigrationSource = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        if (newValue) this.MigrationSource = newValue;
    };

    private async getUsers() {
        const response = await axios.get(`User/allUsers`);
        let allUsers: User[] = response.data;
        let tags: ITag[] = allUsers.map((user: User) => ({ key: user.id, name: user.userName }));
        this.setState({ userTags: tags });
    }
}

export default NewEditRequestPagePage;