function getUsername(): string | null {
	return localStorage.getItem('username');
}
function getAccessToken(): string | null {
	return localStorage.getItem('accessToken');
}
function getRefreshToken(): string | null {
	return localStorage.getItem('refreshToken');
}


function setUsername(username: string) {
	localStorage.setItem('username', username);
}
function setAccessToken(token: string) {
	localStorage.setItem('accessToken', token);
}
function setRefreshToken(token: string) {
	localStorage.setItem('refreshToken', token);
}

function clear() {
	localStorage.clear();
}

export {
	getUsername,
	getAccessToken,
	getRefreshToken,

	setUsername,
	setAccessToken,
	setRefreshToken,

	clear
}