import { Component, HostListener, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommandRecognitionService } from '../service/command-recognition.service';
import { VoiceRecognitionService } from '../service/voice-recognition.service';
import {TEMP} from '../service/extendedData.js'
import tts from 'tts-js'

declare const annyang: any;

@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.css'],
  providers: [VoiceRecognitionService, CommandRecognitionService]
})
export class MainScreenComponent implements OnInit {

  voiceActiveSectionDisabled: boolean = true
	voiceActiveSectionError: boolean = false
	voiceActiveSectionSuccess: boolean = false
	voiceActiveSectionListening: boolean = false
	voiceText: any
  
  canRecord: boolean = false

  mainText: string = ''
  recording = false
  storedFileNames: string[] = []

  keyboardEntrering: boolean = false

  constructor(private ngZone: NgZone,
              public crService : CommandRecognitionService,
              private routing: Router) {
  }

  async ngOnInit() {
    this.mainText = "Привет, я - Соня!"
    var recPerm = true
    await navigator.mediaDevices.getUserMedia({audio: true}).catch(function(err) {
      recPerm = false
    })
    this.canRecord = recPerm
  }

  async startListening() {
    this.recording = !this.recording
    if (this.recording == true)
    {
      this.mainText = '...'
      this.startVoiceRecognition()
    }
    else
    {
      this.closeVoiceRecognition()
      if(this.mainText == '...')
      {
        this.mainText = "Привет, я - Соня!"
        return
      }
      await new Promise(f => setTimeout(f, 2000)); 
      var commandResult = this.crService.getCommand(this.mainText);
      this.mainText = commandResult['text']
      this.speakText(commandResult['tts'])

      if(commandResult['redirectToMap'])
      {
        await new Promise(f => setTimeout(f, 2000)); 
        TEMP.SELECTED_PLACE = commandResult['place']
        this.routing.navigate(['map-screen'])
      }
      
    }
  }

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if(this.keyboardEntrering)
    {
      if(event.key == 'Backspace')
      {
        if(this.mainText.length != 0)
          this.mainText = this.mainText.substring(0, this.mainText.length-1)
      }
      else if(event.key == 'Space')
        this.mainText += ' '
      else if(event.key == 'Enter')
      {
        this.startWriting()
      }
      else if(event.key.length === 1)
        this.mainText += event.key
    }
     
  }

  onKeydown(event: KeyboardEvent) {
    return event.key
  }

  speakText(text: string) {
    tts.speak(text, { lang: 'ru-RU', pitch: 1, rate: 1})
  }

  async startWriting() {
    this.keyboardEntrering = !this.keyboardEntrering;
    if(this.keyboardEntrering)
      this.mainText = ''
    else {
      if(this.mainText == '')
      {
        this.mainText = "Привет, я - Соня!"
        return
      }
      await new Promise(f => setTimeout(f, 2000)); 
      var commandResult = this.crService.getCommand(this.mainText);
      this.mainText = commandResult['text']
      this.speakText(commandResult['tts'])

      if(commandResult['redirectToMap'])
      {
        await new Promise(f => setTimeout(f, 2000)); 
        TEMP.SELECTED_PLACE = commandResult['place']
        this.routing.navigate(['map-screen'])
      }
    }
  }

  initializeVoiceRecognitionCallback(): void {
		annyang.addCallback('error', (err) => {
      if(err.error === 'network'){
        this.mainText = "Internet is require";
        annyang.abort();
        this.ngZone.run(() => this.voiceActiveSectionSuccess = true);
      } else if (this.voiceText === undefined) {
				this.ngZone.run(() => this.voiceActiveSectionError = true);
				annyang.abort();
			}
		});

		annyang.addCallback('soundstart', (res) => {
      this.ngZone.run(() => this.voiceActiveSectionListening = true);
		});

		annyang.addCallback('end', () => {
      if (this.voiceText === undefined) {
        this.ngZone.run(() => this.voiceActiveSectionError = true);
				annyang.abort();
			}
		});

		annyang.addCallback('result', (userSaid) => {
			this.ngZone.run(() => this.voiceActiveSectionError = false);

			let queryText: any = userSaid[0];

			annyang.abort();

      this.voiceText = queryText;
      this.mainText = this.voiceText
			this.ngZone.run(() => this.voiceActiveSectionListening = false);
      this.ngZone.run(() => this.voiceActiveSectionSuccess = true);
		});
	}
  startVoiceRecognition(): void {
    this.voiceActiveSectionDisabled = false;
		this.voiceActiveSectionError = false;
		this.voiceActiveSectionSuccess = false;
    this.voiceText = undefined;
    annyang.setLanguage('ru');
		if (annyang) {
			let commands = {
			};

			annyang.addCommands(commands);

      this.initializeVoiceRecognitionCallback();
      
			annyang.start({ autoRestart: false });
		}
	}

	closeVoiceRecognition(): void {
    this.voiceActiveSectionDisabled = true;
		this.voiceActiveSectionError = false;
		this.voiceActiveSectionSuccess = false;
		this.voiceActiveSectionListening = false;
		this.voiceText = undefined;

		if(annyang){
      annyang.abort();
    }
	}
}
