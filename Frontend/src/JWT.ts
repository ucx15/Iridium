import * as LS from "./LocalStorage.js";
import BACKEND_URI from './config.js';


interface RefreshTokenResponse {
	message: string;
	status: string;
	accessToken?: string;
}

async function refreshAccessToken(): Promise<boolean> {
	const refreshToken = LS.getRefreshToken();

	if ( !refreshToken ) {
		console.log("'JWT.refreshAccessToken()' -> Refresh token not found");
		return false;
	}

	try {
		const resp = await fetch(`${BACKEND_URI}/refresh-token`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ refreshToken }),
		})

		const data = await resp.json() as RefreshTokenResponse;

		if (data.status !== "success" || !data.accessToken) {
			alert(data.message);
			return false;
		}

		LS.setAccessToken(data.accessToken);
		return true;
	}
	catch (error) {
		console.error("Error refreshing token:", error);
		return false;
	}
}

export { refreshAccessToken };
