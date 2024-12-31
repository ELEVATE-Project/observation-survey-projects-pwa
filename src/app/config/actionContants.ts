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
    ],
    JOURNEY_FILTERS : {
        inProgress : "inProgress",
        completed:"completed",
    },
    REGEX_MAP : {
        images: /^(bmp|gif|jpeg|jpg|png|ico|svg|tif|tiff|webp)$/i,
        videos: /^(avi|mpeg|ogv|mp4|mov|mkv|wmv|ogg|m4v|flv|3gp|3g2)$/i,
        documents: /^(csv|doc|docx|pdf|ppt|pptx|xls|xlsx|odp|ods|odt|rtf|txt|xhtml|xml|xul)$/i,
    }
}
