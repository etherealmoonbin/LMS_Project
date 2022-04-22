import { Component, OnInit } from '@angular/core';
import { Tile, clues, Letters } from '../constants/lessonButton';
import * as _ from 'lodash';
import { ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import { DbServiceService } from '../db-service.service';

@Component({
  selector: 'app-activity-crossword',
  templateUrl: './activity-crossword.page.html',
  styleUrls: ['./activity-crossword.page.scss'],
})
export class ActivityCrosswordPage implements OnInit {

  tiles : Tile[];
  responses: any;
  myParam: any;
  activityQuestion: any;
  paramIndex: any;
  letters: Letters[];
  activitySelector: any;
  previousCoordinate: any = [0, 0];
  previousLetter: any;
  isTeacher: any;

  scrambleWord = "";
  level = 1;
  score = 0;
  word;
  attempts = 0;
  correct = 0;
  guess = "";
  scambledSubmitIsDisable = false;
  guessLength = 0;
  totalAdded = 0;

  constructor(private route: ActivatedRoute,
    private storage: Storage,
    private DbServiceService: DbServiceService
    ) { 

    }

  async ngOnInit() {
    this.isTeacher = await this.storage.get('authority');
    this.paramIndex = this.route.snapshot.paramMap.get('index');
    this.myParam = parseInt(this.paramIndex) + 1;
    this.activityQuestion = clues[this.paramIndex];
    this.activitySelector = Math.floor(Math.random() * (1 - 0 + 1)) + 0;
    this.tiles = await this.getTiles(this.paramIndex);
    this.scrambleWord = this.scrambledWord();
  }

  async getRandomizer(max) {
    return Math.floor(Math.random() * max);
  }

  updateBox(event, response, tile) {
    console.log(response);
    console.log(tile);
    let responseTile: Tile = {
      rows: tile.rows,
      cols: tile.cols,
      editable: tile.editable,
      color: tile.color,
      value: tile.value,
      response: response.toUpperCase()
    }
    this.updateResponses(responseTile);

    var nextinput = document.querySelectorAll('input');
    

  }

  getTiles(index): Tile[] {
    let tiles: Tile[] = [];
    // let tiles: Tile[] = [
    //   {color: 'while', editable: true, rows: 0, cols: 0},
    //   {color: 'black', editable: false, rows: 0, cols: 0},
    //   {color: 'white', editable: true, rows: 0, cols: 0},
    //   {color: 'black', editable: false, rows: 0, cols: 0},
    // ];
    let grid = this.getGrid(index);
    let tileIndex = 0;
    for (let i=0; i<grid.length; i++) {
      let row = grid[i];
      for (let j=0; j<row.length; j++) {
        let value = row[j];
        let isEditable = value?true:false;
        let color = value?'white':'black';
        let placeholder = this.getPlaceholder(index, i, j);//`${i}${j}` ;
        tiles.push({
          color: color,
          editable: isEditable,
          rows: i,
          cols: j,
          value: row[j],
          placeholder: placeholder
        });
      }
    }
    // this.responses = tiles;
    this.responses = tiles.map(x => Object.assign({}, x));
    return tiles;
  }

  getLetters(index): Letters[] {
    let tiles = [];
    let grid = this.getGrid(index);
    let word = null;
    let value = "";
    for (let i=0; i<grid.length; i++) {
      let row = grid[i];
      for (let j=0; j<row.length; j++) {
        if(row[j]) {
          value = value + row[j];
          if(row[j + 1] == null) {
            tiles.push(value);
            value = "";
          }
          continue;
        } else {
          break;
        }
      }
    }
    // this.responses = tiles;
    this.responses = tiles.map(x => Object.assign({}, x));
    return tiles;
  }

  getPlaceholder(index, i, j): string {
    let placeholder: string = '';
    switch (parseInt(index)) {
      case 0:
        if (i === 0 && j === 1) {
          placeholder = '1';
        } else if (i === 1 && j === 1) {
          placeholder = '2';
        } else if (i === 7 && j === 0) {
          placeholder = '3';
        } else if (i === 7 && j === 4) {
          placeholder = '4';
        } else if (i === 7 && j === 5) {
          placeholder = '5';
        } else if (i === 9 && j === 2) {
          placeholder = '6';
        }
        break;
        case 1:
          if (i === 2 && j === 5) {
            placeholder = '1';
          } else if (i === 4 && j === 1) {
            placeholder = '2';
          } else if (i === 5 && j === 1) {
            placeholder = '3';
          } else if (i === 9 && j === 1) {
            placeholder = '4';
          } else if (i === 10 && j === 6) {
            placeholder = '5';
          } else if (i === 14 && j === 2) {
            placeholder = '6';
          }
          break;
          case 2:
          if (i === 0 && j === 0) {
            placeholder = '1';
          } else if (i === 8 && j === 0) {
            placeholder = '2';
          } else if (i === 4 && j === 4) {
            placeholder = '3';
          } else if (i === 7 && j === 7) {
            placeholder = '4';
          } else if (i === 8 && j === 7) {
            placeholder = '5';
          }
          break;
          case 3:
          if (i === 0 && j === 1) {
            placeholder = '1';
          } else if (i === 1 && j === 1) {
            placeholder = '2';
          } else if (i === 7 && j === 1) {
            placeholder = '3';
          } else if (i === 6 && j === 5) {
            placeholder = '4';
          }
          break;
          case 4:
          if (i === 4 && j === 1) {
            placeholder = '1';
          } else if (i === 2 && j === 5) {
            placeholder = '2';
          } else if (i === 4 && j === 2) {
            placeholder = '3';
          } else if (i === 12 && j === 2) {
            placeholder = '4';
          }
          break;
          case 5:
            if (i === 3 && j === 2) {
              placeholder = '1';
            } else if (i === 3 && j === 5) {
              placeholder = '2';
            } else if (i === 6 && j === 3) {
              placeholder = '3';
            } else if (i === 1 && j === 8) {
              placeholder = '4';
            }
            break;
            case 6:
            if (i === 2 && j === 0) {
              placeholder = '1';
            } else if (i === 6 && j === 0) {
              placeholder = '2';
            } else if (i === 6 && j === 5) {
              placeholder = '3';
            } else if (i === 1 && j === 9) {
              placeholder = '4';
            }
            break;
            case 7:
              if (i === 2 && j === 2) {
                placeholder = '1';
              } else if (i === 1 && j === 8) {
                placeholder = '2';
              } else if (i === 8 && j === 1) {
                placeholder = '3';
              } else if (i === 7 && j === 6) {
                placeholder = '4';
              }
              break;
              case 8:
                if (i === 2 && j === 3) {
                  placeholder = '1';
                } else if (i === 5 && j === 2) {
                  placeholder = '2';
                } else if (i === 3 && j === 5) {
                  placeholder = '3';
                } else if (i === 9 && j === 0) {
                  placeholder = '4';
                }
                break;
                case 9:
                  if (i === 2 && j === 1) {
                    placeholder = '1';
                  } else if (i === 2 && j === 2) {
                    placeholder = '2';
                  } else if (i === 2 && j === 7) {
                    placeholder = '3';
                  } else if (i === 6 && j === 5) {
                    placeholder = '4';
                  }
                  break;
                  case 10:
                    if (i === 3 && j === 0) {
                      placeholder = '1';
                    } else if (i === 2 && j === 6) {
                      placeholder = '2';
                    } else if (i === 8 && j === 4) {
                      placeholder = '3';
                    } else if (i === 8 && j === 5) {
                      placeholder = '4';
                    }
                    break;
                    case 11:
                      if (i === 1 && j === 4) {
                        placeholder = '1';
                      } else if (i === 5 && j === 2) {
                        placeholder = '2';
                      } else if (i === 8 && j === 1) {
                        placeholder = '3';
                      } else if (i === 13 && j === 2) {
                        placeholder = '4';
                      }
                      break;
                      case 12:
                        if (i === 5 && j === 1) {
                          placeholder = '1';
                        } else if (i === 4 && j === 2) {
                          placeholder = '2';
                        } else if (i === 4 && j === 5) {
                          placeholder = '3';
                        } else if (i === 12 && j === 0) {
                          placeholder = '4';
                        }
                        break;
    }

    return placeholder;
  }

  updateResponses(responseTile) {
    console.log(responseTile.rows +',' + responseTile.cols)
    let idx = _.findIndex(this.responses, {'rows': responseTile.rows, 'cols': responseTile.cols})
    this.responses[idx] = responseTile;
    console.log(idx);
    console.log(this.responses);
  }

  getResponses() {
    return this.responses;
  }

  calculateScore(): number {
    console.log(this.responses);
    let correctResponses = _.filter(this.responses, function (res) {
      return res.value === res.response;
    });
    console.log('correct responses');
    console.log(correctResponses);
    let length = correctResponses?correctResponses.length:0;
    return length;
  }

  getAnswers (i) {
    let ans;
    switch (parseInt(i)) {
      case 0:
        ans = [
          "SOCIALMEDIA",
          "SECURITY",
          "SYMBIAN",
          "IOS",
          "ANDROID",
          "WINDOWS",
          "SECURITY",
        ]
        break;
        case 1:
          ans = [
            "SPAM",
            "FIREWALL",
            "FLAMING",
            "NETIQUETTE",
            "YELLING",
            "COPYRIGHT",
          ]
        break;
        case 2:
          ans = [
            "SEARCHENGINE",
            "GOOGLE",
            "BING",
            "ASK",
            "YAHOO",
          ]
        break;
        case 3:
          ans = [
            "TABS",
            "TILEBAR",
            "RIBBON",
            "ZOOMCONTROLS",
          ]
        break;
        case 4:
          ans = [
            "PROXIMITY",
            "REPETITION",
            "CONTRAST",
            "ALIGNMENT",
          ]
        break;
        case 5:
          ans = [
            "PREZI",
            "ZOHO",
            "DROPBOX",
            "FACEBOOK",
          ]
        break;
        case 6:
          ans = [
            "REFLECTION",
            "EXPRESSION",
            "SHARING",
            "CONTENTEDITOR",
          ]
        break;
        case 7:
          ans = [
            "MULTIMEDIA",
            "NEWSPAPER",
            "ONLINEGAMES",
            "MEDIA",
          ]
        break;
        case 8:
          ans = [
            "UGLY",
            "ADVOCACY",
            "GOOD",
            "BAD",
          ]
        break;
        case 9:
          ans = [
            "MOTIVATE",
            "OTHERS",
            "TEMPORARY",
            "SCOPE",
          ]
        break;
        case 10:
          ans = [
            "INTRODUCTION",
            "SUPPORT",
            "ULTRAS",
            "LURKERS",
          ]
        break;
        case 11:
          ans = [
            "INFRASTRACTURE",
            "CHANGE",
            "OPERATION",
            "SERVICE",
          ]
        break;
        case 12:
          ans = [
            "JOBLOSS",
            "COST",
            "COMPETITION",
            "SECURITY",
          ]
        break;
    }
    this.guessLength = ans.length;
    let wordGen = ans[this.totalAdded];
    this.word = wordGen;
    return wordGen;
  }

  getGrid(i): any {
    let tiles = [];
    switch (parseInt(i)) {
      case 0:
        tiles = [
          [null,'S','O','C','I','A','L','M','E','D','I','A'],
          [null,'E',null,null,null,null,null,null,null,null,null,null],
          [null,'C',null,null,null,null,null,null,null,null,null,null],
          [null,'U',null,null,null,null,null,null,null,null,null,null],
          [null,'R',null,null,null,null,null,null,null,null,null,null],
          [null,'I',null,null,'S',null,null,null,null,null,null,null],
          [null,'T',null,null,'O',null,null,null,null,null,null,null],
          ['S','Y','M','B','I','A','N',null,null,null,null,null],
          [null,null,null,null,null,'N',null,null,null,null,null,null],
          [null,null,'W',null,null,'D',null,null,null,null,null,null],
          [null,null,'I',null,null,'R',null,null,null,null,null,null],
          [null,null,'N',null,null,'O',null,null,null,null,null,null],
          [null,null,'D',null,null,'I',null,null,null,null,null,null],
          [null,null,'O',null,null,'D',null,null,null,null,null,null],
          [null,null,'W',null,null,null,null,null,null,null,null,null],
          [null,null,'S',null,null,null,null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null,null,null,null,null]
        ];
        break;
      case 1:
        tiles = [
          [null,null,null,null,null,null,null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null,null,null,null,null],
          [null,null,null,null,null,'S',null,null,null,null,null,null],
          [null,null,null,null,null,'P',null,null,null,null,null,null],
          [null,'F','I','R','E','W','A','L','L',null,null,null],
          [null,'L',null,null,null,'M',null,null,null,null,null,null],
          [null,'A',null,null,null,null,null,null,null,null,null,null],
          [null,'M',null,null,null,null,null,null,null,null,null,null],
          [null,'I',null,null,null,null,null,null,null,null,null,null],
          [null,'N','E','T','I','Q','U','E','T','T','E',null],
          [null,'G',null,null,null,null,'Y',null,null,null,null,null],
          [null,null,null,null,null,null,'E',null,null,null,null,null],
          [null,null,null,null,null,null,'L',null,null,null,null,null],
          [null,null,null,null,null,null,'L',null,null,null,null,null],
          [null,null,'C','O','P','Y','R','I','G','H','T',null],
          [null,null,null,null,null,null,'N',null,null,null,null,null],
          [null,null,null,null,null,null,'G',null,null,null,null,null],
          [null,null,null,null,null,null,null,null,null,null,null,null]
        ];
        break;
        case 2:
          tiles = [
            ['S',null,null,null,null,null,null,null,null,null,null,null],
            ['E',null,null,null,null,null,null,null,null,null,null,null],
            ['A',null,null,null,null,null,null,null,null,null,null,null],
            ['R',null,null,null,null,null,null,null,null,null,null,null],
            ['C',null,null,null,'B','I','N','G',null,null,null,null],
            ['H',null,null,null,null,null,null,null,null,null,null,null],
            ['E',null,null,null,null,null,null,null,null,null,null,null],
            ['N',null,null,null,null,null,null,'Y',null,null,null,null],
            ['G','O','O','G','L','E',null,'A','S','K',null,null],
            ['I',null,null,null,null,null,null,'H',null,null,null,null],
            ['N',null,null,null,null,null,null,'O',null,null,null,null],
            ['E',null,null,null,null,null,null,'O',null,null,null,null],
            [null,null,null,null,null,null,null,null,null,null,null,null],
            [null,null,null,null,null,null,null,null,null,null,null,null],
            [null,null,null,null,null,null,null,null,null,null,null,null],
            [null,null,null,null,null,null,null,null,null,null,null,null],
            [null,null,null,null,null,null,null,null,null,null,null,null],
            [null,null,null,null,null,null,null,null,null,null,null,null]
          ];
          break;
          case 3:
            tiles = [
              [null,'T','A','B','S',null,null,null,null,null,null,null],
              [null,'I',null,null,null,null,null,null,null,null,null,null],
              [null,'T',null,null,null,null,null,null,null,null,null,null],
              [null,'L',null,null,null,null,null,null,null,null,null,null],
              [null,'E',null,null,null,null,null,null,null,null,null,null],
              [null,'B',null,null,null,null,null,null,null,null,null,null],
              [null,'A',null,null,null,'Z',null,null,null,null,null,null],
              [null,'R','I','B','B','O','N',null,null,null,null,null],
              [null,null,null,null,null,'O',null,null,null,null,null,null],
              [null,null,null,null,null,'M',null,null,null,null,null,null],
              [null,null,null,null,null,'C',null,null,null,null,null,null],
              [null,null,null,null,null,'O',null,null,null,null,null,null],
              [null,null,null,null,null,'N',null,null,null,null,null,null],
              [null,null,null,null,null,'T',null,null,null,null,null,null],
              [null,null,null,null,null,'R',null,null,null,null,null,null],
              [null,null,null,null,null,'O',null,null,null,null,null,null],
              [null,null,null,null,null,'L',null,null,null,null,null,null],
              [null,null,null,null,null,'S',null,null,null,null,null,null]
            ];
            break;
            case 4:
              tiles = [
                [null,null,null,null,null,null,null,null,null,null,null,null],
                [null,null,null,null,null,null,null,null,null,null,null,null],
                [null,null,null,null,null,'A',null,null,null,null,null,null],
                [null,null,null,null,null,'L',null,null,null,null,null,null],
                [null,'P','R','O','X','I','M','I','T','Y',null,null],
                [null,null,'E',null,null,'G',null,null,null,null,null,null],
                [null,null,'P',null,null,'N',null,null,null,null,null,null],
                [null,null,'E',null,null,'M',null,null,null,null,null,null],
                [null,null,'T',null,null,'E',null,null,null,null,null,null],
                [null,null,'I',null,null,'N',null,null,null,null,null,null],
                [null,null,'T',null,null,'T',null,null,null,null,null,null],
                [null,null,'I',null,null,null,null,null,null,null,null,null],
                [null,'C','O','N','T','R','A','S','T',null,null,null],
                [null,null,'N',null,null,null,null,null,null,null,null,null],
                [null,null,null,null,null,null,null,null,null,null,null,null],
                [null,null,null,null,null,null,null,null,null,null,null,null],
                [null,null,null,null,null,null,null,null,null,null,null,null],
                [null,null,null,null,null,null,null,null,null,null,null,null]
              ];
              break;
              case 5:
                tiles = [
                  [null,null,null,null,null,null,null,null,null,null,null,null],
                  [null,null,null,null,null,null,null,null,'F',null,null,null],
                  [null,null,null,null,null,null,null,null,'A',null,null,null],
                  [null,null,'P','R','E','Z','I',null,'C',null,null,null],
                  [null,null,null,null,null,'O',null,null,'E',null,null,null],
                  [null,null,null,null,null,'H',null,null,'B',null,null,null],
                  [null,null,null,'D','R','O','P','B','O','X',null,null],
                  [null,null,null,null,null,null,null,null,'O',null,null,null],
                  [null,null,null,null,null,null,null,null,'K',null,null,null],
                  [null,null,null,null,null,null,null,null,null,null,null,null],
                  [null,null,null,null,null,null,null,null,null,null,null,null],
                  [null,null,null,null,null,null,null,null,null,null,null,null],
                  [null,null,null,null,null,null,null,null,null,null,null,null],
                  [null,null,null,null,null,null,null,null,null,null,null,null],
                  [null,null,null,null,null,null,null,null,null,null,null,null],
                  [null,null,null,null,null,null,null,null,null,null,null,null],
                  [null,null,null,null,null,null,null,null,null,null,null,null],
                  [null,null,null,null,null,null,null,null,null,null,null,null]
                ];
                break;
                case 6:
                  tiles = [
                    [null,null,null,null,null,null,null,null,null,null,null,null],
                    [null,null,null,null,null,null,null,null,null,'C',null,null],
                    ['R',null,null,null,null,null,null,null,null,'O',null,null],
                    ['E',null,null,null,null,null,null,null,null,'N',null,null],
                    ['F',null,null,null,null,null,null,null,null,'T',null,null],
                    ['L',null,null,null,null,null,null,null,null,'E',null,null],
                    ['E','X','P','R','E','S','S','I','O','N',null,null],
                    ['C',null,null,null,null,'H',null,null,null,'T',null,null],
                    ['T',null,null,null,null,'A',null,null,null,'E',null,null],
                    ['I',null,null,null,null,'R',null,null,null,'D',null,null],
                    ['O',null,null,null,null,'I',null,null,null,'I',null,null],
                    ['N',null,null,null,null,'N',null,null,null,'T',null,null],
                    [null,null,null,null,null,'G',null,null,null,'O',null,null],
                    [null,null,null,null,null,null,null,null,null,'R',null,null],
                    [null,null,null,null,null,null,null,null,null,null,null,null],
                    [null,null,null,null,null,null,null,null,null,null,null,null],
                    [null,null,null,null,null,null,null,null,null,null,null,null],
                    [null,null,null,null,null,null,null,null,null,null,null,null]
                  ];
                  break;
                  case 7:
                    tiles = [
                      [null,null,null,null,null,null,null,null,null,null,null,null],
                      [null,null,null,null,null,null,null,null,'N',null,null,null],
                      [null,null,'M','U','L','T','I','M','E','D','I','A'],
                      [null,null,null,null,null,null,null,null,'W',null,null,null],
                      [null,null,null,null,null,null,null,null,'S',null,null,null],
                      [null,null,null,null,null,null,null,null,'P',null,null,null],
                      [null,null,null,null,null,null,null,null,'A',null,null,null],
                      [null,null,null,null,null,null,'M',null,'P',null,null,null],
                      [null,'O','N','L','I','N','E','G','A','M','E','S'],
                      [null,null,null,null,null,null,'D',null,'R',null,null,null],
                      [null,null,null,null,null,null,'I',null,null,null,null,null],
                      [null,null,null,null,null,null,'A',null,null,null,null,null],
                      [null,null,null,null,null,null,null,null,null,null,null,null],
                      [null,null,null,null,null,null,null,null,null,null,null,null],
                      [null,null,null,null,null,null,null,null,null,null,null,null],
                      [null,null,null,null,null,null,null,null,null,null,null,null],
                      [null,null,null,null,null,null,null,null,null,null,null,null],
                      [null,null,null,null,null,null,null,null,null,null,null,null]
                    ];
                    break;
                    case 8:
                    tiles = [
                      [null,null,null,null,null,null,null,null,null,null,null,null],
                      [null,null,null,null,null,null,null,null,null,null,null,null],
                      [null,null,null,'A',null,null,null,null,null,null,null,null],
                      [null,null,null,'D',null,'B',null,null,null,null,null,null],
                      [null,null,null,'V',null,'A',null,null,null,null,null,null],
                      [null,null,'G','O','O','D',null,null,null,null,null,null],
                      [null,null,null,'C',null,null,null,null,null,null,null,null],
                      [null,null,null,'A',null,null,null,null,null,null,null,null],
                      [null,null,null,'C',null,null,null,null,null,null,null,null],
                      ['U','G','L','Y',null,null,null,null,null,null,null],
                      [null,null,null,null,null,null,null,null,null,null,null,null],
                      [null,null,null,null,null,null,null,null,null,null,null,null],
                      [null,null,null,null,null,null,null,null,null,null,null,null],
                      [null,null,null,null,null,null,null,null,null,null,null,null],
                      [null,null,null,null,null,null,null,null,null,null,null,null],
                      [null,null,null,null,null,null,null,null,null,null,null,null],
                      [null,null,null,null,null,null,null,null,null,null,null,null],
                      [null,null,null,null,null,null,null,null,null,null,null,null]
                    ];
                    break;
                    case 9:
                    tiles = [
                      [null,null,null,null,null,null,null,null,null,null,null,null],
                      [null,null,null,null,null,null,null,null,null,null,null,null],
                      [null,'M','O','T','I','V','A','T','E',null,null,null],
                      [null,null,'T',null,null,null,null,'E',null,null,null,null],
                      [null,null,'H',null,null,null,null,'M',null,null,null,null],
                      [null,null,'E',null,null,null,null,'P',null,null,null,null],
                      [null,null,'R',null,null,'S','C','O','P','E',null,null],
                      [null,null,'S',null,null,null,null,'R',null,null,null,null],
                      [null,null,null,null,null,null,null,'A',null,null,null,null],
                      [null,null,null,null,null,null,null,'R',null,null,null,null],
                      [null,null,null,null,null,null,null,'Y',null,null,null,null],
                      [null,null,null,null,null,null,null,null,null,null,null,null],
                      [null,null,null,null,null,null,null,null,null,null,null,null],
                      [null,null,null,null,null,null,null,null,null,null,null,null],
                      [null,null,null,null,null,null,null,null,null,null,null,null],
                      [null,null,null,null,null,null,null,null,null,null,null,null],
                      [null,null,null,null,null,null,null,null,null,null,null,null],
                      [null,null,null,null,null,null,null,null,null,null,null,null]
                    ];
                    break;
                    case 10:
                    tiles = [
                      [null,null,null,null,null,null,null,null,null,null,null,null],
                      [null,null,null,null,null,null,null,null,null,null,null,null],
                      [null,null,null,null,null,null,'S',null,null,null,null,null],
                      ['I','N','T','R','O','D','U','C','T','I','O', 'N'],
                      [null,null,null,null,null,null,'P',null,null,null,null,null],
                      [null,null,null,null,null,null,'P',null,null,null,null,null],
                      [null,null,null,null,null,null,'O',null,null,null,null,null],
                      [null,null,null,null,null,null,'R',null,null,null,null,null],
                      [null,null,null,null,'U','L','T','R','A','S',null,null],
                      [null,null,null,null,null,'U',null,null,null,null,null,null],
                      [null,null,null,null,null,'R',null,null,null,null,null,null],
                      [null,null,null,null,null,'K',null,null,null,null,null,null],
                      [null,null,null,null,null,'E',null,null,null,null,null,null],
                      [null,null,null,null,null,'R',null,null,null,null,null,null],
                      [null,null,null,null,null,'S',null,null,null,null,null,null],
                      [null,null,null,null,null,null,null,null,null,null,null,null],
                      [null,null,null,null,null,null,null,null,null,null,null,null],
                      [null,null,null,null,null,null,null,null,null,null,null,null]
                    ];
                    break;
                    case 11:
                    tiles = [
                      [null,null,null,null,null,null,null,null,null,null,null,null],
                      [null,null,null,null,'I',null,null,null,null,null,null,null],
                      [null,null,null,null,'N',null,null,null,null,null,null,null],
                      [null,null,null,null,'F',null,null,null,null,null,null,null],
                      [null,null,null,null,'R',null,null,null,null,null,null,null],
                      [null,null,'C','H','A','N','G','E',null,null,null,null],
                      [null,null,null,null,'S',null,null,null,null,null,null,null],
                      [null,null,null,null,'T',null,null,null,null,null,null,null],
                      [null,'O','P','E','R','A','T','I','O','N',null,null],
                      [null,null,null,null,'A',null,null,null,null,null,null,null],
                      [null,null,null,null,'C',null,null,null,null,null,null,null],
                      [null,null,null,null,'T',null,null,null,null,null,null,null],
                      [null,null,null,null,'U',null,null,null,null,null,null,null],
                      [null,null,'S','E','R','V','I','C','E',null,null,null],
                      [null,null,null,null,'E',null,null,null,null,null,null,null],
                      [null,null,null,null,null,null,null,null,null,null,null,null],
                      [null,null,null,null,null,null,null,null,null,null,null,null],
                      [null,null,null,null,null,null,null,null,null,null,null,null]
                    ];
                    break;
                    case 12:
                    tiles = [
                      [null,null,null,null,null,null,null,null,null,null,null,null],
                      [null,null,null,null,null,null,null,null,null,null,null,null],
                      [null,null,null,null,null,null,null,null,null,null,null,null],
                      [null,null,null,null,null,null,null,null,null,null,null,null],
                      [null,null,'C',null,null,'C',null,null,null,null,null,null],
                      [null,'J','O','B','L','O','S','S',null,null,null,null],
                      [null,null,'S',null,null,'M',null,null,null,null,null,null],
                      [null,null,'T',null,null,'P',null,null,null,null,null,null],
                      [null,null,null,null,null,'E',null,null,null,null,null,null],
                      [null,null,null,null,null,'T',null,null,null,null,null,null],
                      [null,null,null,null,null,'I',null,null,null,null,null,null],
                      [null,null,null,null,null,'T',null,null,null,null,null,null],
                      ['S','E','C','U','R','I','T','Y',null,null,null,null],
                      [null,null,null,null,null,'O',null,null,null,null,null,null],
                      [null,null,null,null,null,'N',null,null,null,null,null,null],
                      [null,null,null,null,null,null,null,null,null,null,null,null],
                      [null,null,null,null,null,null,null,null,null,null,null,null],
                      [null,null,null,null,null,null,null,null,null,null,null,null]
                    ];
                    break;
    }
    
    return tiles;
  }

  async SubmitCrossword() {
    const crosswordScore = this.calculateScore();
    let userId = await this.storage.get('userId');
    await this.DbServiceService.submitActivity(userId, this.paramIndex, crosswordScore);
    alert(`Score: ${crosswordScore}`);
  }

  randomStringCrossword(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
  }

  selectLetter(letter) {
    const x = letter.rows;
    const y = letter.cols;

    let directionX = x - this.previousCoordinate[0];
    let directionY = y - this.previousCoordinate[1];
    if(Math.abs(directionX) == 1 && directionY == 0) {
      letter.direction = 0;
      this.previousLetter.direction = 0;
    } else if (Math.abs(directionY) == 1 && directionX == 0) {
      letter.direction = 1;
      this.previousLetter.direction = 1;
    } else {
      letter.direction = 2;
    }
  
    letter.isEditable = !letter.isEditable;

    console.log(directionX, directionY);
    this.previousCoordinate = [letter.rows, letter.cols];
    this.previousLetter = letter;
  }

  randomWord(lvl) {
    this.word = this.getAnswers(lvl);
  }

  scrambledWord() {
    let word = this.getAnswers(parseInt(this.paramIndex));
    let letters = word.split("");
    let currentIndex = letters.length,
      temporaryValue,
      randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = letters[currentIndex];
      letters[currentIndex] = letters[randomIndex];
      letters[randomIndex] = temporaryValue;
    }
  
    return letters.join(" ");
  }

  resetScrambledword() {
    this.scrambleWord = this.scrambledWord();
    this.guess = "";
  }

  async SubmitLetters() {
    let userId = await this.storage.get('userId');
    if(this.guess.toLocaleUpperCase() == this.word) {
      this.score = this.score + 1;
      this.totalAdded = this.score + this.attempts;
      if(this.totalAdded == this.guessLength) {
        await this.DbServiceService.submitActivity(userId, this.paramIndex, this.score);
        alert(`Score: ${this.score}`);
        this.scambledSubmitIsDisable = true;
        this.totalAdded = 0;
      } else {
        this.resetScrambledword();
      }
    } else {
      this.attempts = this.attempts + 1;
      this.totalAdded = this.score + this.attempts;
      if(this.attempts == this.guessLength) {
        await this.DbServiceService.submitActivity(userId, this.paramIndex, this.score);
        alert(`Score: ${this.score}`);
        this.scambledSubmitIsDisable = true;
        this.totalAdded = 0;
      }
      this.resetScrambledword();
    }

  }

}
