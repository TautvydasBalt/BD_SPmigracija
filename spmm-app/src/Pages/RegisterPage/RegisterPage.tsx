import { PrimaryButton, TextField } from '@fluentui/react';
import axios from 'axios';
import React from 'react';
import strings from '../../loc/strings';
import styles from './RegisterPage.module.scss';

class RegisterPage extends React.Component<{}, {}> {
  private userName: string;
  private password: string;
  private email: string;

  constructor(props: {}) {
    super(props);
    this.userName = "";
    this.password = "";
    this.email = "";
  }

  render() {
    return (
      <form className={styles.loginForm}>
        Register
        <TextField className={styles.textField} onChange={this.handleTextFieldChangeUsername} label={strings.Username} />
        <TextField className={styles.textField} onChange={this.handleTextFieldChangePassword}
          label={strings.Password}
          type="password"
        />
        <TextField className={styles.textField}
          label={strings.Password}
          type="password"
        />
        <TextField className={styles.textField} onChange={this.handleTextFieldChangeEmail} label={strings.Email} />
        <div className={styles.buttons}>
          <PrimaryButton className={styles.button} text={strings.Register} onClick={this.registerUser.bind(this)} />
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

  private handleTextFieldChangeEmail = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
    if (newValue) this.email = newValue;
  };


  private async registerUser() {
    try {
      const response = await axios.post(`/User/register?userName=${this.userName}&password=${this.password}&email=${this.email}`);
      const data = response.data;
      if (data) window.open(window.location.origin + "/", "_self");
    } catch (error) {
      console.log(error);
    }
  }
}

export default RegisterPage;