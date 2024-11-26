export const actions = {
    INTERVALS : {
        weekly:"WEEKLY",
        monthly:"MONTHLY",
        quarterly:"QUARTERLY"
    },
    PROJECT_FILTERS : [
        { value: 'assignedToMe', label: 'ASSIGNED_TO_ME' },
        { value: 'discoveredByMe', label: 'DISCOVERED_BY_ME' }
    ],
    PROGRAM_FILTERS : [
        {value : 'all' , label : 'ALL'},
        {value :'projects',label:"PROJECTS"},
        {value:"surveys",label:"SURVEYS"}
    ],
    LANGUAGES:[
        { value: 'en', name: 'English' },
        { value: 'hi', name: 'Hindi' },
    ]
}
