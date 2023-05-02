export function clearFromNullable<T extends object>(data: T): Partial<T> {
    const request: any = {};

    Object.entries(data)
        .forEach(([key, value]: [string, any]) => {
            if (value) {
                request[key] = value;
            }
        });

    return request as Partial<T>;
}
