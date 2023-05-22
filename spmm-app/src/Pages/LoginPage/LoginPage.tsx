import { DefaultButton, PrimaryButton, TextField } from '@fluentui/react';
import React from 'react';
import strings from '../../loc/strings';
import styles from './LoginPage.module.scss';
import axios from "axios";

class LoginPage extends React.Component<{}, {}> {
  private userName: string;
  private password: string;

  constructor(props: {}) {
    super(props);
    this.userName = "";
    this.password = "";
  }

  render() {
    return (
      <form className={styles.loginForm}>
        SPMigration
        <TextField className={styles.textField} onChange={this.handleTextFieldChangeUsername} label={strings.Username} />
        <TextField className={styles.textField} onChange={this.handleTextFieldChangePassword}
          label={strings.Password}
          type="password"
        />
        <div className={styles.buttons}>
          <DefaultButton text={strings.Register} href={window.location.origin + "/register"} />
          <PrimaryButton className={styles.button} text={strings.Login} onClick={this.loginClick.bind(this)} />
        </div>
      </form>
    );
  }

  private handleTextFieldChangeUsername = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
    if (newValue) this.userName = newValue;
  };

  private handleTextFieldChangePassword = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
    if (newValue) this.password = newValue;
  };

  private async loginClick() {
    try {
      const response = await axios.get(`/User/login?userName=${this.userName}&password=${this.password}`);
      const data = response.data;
      if (data) window.open(window.location.origin + "/migrationRequests", "_self");
      else console.log("Incorrect username or password");
    } catch (error) {
      console.log(error);
    }
  }
}

export default LoginPage;