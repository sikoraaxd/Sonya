import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommandRecognitionService } from '../service/command-recognition.service';
import { VoiceRecognitionService } from '../service/voice-recognition.service';
import {TEMP} from '../service/extendedData.js'
import tts from 'tts-js'


@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.css'],
  providers: [VoiceRecognitionService, CommandRecognitionService]
})
export class MainScreenComponent implements OnInit {
  mainText: string = ''
  recording = false
  storedFileNames: string[] = []

  constructor(public srService : VoiceRecognitionService,
              public crService : CommandRecognitionService,
              private routing: Router) {
    this.srService.init()
  }

  ngOnInit(): void {
    this.mainText = "Привет, я - Соня!"
  }

  async startListening() {
    await navigator.mediaDevices.getUserMedia({audio: true});
    this.recording = !this.recording
    if (this.recording == true)
    {
      this.mainText = '...'
      this.srService.start()
    }
    else
    {
      this.srService.stop()
      this.mainText = ''
      if(typeof this.srService.text !== 'undefined')
        this.mainText = this.srService.text
      else
        this.mainText = ''

      await new Promise(f => setTimeout(f, 2000)); 
      var commandResult = this.crService.getCommand(this.mainText);
      this.mainText = commandResult['text']
      this.speakText(this.mainText)

      if(commandResult['redirectToMap'])
      {
        await new Promise(f => setTimeout(f, 2000)); 
        TEMP.SELECTED_PLACE = commandResult['place']
        this.routing.navigate(['map-screen'])
      }
      
    }
  }

  speakText(text: string) {
    tts.speak(text, { lang: 'ru-RU', pitch: 1, rate: 1})
  }

  startWriting(): void {
    
  }
}
