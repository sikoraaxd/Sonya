import { Injectable } from '@angular/core';
import { token_set_ratio, extract, ratio } from 'fuzzball'
import { SonyaService } from '../sonya.service';
import Enumerable from 'linq'

@Injectable({
  providedIn: 'root'
})
export class CommandRecognitionService {
  commandsJSON: string = ''
  tbr: string[] = ['какое', 'какая', 'где', 'как', 'расписание', 'пары', 'пара', 'у', 'дойти', 'добраться', 'где']
  commands: any[] = []
  groupsJSON: string = ''
  groups: any[] = []
  teachersJSON: string = ''
  teachers: any[] = []
  placesJSON: string = ''
  places: any[] = []

  constructor( private sonyaService: SonyaService) {
    this.sonyaService.getCommands().subscribe((data: any) => this.commandsJSON = JSON.stringify(data))
    this.sonyaService.getGroups().subscribe((data: any) => this.groupsJSON = JSON.stringify(data))
    this.sonyaService.getTeachers().subscribe((data: any) => this.teachersJSON = JSON.stringify(data))
    this.sonyaService.getPlaces().subscribe((data: any) => this.placesJSON = JSON.stringify(data))
  }

  initData(){
    if(this.commands.length == 0)
      this.commands = JSON.parse(this.commandsJSON)
    if(this.groups.length == 0)
      this.groups = JSON.parse(this.groupsJSON)
    if(this.teachers.length == 0)
      this.teachers = JSON.parse(this.teachersJSON)
    if(this.places.length == 0)
      this.places = JSON.parse(this.placesJSON)
  }

  recognizeCommand(cmd: string) {
    var rc = {cmd: "", percent: 0}
    this.commands.forEach((arrayItem) => {
      arrayItem['aliases'].forEach(alias => {
        var vrt = ratio(cmd, alias)
        if(vrt > rc['percent']) {
          rc['cmd'] = arrayItem['name']
          rc['percent'] = vrt
        }
      });
    })
    return rc
  }

  getResponce(cmd: string, cmdText: string)
  {
    var result = {text: '', tts: '', redirectToMap: false, place: []}
    if(cmd == '')
    {
      result['text'] = 'Что?'
      result['tts'] = Enumerable.from(this.commands).where(x => x['name'] == cmd).first()['responce']
    }
    else if(cmd == 'Привет')
    {
      result['text'] = Enumerable.from(this.commands).where(x => x['name'] == cmd).first()['responce']
      result['tts'] = Enumerable.from(this.commands).where(x => x['name'] == cmd).first()['responce']
    }
    else if(cmd == 'Что умею')
    {
      result['text'] = Enumerable.from(this.commands).where(x => x['name'] == cmd).first()['responce']
      result['tts'] = Enumerable.from(this.commands).where(x => x['name'] == cmd).first()['responce']
      result['text'] += '\n'
      this.commands.forEach(element => {
        result['text'] += element['name'].toLowerCase() + '\n'
      });
    }
    else if(cmd == 'Как поступить')
    {
      result['text'] = Enumerable.from(this.commands).where(x => x['name'] == cmd).first()['responce']
      result['tts'] = Enumerable.from(this.commands).where(x => x['name'] == cmd).first()['responce']
      window.open("https://astu.org/Content/Page/4610", "_blank")
    }
    else if(cmd == 'Как дойти')
    {
      result['text'] = Enumerable.from(this.commands).where(x => x['name'] == cmd).first()['responce']
      result['tts'] = Enumerable.from(this.commands).where(x => x['name'] == cmd).first()['responce']
      this.tbr.forEach(x => {
        cmdText = cmdText.replace(x, '')
      })

      var options = {scorer: token_set_ratio};
      var selectedPlace = {target: [], percent: 0}
      this.places.forEach((place)=> {
        var vrt = ratio(cmdText, place['name'])
        if(vrt > selectedPlace['percent']) {
          selectedPlace['target'] = place['geoposition']
          selectedPlace['percent'] = vrt
        }
      })
      result['place'] = selectedPlace['target']
      result['redirectToMap'] = true;
    }
    else if(cmd == 'Какое расписание')
    {
      result['text'] = Enumerable.from(this.commands).where(x => x['name'] == cmd).first()['responce']
      result['tts'] = Enumerable.from(this.commands).where(x => x['name'] == cmd).first()['responce']
      var scheduleObjects = ['группа', 'преподаватель']
      this.tbr.forEach(x => {
        cmdText = cmdText.replace(x, '')
      })

      var options = {scorer: token_set_ratio};

      var scheduleGroup = {target: "", percent: 0}
        this.groups.forEach((group)=> {
          var vrt = ratio(cmdText, group['name'])
          if(vrt > scheduleGroup['percent']) {
            scheduleGroup['target'] = group['scheduleName']
            scheduleGroup['percent'] = vrt
          }
        })
      
      var scheduleType = {target: "", percent: 0}
      cmdText.split(' ').forEach(word => {
        var vrt = extract(word, scheduleObjects, options)[0]
        if(vrt[1] > scheduleType['percent']) {
          scheduleType['target'] = vrt[0]
          scheduleType['percent'] = vrt[1]
        }
      })
      
      if(scheduleType['target'] == "группа")
      {
        var scheduleGroup = {target: "", percent: 0}
        this.groups.forEach((group)=> {
          var vrt = ratio(cmdText, group['name'])
          if(vrt > scheduleGroup['percent']) {
            scheduleGroup['target'] = group['scheduleName']
            scheduleGroup['percent'] = vrt
          }
        })
        window.open("https://table.astu.org/#/timetable/group/" + scheduleGroup['target'] + '%2F1', "_blank")
      }
      else{
        var scheduleTeacher = {target: "", percent: 0}
        this.teachers.forEach((teacher)=> {
          var vrt = ratio(cmdText, teacher['name'])
          if(vrt > scheduleTeacher['percent']) {
            scheduleTeacher['target'] = teacher['scheduleName']
            scheduleTeacher['percent'] = vrt
          }
        })
        window.open("https://table.astu.org/#/timetable/teacher/" + scheduleTeacher['target'], "_blank")
      } 
    }
    return result
  }
  

  getCommand(text: string) {
    this.initData()
    var result = this.recognizeCommand(text)
    return this.getResponce(result['cmd'], text);
  }

}
