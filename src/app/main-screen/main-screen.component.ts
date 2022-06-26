import { Component, OnInit } from '@angular/core';
import { RecordingData, VoiceRecorder } from 'capacitor-voice-recorder';
import { interval } from 'rxjs';
import { CommandRecognitionService } from '../service/command-recognition.service';
import { VoiceRecognitionService } from '../service/voice-recognition.service';


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
              public crService : CommandRecognitionService) {
    this.srService.init()
  }

  ngOnInit(): void {
    VoiceRecorder.canDeviceVoiceRecord
    VoiceRecorder.requestAudioRecordingPermission()
    this.mainText = "Привет, я - Соня!"
  }

  async startListening() {
    this.recording = !this.recording
    if (this.recording == true)
    {
      this.mainText = '...'
      this.srService.start()
    }
    else
    {
      this.srService.stop()
      this.mainText = this.srService.text
      await new Promise(f => setTimeout(f, 2000));
      this.mainText = this.crService.getCommand(this.mainText);
    }
  }

  startWriting(): void {
    
  }
}
