import { Injectable } from '@angular/core';
import { MainScreenComponent } from '../main-screen/main-screen.component';

declare var webkitSpeechRecognition: any;
declare var SpeechRecognition: any;

@Injectable({
  providedIn: 'root'
})
export class VoiceRecognitionService {

  recognition =  new webkitSpeechRecognition || new SpeechRecognition;
  isStoppedSpeechRecog = false;
  public text = '';
  tempWords;

  constructor() { }

  init() {

    this.recognition.interimResults = true;
    this.recognition.lang = 'ru-RU';

    this.recognition.addEventListener('result', (e) => {
      var current = e.resultIndex;
      const transcript = e.results[current][0].transcript
      this.tempWords = transcript;
    });
    
    this.recognition.addEventListener('end', (condition) => {
      if (this.isStoppedSpeechRecog) {
        this.recognition.stop();
      } else {
        this.wordConcat()
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
    this.wordConcat()
    this.recognition.stop();
  }

  wordConcat() {
    this.text = this.text + ' ' + this.tempWords
    this.tempWords = ''
  }
} 
