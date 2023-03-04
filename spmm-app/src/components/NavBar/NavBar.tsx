import React from 'react';
import { Link } from "react-router-dom";
import styles from './NavBar.module.scss';


class NavBar extends React.Component {
    render() {
        return (
            <div>
                <ul className={styles.nav}>
                    <li className={styles.navItem}>
                        <Link to="/migrationRequests">Migration Requests</Link>
                    </li>
                    <li className={styles.navItem}>
                        <Link to="/createRequest">Create Request</Link>
                    </li>
                    <li className={styles.navItem}>
                        <Link to="/migrationRequestsHistory">Migration History</Link>
                    </li>
                </ul>
            </div>
        );
    }


}

export default NavBar;