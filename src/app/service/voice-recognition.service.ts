import { Injectable } from '@angular/core';
import { MainScreenComponent } from '../main-screen/main-screen.component';

declare var webkitSpeechRecognition: any;

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
    this.recognition.lang = 'ru-RU';

    this.recognition.addEventListener('result', (e) => {
      const transcript = e.results[0][0].transcript
      this.tempWords = transcript;
    });
  }

  start() {
    this.text = ''
    this.isStoppedSpeechRecog = false;
    this.recognition.start();
    this.recognition.addEventListener('end', (condition) => {
      if (this.isStoppedSpeechRecog) {
        this.recognition.stop();
      } else {
        this.wordConcat()
        this.recognition.start();
      }
    });
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
