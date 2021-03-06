import { API_BASE_URL, POLL_LIST_SIZE, ACCESS_TOKEN } from '../constants';

const request = (options) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
    })

    if (localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }

    const defaults = { headers: headers };
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
        .then(response =>
            response.json().then(json => {
                if (!response.ok) {
                    return Promise.reject(json);
                }
                return json;
            })
        );
};

const requestFile = (options) => {
    const headers = new Headers({
        //'content-type': 'multipart/form-data'
        //'Content-Type': 'application/json',
    })

    if (localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }

    const defaults = { headers: headers };
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
        .then(response =>
            response.json().then(json => {
                if (!response.ok) {
                    return Promise.reject(json);
                }
                return json;
            })
        );
};

export function getAllPolls(page, size) {
    page = page || 0;
    size = size || POLL_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/booths?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function uploadFile(file) {
    let data = new FormData();
    //data.append('enctype','multipart/form-data');
    data.append('file', file);
    return requestFile({
        url: API_BASE_URL + "/uploadFile",
        method: 'POST',
        body: data
    });


    // const headers = new Headers({
    //     // 'content-type': 'multipart/form-data'
    //     //'Content-Type': 'application/json',
    //  })
    //  headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN));

    // fetch(API_BASE_URL + "/uploadFile", {
    //   method: 'POST',
    //   headers: headers,
    //   body: data
    // }).then(response => {
    //   this.setState({error: '', msg: 'Sucessfully uploaded file'});
    // }).catch(err => {
    //   this.setState({error: err});
    // });

}

export function createBooth(boothData) {

    console.log("boothData:" + JSON.stringify(boothData));

    return request({
        url: API_BASE_URL + "/booths",
        method: 'POST',
        body: JSON.stringify(boothData)
    });
}

export function castVote(voteData) {
    return request({
        url: API_BASE_URL + "/booths/" + voteData.pollId + "/votes",
        method: 'POST',
        body: JSON.stringify(voteData)
    });
}

export function login(loginRequest) {
    return request({
        url: API_BASE_URL + "/account/signin",
        method: 'POST',
        body: JSON.stringify(loginRequest)
    });
}

export function signup(signupRequest) {
    return request({
        url: API_BASE_URL + "/account/signup",
        method: 'POST',
        body: JSON.stringify(signupRequest)
    });
}

export function checkUsernameAvailability(username) {
    return request({
        url: API_BASE_URL + "/user/checkUsernameAvailability?username=" + username,
        method: 'GET'
    });
}

export function checkEmailAvailability(email) {
    return request({
        url: API_BASE_URL + "/user/checkEmailAvailability?email=" + email,
        method: 'GET'
    });
}

export function getCurrentUser() {
    if (!localStorage.getItem(ACCESS_TOKEN)) {

        return Promise.reject("No access token set.");
    }

    console.log("ACCESS_TOKEN:" + ACCESS_TOKEN);

    return request({
        url: API_BASE_URL + "/user/me",
        method: 'GET'
    });
}

export function getUserProfile(username) {
    return request({
        url: API_BASE_URL + "/users/" + username,
        method: 'GET'
    });
}

export function getUserCreatedPolls(username, page, size) {
    page = page || 0;
    size = size || POLL_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/users/" + username + "/booths?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function getUserVotedPolls(username, page, size) {
    page = page || 0;
    size = size || POLL_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/users/" + username + "/votes?page=" + page + "&size=" + size,
        method: 'GET'
    });
}