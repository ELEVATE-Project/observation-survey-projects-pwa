import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mi-details',
  templateUrl: './mi-details.page.html',
  styleUrls: ['./mi-details.page.scss'],
})
export class MiDetailsPage implements OnInit {
  headerConfig: any = {
    showBackButton:true,
    customActions: [{ icon: 'bookmark-outline', actionName: 'save' }]
  };
  details:any={
    "_id": "66d07eaf022c0ec7976687bc",
    "description": "Encourage school leaders to learn about various digital initiatives and share ideas that would be implemented in their schools.",
    "concepts": [
        ""
    ],
    "keywords": [
        "Smart Learn, Assembly"
    ],
    "isDeleted": false,
    "recommendedFor": [
        "Head Master/Mistress (HM)",
        "Principal",
        "Head Teacher",
        "Elementary School Head Master (ESHM)"
    ],
    "tasks": [
        {
            "_id": "66d08150022c0ec7976687f1",
            "createdBy": "162",
            "updatedBy": "162",
            "isDeleted": false,
            "isDeletable": false,
            "taskSequence": [
                "3.0-1724326310648",
                "4.0-1724326310647"
            ],
            "children": [
                {
                    "_id": "66d08150022c0ec7976687f4",
                    "createdBy": "162",
                    "updatedBy": "162",
                    "isDeleted": false,
                    "isDeletable": false,
                    "taskSequence": [],
                    "children": [],
                    "visibleIf": [
                        {
                            "operator": "===",
                            "_id": "66d08150022c0ec7976687f1",
                            "value": "started"
                        }
                    ],
                    "hasSubTasks": false,
                    "learningResources": [
                        {
                            "name": "Link-TEst",
                            "link": "https://www.youtube.com/watch?v=FtDv-L1stdo",
                            "app": "projectService",
                            "id": "watch?v=FtDv-L1stdo"
                        }
                    ],
                    "deleted": false,
                    "type": "content",
                    "name": "subtask to welcome parent teckde",
                    "externalId": "3.0-1724326310648",
                    "description": "",
                    "sequenceNumber": "2",
                    "metaInformation": {
                        "hasAParentTask": "YES",
                        "parentTaskOperator": "EQUALS",
                        "parentTaskValue": "started",
                        "parentTaskId": "2.0-1724326310649",
                        "minNoOfSubmissionsRequired": "subTask1",
                        "startDate": "06/05/24",
                        "endDate": "10/05/24"
                    },
                    "solutionDetails": {
                        "solutionType": "",
                        "solutionId": "",
                        "solutionSubType": ""
                    },
                    "updatedAt": "2024-08-29T14:10:24.880Z",
                    "createdAt": "2024-08-29T14:10:24.865Z",
                    "parentId": "66d08150022c0ec7976687f1"
                },
                {
                    "_id": "66d08150022c0ec7976687f9",
                    "createdBy": "162",
                    "updatedBy": "162",
                    "isDeleted": false,
                    "isDeletable": false,
                    "taskSequence": [],
                    "children": [],
                    "visibleIf": [
                        {
                            "operator": "===",
                            "_id": "66d08150022c0ec7976687f1",
                            "value": "started"
                        }
                    ],
                    "hasSubTasks": false,
                    "learningResources": [
                        {
                            "name": "Link-TEst-2",
                            "link": "https://www.youtube.com/watch?v=7xNHz6lwxYs",
                            "app": "projectService",
                            "id": "watch?v=7xNHz6lwxYs"
                        }
                    ],
                    "deleted": false,
                    "type": "content",
                    "name": "subtask to welcome parent teckde-2",
                    "externalId": "4.0-1724326310647",
                    "description": "",
                    "sequenceNumber": "3",
                    "metaInformation": {
                        "hasAParentTask": "YES",
                        "parentTaskOperator": "EQUALS",
                        "parentTaskValue": "started",
                        "parentTaskId": "2.0-1724326310649",
                        "minNoOfSubmissionsRequired": "subTask1",
                        "startDate": "07/05/24",
                        "endDate": "10/05/24"
                    },
                    "solutionDetails": {
                        "solutionType": "",
                        "solutionId": "",
                        "solutionSubType": ""
                    },
                    "updatedAt": "2024-08-29T14:10:24.898Z",
                    "createdAt": "2024-08-29T14:10:24.890Z",
                    "parentId": "66d08150022c0ec7976687f1"
                }
            ],
            "visibleIf": [],
            "hasSubTasks": true,
            "learningResources": [
                {
                    "name": "Test-3-link",
                    "link": "https://www.youtube.com/watch?v=PXcYBhvYc30",
                    "app": "projectService",
                    "id": "watch?v=PXcYBhvYc30"
                }
            ],
            "deleted": false,
            "type": "content",
            "name": "Todays welcome paret teckde",
            "externalId": "2.0-1724326310649",
            "description": "",
            "sequenceNumber": "1",
            "metaInformation": {
                "hasAParentTask": "NO",
                "parentTaskOperator": "",
                "parentTaskValue": "",
                "parentTaskId": "",
                "minNoOfSubmissionsRequired": "",
                "startDate": "05/05/24",
                "endDate": "10/05/24"
            },
            "solutionDetails": {
                "solutionType": "",
                "solutionId": "",
                "solutionSubType": ""
            },
            "updatedAt": "2024-08-29T14:10:24.893Z",
            "createdAt": "2024-08-29T14:10:24.852Z"
        }
    ],
    "learningResources": [
        {
            "name": "View the learning resources to understand about Smart Learn",
            "link": "https://diksha.gov.in/resources/play/content/do_31400164030265753613820",
            "app": "Diksha",
            "id": "do_31400164030265753613820"
        }
    ],
    "isReusable": true,
    "taskSequence": [
        "2.0-1724326310649"
    ],
    "deleted": false,
    "title": "Tech Skill Club- Smart Learn",
    "externalId": "TSCSLHAR000",
    "categories": [
        {
            "_id": "66399dff04785762f7e8e4c7",
            "externalId": "teacher",
            "name": "Teacher"
        }
    ],
    "entityType": "",
    "taskCreationForm": "",
    "status": "published",
    "programInformation": {},
    "solutionInformation": {}
}
  constructor(private router: Router) { }

  ngOnInit() {
  }

  handleSaveClick(event:any){
  }

  starImporvement(){
    this.router.navigate(['/mi-details/add-problem-statement']);
  }
}
