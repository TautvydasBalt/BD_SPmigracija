import { DefaultButton, PrimaryButton, TextField } from '@fluentui/react';
import React from 'react';
import strings from '../../loc/strings';
import styles from './LoginPage.module.scss';

class LoginPage extends React.Component {
  render() {
    return (
      <div className={styles.loginForm}>
        SPMigration
        <TextField className={styles.textField} label={strings.Username} />
        <TextField className={styles.textField}
          label={strings.Password}
          type="password"
        />
        <div className={styles.buttons}>
          <DefaultButton text={strings.Register} href={window.location.origin + "/register"} />
          <PrimaryButton text={strings.Login} onClick={this.loginClick}/>
        </div>
      </div>
    );
  }

  private loginClick() {
    //todo: API to check credentials
    window.open(window.location.origin+"/migrationRequests", "self");
  }
}

export default LoginPage;