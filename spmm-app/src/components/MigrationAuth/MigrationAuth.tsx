import { Label, MessageBar, MessageBarType, PrimaryButton, TextField } from '@fluentui/react';
import styles from './MigrationAuth.module.scss';
import React from 'react';
import strings from '../../loc/strings';

interface MigrationAuthProps {
    onChange: any;
    url: string;
    email: string;
    password: string;
    buttonLabel: string;
    onClick: any;
    destination?: boolean;
    errorMessage?: string;
    sucessMessage?: string;
}


class MigrationAuth extends React.Component<MigrationAuthProps, {}> {

    public render() {
        return (
            <div className={styles.migrationAuth}>
                <TextField onChange={this.props.onChange(this.props.destination ? "MigrationDest" : "MigrationSource")} label={this.props.destination ? strings.MirgrationDest : strings.MirgrationSource} value={this.props.url} />
                <Label>Microsoft Authentication for {this.props.destination ? "destination" : "source"}</Label>
                <TextField onChange={this.props.onChange(this.props.destination ? "SPEmailDest" : "SPEmailSource")} label={strings.Email} value={this.props.email} />
                <TextField onChange={this.props.onChange(this.props.destination ? "SPPasswordDest" : "SPPasswordSource")} label={strings.Password} value={this.props.password} type="password" />
                {this.props.errorMessage && (
                    <MessageBar
                        delayedRender={false}
                        messageBarType={MessageBarType.error}>
                        {this.props.errorMessage}
                    </MessageBar>
                )}
                {this.props.sucessMessage && (
                    <MessageBar
                        delayedRender={false}
                        messageBarType={MessageBarType.success}>
                        {this.props.sucessMessage}
                    </MessageBar>
                )}
                <div className={styles.buttons}>
                    <PrimaryButton className={styles.button} text={this.props.buttonLabel} onClick={this.props.onClick} />
                </div>
            </div>
        );
    }

}

export default MigrationAuth;