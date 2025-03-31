function validateRequestBody(body: Record<string, any>, fields: string[]): Record<string, string> | null {
    let newBody: Record<string, string> = {};
    for (let field of fields) {
        const value = body[field];
        if (!value || !value.trim()) {
            return null;
        }
        newBody[field] = value.trim();
    }
    return newBody;
}

export default validateRequestBody;
