export const sampleData = [
    {
      "name": "Project Title",
      "label": "Project Title (mandatory)",
      "value": "titkle",
      "type": "text",
      "placeHolder": "",
      "errorMessage": {
          "required": "Enter the Project Title",
          "minlength":"Min length should be 5",
      },
      "validators": {
          "required": true,
          "minLength": 10
      }
  },
  {
    "name": "Objective",
      "label": "Objective (mandatory)",
      "value": "",
      "type": "text",
      "placeHolder": "",
      "errorMessage": {
          "required": "Enter the Objective",
          "minlength":"Min length should be 5",
      },
      "validators": {
          "required": true,
          "minLength": 10
      }
  },
  {
    "name": "categories",
    "label": "Categories (mandatory)",
    "value":"",
    "type": "chip",
    "disabled": false,
    "errorMessage": {
        "required": "Enter categories for"
    },
    "validators": {
        "required": true
    },
    "options": [
        {
            "label": "Teachers",
            "value": "teachers"
        },
        {
            "label": "Students",
            "value": "students"
        },
        {
            "label": "Infrastructure",
            "value": "infrastructure"
        },
        {
            "label": "Community",
            "value": "community"
        },
        {
            "label": "Education Leader",
            "value": "education leader"
        },
        {
            "label": "School Process",
            "value": "school process"
        },
        {
            "label": "Others",
            "value": "others"
        }
    ],
    "meta": {
        "entityType": "categories",
        "addNewPopupHeader": "Categories",
        "addNewPopupSubHeader": "Who is this session for?",
        "showSelectAll": true,
        "showAddOption": true
    },
    "multiple": true
  },
  {
    "name": "Tasks",
    "label": "",
    "labelHead": "Tasks",
    "value": "",
    "class": "",
    "icon": "",
    "type": "addResource",
    "textForLink": "create tasks for your project",
    "placeHolder": "",
    "position": "floating",
    "listIcon": "",
    "listLabel": "",
    "dialogData": {
        "header": "Add New Task",
        "headerCss": "flex flex-row justify-between items-center bg-[#0a4f9d] h-10",
        "resource": [
            [
                {
                    "name": "name",
                    "label": "Task Description (mandatory)",
                    "value": "",
                    "class": "",
                    "type": "textarea",
                    "placeHolder": "Add task description here",
                    "position": "floating",
                    "errorMessage": {
                        "required": ""
                    },
                    "validators": {
                        "required": true,
                        "maxLength": 255
                    }
                }
                // {
                //     "name": "url",
                //     "label": "Link to the resource",
                //     "value": "",
                //     "class": "",
                //     "type": "text",
                //     "placeHolder": "Link",
                //     "position": "floating",
                //     "errorMessage": {
                //         "required": "Enter link to the resource",
                //         "pattern": "Please add link to resource"
                //     },
                //     "validators": {
                //         "required": true,
                //         "pattern": "^https://[:.a-zA-Z0-9-?/=]+$"
                //     }
                // }
            ]
        ],
        "confirmButton": "Add task",
        "cancelButton": "",
        "addButton": "",
        "addButtonRequired":false
    },
    "errorMessage": {
        "required": "Enter project title"
    },
    "validators": {
        "required": false,
        "maxLength": 255
    }
}

  ]