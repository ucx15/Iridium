import * as LS from "./LocalStorage.js";
import BACKEND_URI from '../config.js';


interface RefreshTokenResponse {
	message: string;
	status: string;
	accessToken?: string;
}

// TODO: Add redirection to '/auth' if refresh token expires
async function refreshAccessToken(): Promise<boolean> {
	const refreshToken = LS.getRefreshToken();
	const username = LS.getUsername();

	if ( !refreshToken || !username) {
		console.error("ERROR: Missing Refresh Token or Username");
		return false;
	}

	try {
		const resp = await fetch(`${BACKEND_URI}/refresh-token`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ refreshToken, username}),
		})

		const data = await resp.json() as RefreshTokenResponse;
		console.log(`refreshAccessToken() -> '${data.status}' : ${data.message}`);

		if (resp.ok && data.status === "success" && data.accessToken) {
			LS.setAccessToken(data.accessToken);
			return true;
		}

		return false;
	}

	catch (error) {
		console.error("Error refreshing token:", error);
		return false;
	}
}

export { refreshAccessToken };
