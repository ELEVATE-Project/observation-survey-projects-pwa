export const locationPayload = {
    getOptionList: (entityType: string, parentId: string, userId: string | null) => ({
        params: {},
        request: {
            filters: {
                type: entityType,
                parentId: parentId
            },
            userId: userId
        }
    }),

    getSchoolList: (parentId: string) => ({
        request: {
            filters: {
                isSchool: true,
                status: 1,
                'orgLocation.id': parentId
            }
        }
    })
};
