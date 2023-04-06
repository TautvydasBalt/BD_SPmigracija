

export function showData(data: any) {
    return data ? data : '-';
}

export function getRequestIdFromURL(url: string) {
    let urlarr = url.split('/');
    return urlarr[4];
}