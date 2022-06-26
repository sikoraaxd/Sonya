import { Injectable } from '@angular/core';
import { MainScreenComponent } from '../main-screen/main-screen.component';

declare var webkitSpeechRecognition: any;
declare var SpeechRecognition: any;

@Injectable({
  providedIn: 'root'
})
export class VoiceRecognitionService {

  recognition =  new webkitSpeechRecognition();
  isStoppedSpeechRecog = false;
  public text = '';
  tempWords;

  constructor() { }

  init() {

    this.recognition.interimResults = true;
    this.recognition.continuous = true;
    this.recognition.lang = 'ru-RU';

    this.recognition.addEventListener('result', (e) => {
      var interim_transcript = ''
      for(var i = e.resultIndex; i < e.results.length; ++i) {
        if(e.results[i].isFinal) {
          this.text += e.results[i][0].transcript
        } else {
          interim_transcript += e.results[i][0].transcript
        }
      }
    });
    
    this.recognition.addEventListener('end', (condition) => {
      if (this.isStoppedSpeechRecog) {
        this.recognition.stop();
      } else {
        this.recognition.start();
      }
    });
  }

  start() {
    this.text = ''
    this.isStoppedSpeechRecog = false;
    this.recognition.start();
    
  }

  stop() {
    this.isStoppedSpeechRecog = true;
    this.recognition.stop();
  }

  wordConcat() {
    this.text = this.text + ' ' + this.tempWords
    this.tempWords = ''
  }
} 
