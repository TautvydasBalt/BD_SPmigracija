import { DefaultButton, PrimaryButton, TextField } from '@fluentui/react';
import React from 'react';
import strings from '../loc/strings';
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
          <DefaultButton text={strings.Register} />
          <PrimaryButton text={strings.Login} />
        </div>
      </div>
    );
  }
}

export default LoginPage;