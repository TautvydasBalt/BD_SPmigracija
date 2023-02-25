import { PrimaryButton, TextField } from '@fluentui/react';
import React from 'react';
import strings from '../../loc/strings';
import styles from './RegisterPage.module.scss';

class RegisterPage extends React.Component {
  render() {
    return (
      <div className={styles.loginForm}>
        Register
        <TextField className={styles.textField} label={strings.Username} />
        <TextField className={styles.textField}
          label={strings.Password}
          type="password"
        />
        <TextField className={styles.textField}
          label={strings.Password}
          type="password"
        />
        <div className={styles.buttons}>
          <PrimaryButton text={strings.Register} />
        </div>
      </div>
    );
  }
}

export default RegisterPage;