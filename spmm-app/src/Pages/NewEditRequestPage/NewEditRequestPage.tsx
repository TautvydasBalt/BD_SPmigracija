import { PrimaryButton, TextField } from '@fluentui/react';
import axios from 'axios';
import React from 'react';
import strings from '../../loc/strings';
import Navbar from '../../components/NavBar/NavBar';
import styles from './NewEditRequestPage.module.scss';

class NewEditRequestPagePage extends React.Component<{}, {}> {
    private MigrationName: string;
    private MigrationSource: string;

    constructor(props: {}) {
        super(props);
        this.MigrationName = "";
        this.MigrationSource = "";
    }

    render() {
        return (
            <div>
                <Navbar />
                <div className={styles.pageTitle}>Create Request </div>
                <TextField onChange={this.handleTextFieldChangeMigrationName} label={strings.MirgrationName} />
                <TextField onChange={this.handleTextFieldChangeMigrationSource} label={strings.MirgrationSource} />
                <TextField onChange={this.handleTextFieldChangeMigrationSource} label={strings.MirgrationDest} />
                <div >
                </div>
            </div>
        );
    }

    private handleTextFieldChangeMigrationName = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        if (newValue) this.MigrationName = newValue;
    };

    private handleTextFieldChangeMigrationSource = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        if (newValue) this.MigrationSource = newValue;
    };

}

export default NewEditRequestPagePage;