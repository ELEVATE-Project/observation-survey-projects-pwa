import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-generic-report',
  templateUrl: './generic-report.component.html',
  styleUrls: ['./generic-report.component.scss'],
})
export class GenericReportComponent  implements OnInit {
  reportDetails!:any;
  constructor() { }

  ngOnInit() {
    const data = [
      {
          "order": "Q1_1612265113693-1612513347363",
          "question": "Which class does your child study in?",
          "responseType": "number",
          "answers": [
              "2"
          ],
          "chart": {},
          "instanceQuestions": [],
          "criteriaName": "Survey and Feedback",
          "criteriaId": "601d00437d4c835cf8b72467"
      },
      {
          "order": "Q2_1612265113693-1612513347364",
          "question": "Are you currently living  in the vicinity of the school?",
          "responseType": "radio",
          "answers": [
              "R2"
          ],
          "chart": {},
          "instanceQuestions": [],
          "criteriaName": "Survey and Feedback",
          "criteriaId": "601d00437d4c835cf8b72467",
          "optionsAvailableForUser": [
              {
                  "value": "R1",
                  "label": "Yes"
              },
              {
                  "value": "R2",
                  "label": "No"
              }
          ]
      },
      {
          "order": "Q3_1612265113693-1612513347365",
          "question": "Are you planning to come back?",
          "responseType": "radio",
          "answers": [
              "R2"
          ],
          "chart": {},
          "instanceQuestions": [],
          "criteriaName": "Survey and Feedback",
          "criteriaId": "601d00437d4c835cf8b72467",
          "optionsAvailableForUser": [
              {
                  "value": "R1",
                  "label": "Yes"
              },
              {
                  "value": "R2",
                  "label": "No"
              }
          ]
      },
      {
          "order": "Q4_1612265113693-1612513347367",
          "question": "What type of device is available at home?",
          "responseType": "multiselect",
          "answers": [
              "R3",
              "R5"
          ],
          "chart": {},
          "instanceQuestions": [],
          "criteriaName": "Survey and Feedback",
          "criteriaId": "601d00437d4c835cf8b72467",
          "optionsAvailableForUser": [
              {
                  "value": "R1",
                  "label": "Simple mobile phone without internet/data pack"
              },
              {
                  "value": "R2",
                  "label": "Smart phone with internet/data pack"
              },
              {
                  "value": "R3",
                  "label": "Smart phone without internet/data pack"
              },
              {
                  "value": "R4",
                  "label": "TV"
              },
              {
                  "value": "R5",
                  "label": "Radio"
              }
          ]
      },
      {
          "order": "Q5_1612265113693-1612513347369",
          "question": "Does the child have a quiet place to study?",
          "responseType": "radio",
          "answers": [
              "R1"
          ],
          "chart": {},
          "instanceQuestions": [],
          "criteriaName": "Survey and Feedback",
          "criteriaId": "601d00437d4c835cf8b72467",
          "optionsAvailableForUser": [
              {
                  "value": "R1",
                  "label": "Yes"
              },
              {
                  "value": "R2",
                  "label": "No"
              }
          ]
      },
      {
          "order": "Q6_1612265113693-1612513347370",
          "question": "Were you able to enroll your child in courses on Diksha?",
          "responseType": "radio",
          "answers": [
              "R1"
          ],
          "chart": {},
          "instanceQuestions": [],
          "criteriaName": "Survey and Feedback",
          "criteriaId": "601d00437d4c835cf8b72467",
          "optionsAvailableForUser": [
              {
                  "value": "R1",
                  "label": "Yes"
              },
              {
                  "value": "R2",
                  "label": "No"
              }
          ]
      },
      {
          "order": "Q7_1612265113693-1612513347371",
          "question": "What are the challenges that you are facing in enrolment?",
          "responseType": "multiselect",
          "answers": [
              "R1","R3"
          ],
          "chart": {},
          "instanceQuestions": [],
          "criteriaName": "Survey and Feedback",
          "criteriaId": "601d00437d4c835cf8b72467",
          "optionsAvailableForUser": [
              {
                  "value": "R1",
                  "label": "Not able to use the app"
              },
              {
                  "value": "R2",
                  "label": "Not aware of classrooms on DIKSHA"
              },
              {
                  "value": "R3",
                  "label": "Not aware of the enrolment process in the classroom"
              },
              {
                  "value": "R4",
                  "label": "Not aware of enrolment process in the courses"
              },
              {
                  "value": "R5",
                  "label": "Don't find the courses useful"
              },
              {
                  "value": "R6",
                  "label": "Others"
              }
          ],
          "evidences": [
            {
                "url": "https://images.pexels.com/photos/87651/earth-blue-planet-globe-planet-87651.jpeg",
                "extension": "jpg"
            },
            {
              "url":"https://pdfobject.com/pdf/sample.pdf",
              "extension":"pdf"
            }
        ],
        "evidence_count": 2
      },
      {
          "order": "Q8_1612265113693-1612513347373",
          "question": "On basis of the responses received above, do you think this student is a potential drop out?",
          "responseType": "radio",
          "answers": [
              "R1"
          ],
          "chart": {},
          "instanceQuestions": [],
          "criteriaName": "Survey and Feedback",
          "criteriaId": "601d00437d4c835cf8b72467",
          "optionsAvailableForUser": [
              {
                  "value": "R1",
                  "label": "Yes"
              },
              {
                  "value": "R2",
                  "label": "No"
              }
          ]
      }
  ]
  this.reportDetails = this.processSurveyData(data);

  }

  processSurveyData(data: any[]): any[] {
    return data.map(question => {
      const processedQuestion = { ...question };
      
      processedQuestion.answers = question.answers.map((answer: any) => {
        const option = question.optionsAvailableForUser?.find((opt: { value: any; }) => opt.value === answer);
        return option ? option.label : answer == '' ? 'NA' : answer;
      });

      // Optionally, remove the optionsAvailableForUser if it's not needed
      delete processedQuestion.optionsAvailableForUser;

      return processedQuestion;
    });
  }

  openUrl(url: string) {
    window.open(url, '_blank');
  }

}
