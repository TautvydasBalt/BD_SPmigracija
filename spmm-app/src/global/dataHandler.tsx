import axios from "axios";
import { User } from "./globalInterfaces";

axios.defaults.baseURL = "https://localhost:5001/";


export function showData(data: any) {
    return data ? data : '-';
}

export function showAssignedUsersNames(data: User[]) {
    let names: string[] = [];
    if (data) {
        data.forEach((user: User) => {
            names.push(user.userName);
        });
        return names.join(', ');
    }
    else return "-";
}

export function showAssignedPageTitles(data: any[]) {
    let titles: string[] = [];
    if (data) {
        data.forEach((page: any) => {
            titles.push(page.title);
        });
        return titles.join(', ');
    }
    else return "-";
}

export function getRequestIdFromURL(url: string) {
    let urlarr = url.split('/');
    return urlarr[4];
}