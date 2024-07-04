import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

export interface TextMessageEvent {
  file: File;
  prompt?: string | null;
}

@Component({
  selector: 'app-text-message-box-file',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './textMessageBoxFile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextMessageBoxFileComponent { 
  
  @Input() placeholder: string = '';
 
  @Output() onMessage = new EventEmitter<TextMessageEvent>();
 
  public isSelectedfile = signal<boolean>(false);

  public fb = inject( FormBuilder )

  public myForm = this.fb.group({
    prompt: [''],
    file: [null, Validators.required]

  }); 

  public file: File | undefined;


  handleSelectedFile( event: any){
    const file = event.target.files.item(0)
    this.myForm.controls.file.setValue( file )
    this.isSelectedfile.set( true );
  }

  handleSubmit() {
    if(this.myForm.invalid) return;

    const{ prompt, file } = this.myForm.value
    if(file) {

      this.onMessage.emit({prompt, file});
      this.myForm.reset();
      this.isSelectedfile.set( false )
    }
  }
}
