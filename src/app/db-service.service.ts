import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { mockQuiz } from './constants/lessonButton';
import { Storage } from '@ionic/storage';

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
    private storage: Storage) { 
      
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
  }

  async initQuizComponent() {
      for(let i = 0; i < mockQuiz.length; i++) {
        await this.addQuiz(mockQuiz[i].lessonId, mockQuiz[i].question, mockQuiz[i].answer, mockQuiz[i].a1, mockQuiz[i].a2, mockQuiz[i].a3);
      }
      await this.addGroupQuiz(0, 'Mock up Exam');
      await this.storage.set('initApp', true);
  }

  async registerUser(username: string, password: string) {
    let result = null;
    await this.dbInstance.executeSql(`INSERT INTO ${this.db_table} (username, password)
    SELECT * FROM (SELECT ?, ?) AS tmp
    WHERE NOT EXISTS (
      SELECT username FROM ${this.db_table} WHERE username = ?
  ) LIMIT 1;`, [username, password, username]).then((data) => {
      console.log("INSERTED: " + JSON.stringify(data));
      if(data.rowsAffected == 0) {
        alert('User is existing');
        result = false;
      } else {
        let isTeacher = username.split('.')[1];
        result = [username, password, isTeacher == 'teacher' ? 'teacher' : null];
      }
    }, (error) => {
      console.log("ERROR: " + alert(error.err));
    });
    return result;
  }

  async login(username:string, password: string) {
    let result = null;
    await this.dbInstance.executeSql(`SELECT * FROM teacher WHERE username = ? AND password = ?`, [username, password]).then((data) => {
        console.log("INSERTED: " + JSON.stringify(data));
        if(data.rows.length !== 0) {
          alert('Authenticated');
          let isTeacher = username.split('.')[1];
          result = [username, password, isTeacher == 'teacher' ? 'teacher' : null];
        } else {
          alert('User Not Found');
          result = false;
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

  async getGroupQuiz() {
    let result = [];
    await this.dbInstance.executeSql(`select * from quizGroup`, []).then((data) => {
      for(let i = 0; i < data.rows.length; i++) {
        result.push({
          'groupId': JSON.parse(data.rows.item(i).groupId),
          'groupName' : data.rows.item(i).groupName,
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

}
