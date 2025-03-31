
function validateRequestBody(body, fields) {
	let newBody = {}
	for (let field of fields) {
		const value = body[field];
		if (!value || !value.trim()) {
			return null;
		}
		newBody[field] = value.trim();
	}
	return newBody;
}

module.exports = { validateRequestBody };
