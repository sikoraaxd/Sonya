import { Injectable } from '@angular/core';
import { token_set_ratio, extract } from 'fuzzball'

@Injectable({
  providedIn: 'root'
})
export class CommandRecognitionService {
  commands = [ {
    name: 'Что умею'
  },
  {
    name: 'Привет'
  },
  {
    name:'Как дойти'
  },
  ]
  constructor() { }

  getCommand(text: string) {
    var options = {scorer: token_set_ratio};
    var result = extract(text, this.commands, options);
    return result[0][0];
  }

}
