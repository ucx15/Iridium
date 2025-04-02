function validateRequestBody(
    body: Record<string, any>,
    fields: string[],
    optional?: string[])
    : {
        body: Record<string, string> | null,
        optional?: Record<'media', string[]>
    } {
    let newBody: Record<string, string> | null = {};
    let optionalBody: Record<'media', string[] > | undefined;

    for (let field of fields) {
        const value = body[field];
        if (!value || !value.trim()) {
            newBody = null;
            break;
        }
        newBody[field] = value.trim();
    }

    if ( optional ) {
        const media = body['media'];
        if (media && media.length > 0) {
            optionalBody = {media};
        }
    }

    return {
        body: newBody,
        optional: optionalBody? optionalBody : undefined
    };
}

export default validateRequestBody;

// TODO() : Only support 'media : string[]' in optional right now
