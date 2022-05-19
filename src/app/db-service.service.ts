import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { mockQuiz } from './constants/lessonButton';
import { Storage } from '@ionic/storage';
import { lessonButtons } from './constants/lessonButton';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';

@Injectable({
  providedIn: 'root'
})
export class DbServiceService {

  private dbInstance: SQLiteObject;
  readonly db_name: string = "lms.db";
  readonly db_table: string = "teacher";
  USERS: Array <any> ;

  constructor(
    private platform: Platform,
    private sqlite: SQLite,
    private storage: Storage,
    private splashScreen: SplashScreen
    ) { 
      
    }

    // Create SQLite database 
    async databaseConn() {
      await this.platform.ready().then(async () => {
        console.log('ready');
        await this.sqlite.create({
            name: this.db_name,
            location: 'default'
          }).then(async (sqLite: SQLiteObject) => {
            this.dbInstance = sqLite;
            await sqLite.executeSql(`
                CREATE TABLE IF NOT EXISTS ${this.db_table} (
                  user_id INTEGER PRIMARY KEY, 
                  username varchar(255),
                  password varchar(255)
                )`, [])
              .then((res) => {
                // alert(JSON.stringify(res));
              })
              .catch((error) => alert(JSON.stringify(error)));

              await sqLite.executeSql(`
              CREATE TABLE IF NOT EXISTS quiztbl (
                quiz_id INTEGER PRIMARY KEY, 
                lesson varchar(255),
                question varchar(255),
                answer varchar(255),
                a1 varchar(255),
                a2 varchar(255),
                a3 varchar(255)
              )`, [])
            .then((res) => {
              // alert(JSON.stringify(res));
            })
            .catch((error) => alert(JSON.stringify(error)));

            await sqLite.executeSql(`
              CREATE TABLE IF NOT EXISTS quizGroup (
                quiz_id INTEGER PRIMARY KEY, 
                groupId varchar(255),
                groupName varchar(255)
              )`, [])
            .then((res) => {
              // alert(JSON.stringify(res));
            })
            .catch((error) => alert(JSON.stringify(error)));

            await sqLite.executeSql(`
                CREATE TABLE IF NOT EXISTS scores (
                  score_id INTEGER PRIMARY KEY, 
                  user_id varchar(255),
                  category_id varchar(255),
                  score varchar(255)
                )`, [])
              .then((res) => {
                // alert(JSON.stringify(res));
              })
              .catch((error) => alert(JSON.stringify(error)));

              await sqLite.executeSql(`
                CREATE TABLE IF NOT EXISTS scoresActivity (
                  scoreact_id INTEGER PRIMARY KEY, 
                  user_id varchar(255),
                  category_id varchar(255),
                  score varchar(255)
                )`, [])
              .then((res) => {
                // alert(JSON.stringify(res));
              })
              .catch((error) => alert(JSON.stringify(error)));

              await sqLite.executeSql(`
              CREATE TABLE IF NOT EXISTS newLessontbl (
                lesson_id INTEGER PRIMARY KEY, 
                lessonName varchar(255),
                lock varchar(255),
                imgSrc1 varchar(255),
                imgSrc2 varchar(255),
                imgSrc3 varchar(255),
                imgSrc4 varchar(255),
                imgSrc5 varchar(255))`, [])
            .then((res) => {
              // alert(JSON.stringify(res));
            })
            .catch((error) => alert(JSON.stringify(error)));
          })
          .catch((error) => alert(JSON.stringify(error)));
          
      });

      const isInit = await this.storage.get('l0-lock');
      if(isInit == null || isInit == undefined) {
        await this.storage.set('l0-lock', true);
        await this.storage.set('l1-lock', true);
        await this.storage.set('l2-lock', true);
        await this.storage.set('l3-lock', true);
        await this.storage.set('l4-lock', true);
        await this.storage.set('l5-lock', true);
        await this.storage.set('l6-lock', true);
        await this.storage.set('l7-lock', true);
        await this.storage.set('l8-lock', true);
        await this.storage.set('l9-lock', true);
        await this.storage.set('l10-lock', true);
        await this.storage.set('l11-lock', true);
        await this.storage.set('l12-lock', true);
      }

      this.splashScreen.hide();
  }

  async initQuizComponent() {
      for(let i = 0; i < mockQuiz.length; i++) {
        await this.addQuiz(mockQuiz[i].lessonId, mockQuiz[i].question, mockQuiz[i].answer, mockQuiz[i].a1, mockQuiz[i].a2, mockQuiz[i].a3);
      }
      await this.addGroupQuiz(0, 'Mock up Exam');
      await this.storage.set('initApp', true);
  }

  async registerUser(username: string, password: string) {
    let result = null, res = [];
    await this.dbInstance.executeSql(`INSERT INTO ${this.db_table} (username, password)
    SELECT * FROM (SELECT ?, ?) AS tmp
    WHERE NOT EXISTS (
      SELECT username FROM ${this.db_table} WHERE username = ?
  ) LIMIT 1;`, [username, password, username]).then(async (data) => {
      console.log("INSERTED: " + JSON.stringify(data));
      if(data.rowsAffected == 0) {
        alert('User is existing');
        result = false;
      } else {
        result = await this.login(username, password);
      }
    }, (error) => {
      console.log("ERROR: " + alert(error.err));
    });
    return result;
  }

  async getStudentList(){
    let result = [];
    await this.dbInstance.executeSql(`SELECT * FROM teacher`, []).then((data) => {
      for(let i = 0; i < data.rows.length; i++) {
        let isTeacher = data.rows.item(i).username.split('.')[1];
        if(isTeacher !== "teacher") {
          result.push({
            'studentId': JSON.parse(data.rows.item(i).user_id),
            'studentUsername' : data.rows.item(i).username,
          });
        }
      }
      console.log("selected: " + JSON.stringify(data));
      }, (error) => {
        console.log("ERROR: " + alert(error.err));
      });
      return result;
  }

  async login(username:string, password: string) {
    let result = [];
    await this.dbInstance.executeSql(`SELECT * FROM teacher WHERE username = ? AND password = ?`, [username, password]).then((data) => {
        console.log("INSERTED: " + JSON.stringify(data));
        if(data.rows.length !== 0) {
          alert('Authenticated');
          for(let i = 0; i < data.rows.length; i++) {
              result.push({
                'user_id': JSON.parse(data.rows.item(i).user_id),
                'username' : data.rows.item(i).username,
                'password' : data.rows.item(i).password,
                'isTeacher': username.split('.')[1] == 'teacher' ? 'teacher' : null
                
              });
          }
        } else {
          alert('User Not Found');
          result = [];
        }
      }, (error) => {
        console.log("ERROR: " + alert(error.err));
      });
      return result;
  }

  async addQuiz(lesson, question, answer, a1, a2, a3) {
    await this.dbInstance.executeSql(`INSERT INTO quiztbl (
      lesson,
      question,
      answer,
      a1,
      a2,
      a3) VALUES (
        ?, 
        ?,
        ?,
        ?,
        ?,
        ?)`, [lesson, question, answer, a1, a2, a3]).then((data) => {
      console.log("INSERTED: " + JSON.stringify(data));
    }, (error) => {
      console.log("ERROR: " + alert(error.err));
    });
  }

  async addGroupQuiz(id, groupName) {
    await this.dbInstance.executeSql(`INSERT INTO quizGroup (
      groupId,
      groupName) VALUES (
        ?, 
        ?)`, [id, groupName]).then((data) => {
      console.log("INSERTED: " + JSON.stringify(data));
    }, (error) => {
      console.log("ERROR: " + alert(error.err));
    });
  }

  async addLessonToList(id, lessonName, img1, img2, img3, img4, img5,) {
    await this.dbInstance.executeSql(`INSERT INTO newLessontbl (
      lesson_id,
      lessonName,
      lock,
      imgSrc1,
      imgSrc2,
      imgSrc3,
      imgSrc4,
      imgSrc5) VALUES (
        ?, 
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?)`, [id, lessonName, "true", img1, img2, img3, img4, img5]).then((data) => {
      console.log("INSERTED: " + JSON.stringify(data));
    }, (error) => {
      console.log("ERROR: " + alert(error.err));
    });
  }


  async updateGroupQuiz(id, groupName) {
    await this.dbInstance.executeSql(`UPDATE quizGroup SET
      groupId = ?,
      groupName= ?
      WHERE
      groupId = ?
      )`, [id, groupName, id]).then((data) => {
      console.log("INSERTED: " + JSON.stringify(data));
    }, (error) => {
      console.log("ERROR: " + alert(error.err));
    });
  }

  async deleteGroupQuiz(id) {
    await this.dbInstance.executeSql(`DELETE from quizGroup
      WHERE
      groupId = ?`, [id]).then((data) => {
      console.log("INSERTED: " + JSON.stringify(data));
    }, (error) => {
      console.log("ERROR: " + alert(error.err));
    });
  }

  async getLessonList(index? : number) {
    let result = []; 
    if(index) {
      await this.dbInstance.executeSql(`select * from newLessontbl where lesson_id = ?`, [index]).then((data) => {
        for(let i = 0; i < data.rows.length; i++) {
          result.push({
            'id': JSON.parse(data.rows.item(i).lesson_id),
            'lessonName' : data.rows.item(i).lessonName,
            'lessons': [
              data.rows.item(i).imgSrc1,
              data.rows.item(i).imgSrc2,
              data.rows.item(i).imgSrc3,
              data.rows.item(i).imgSrc4,
              data.rows.item(i).imgSrc5
            ]
          }
          )
        }
        console.log("selected: " + JSON.stringify(data));
      }, (error) => {
        console.log("ERROR: " + alert(error.err));
      });
    } else {
      await this.dbInstance.executeSql(`select * from newLessontbl`, []).then((data) => {
        for(let i = 0; i < data.rows.length; i++) {
          result.push({
            'id': JSON.parse(data.rows.item(i).lesson_id),
            'lessonName' : data.rows.item(i).lessonName,
            'lock': data.rows.item(i).lock
          }
          )
        }
        console.log("selected: " + JSON.stringify(data));
      }, (error) => {
        console.log("ERROR: " + alert(error.err));
      });
    }
    return result;
  }

  async updateLessonTbl(lock, lesson_id) {
    await this.dbInstance.executeSql(`UPDATE newLessontbl SET
      lock = ?
      WHERE
      lesson_id = ?`, [lock, lesson_id]).then((data) => {
      console.log("INSERTED: " + JSON.stringify(data));
    }, (error) => {
      console.log("ERROR: " + alert(error.err));
    });
  }

  async getGroupQuiz() {
    let result = [];
    await this.dbInstance.executeSql(`select * from quizGroup`, []).then((data) => {
      for(let i = 0; i < data.rows.length; i++) {
        result.push({
          'groupId': JSON.parse(data.rows.item(i).groupId),
          'groupName' : data.rows.item(i).groupName,
          'quizId': data.rows.item(i).quiz_id
        }
        )
      }
      console.log("selected: " + JSON.stringify(data));
    }, (error) => {
      console.log("ERROR: " + alert(error.err));
    });
    return result;
  }

  async getQuizList(index) {
    let result = [];
    await this.dbInstance.executeSql(`select * from quiztbl where lesson = ?`, [index]).then((data) => {
      for(let i = 0; i < data.rows.length; i++) {
        result.push({
          'lesson': data.rows.item(i).lesson,
          'question' : data.rows.item(i).question,
          'answer' : data.rows.item(i).answer,
          'a1' : data.rows.item(i).a1,
          'a2' : data.rows.item(i).a2,
          'a3' : data.rows.item(i).a3,
          'selected': null
        }
        )
      }
      console.log("selected: " + JSON.stringify(data));
    }, (error) => {
      console.log("ERROR: " + alert(error.err));
    });
    return result;
  }

  async submitActivity(user_id: any, category_id: any, score: any) {
    await this.dbInstance.executeSql(`INSERT INTO scoresActivity (
      user_id,
      category_id,
      score) VALUES (
        ?, 
        ?,
        ?)`, [user_id, category_id, score]).then((data) => {
      console.log("INSERTED: " + JSON.stringify(data));
    }, (error) => {
      console.log("ERROR: " + alert(error.err));
    });
  }

  async submitQuiz (user_id: any,category_id:any ,score: any) {
    await this.dbInstance.executeSql(`INSERT INTO scores (
      user_id,
      category_id,
      score) VALUES (
        ?, 
        ?,
        ?)`, [user_id, category_id, score]).then((data) => {
      console.log("INSERTED: " + JSON.stringify(data));
    }, (error) => {
      console.log("ERROR: " + alert(error.err));
    });
  }

  async getQuizResults () {
    let result = [];
    let records = [];
    let actResult = [];
    await this.dbInstance.executeSql(`SELECT * FROM scores`, []).then((data) => {
      for(let i = 0; i < data.rows.length; i++) { 
        result.push({
          'user_id': data.rows.item(i).user_id,
          'category_id' : data.rows.item(i).category_id,
          'score' : data.rows.item(i).score,
        });
      }
      console.log("INSERTED: " + JSON.stringify(data));
    }, (error) => {
      console.log("ERROR: " + alert(error.err));
    });

    await this.dbInstance.executeSql(`SELECT * FROM scoresActivity`, []).then((data) => {
      for(let i = 0; i < data.rows.length; i++) { 
        actResult.push({
          'user_id': data.rows.item(i).user_id,
          'category_id' : data.rows.item(i).category_id,
          'score' : data.rows.item(i).score,
        });
      }
      console.log("INSERTED: " + JSON.stringify(data));
    }, (error) => {
      console.log("ERROR: " + alert(error.err));
    });

    const studentList = await this.getStudentList();
    const examGroup = await this.getGroupQuiz();

    for(let i = 0; i < studentList.length; i++) {
      let resultArr = [];

      let obj1 = { 
        'studentUsername': studentList[i].studentUsername,
        'results' : []
      }
        let score = result.filter((data) => {
          return data.user_id == studentList[i].studentId.toString();
        });

        let scoreActivity = actResult.filter((data) => {
          return data.user_id == studentList[i].studentId.toString();
        });

        for(let ii = 0; ii < lessonButtons.length; ii++) {
          let scoreVal = null;
          if(scoreActivity.length !== 0) {
            for(let v = 0; v < scoreActivity.length; v++) {
              if(ii.toString() == scoreActivity[v].category_id) {
                scoreVal = scoreActivity[v].score
              }
            }
          }
        obj1['results'].push({
          'key' : `Act ${ii}`,
          'score' : scoreVal
        });
        }

        for(let iii = 0; iii < examGroup.length; iii++) {
          let scoreVal = null;
          if(score.length !== 0) {
            for(let iv = 0; iv < score.length; iv++) {
              if(examGroup[iii].groupId.toString() == score[iv].category_id) {
                scoreVal = score[iv].score
              }
            }
          }
        obj1['results'].push({
          'key' : examGroup[iii].groupName,
          'score' : scoreVal
        });
      }

    records.push(obj1);
  }

    return records;
  }
}
