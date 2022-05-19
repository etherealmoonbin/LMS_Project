import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-add-lesson-modal',
  templateUrl: './add-lesson-modal.component.html',
  styleUrls: ['./add-lesson-modal.component.scss'],
})
export class AddLessonModalComponent implements OnInit {

  attachment1: any = null;
  attachment2: any = null;
  attachment3: any = null;
  attachment4: any = null;
  attachment5: any = null;
  isTeacher: any;
  isAttachmentInvalid: any = false;

  constructor(
    private storage: Storage,
    private modalController: ModalController
  ) { }

  async ngOnInit() {
    this.isTeacher = await this.storage.get('authority');
  }

  attachImg(event, index) {
    const file = event.target.files[0];
    if(file.type == "image/jpeg" || file.type == "image/jpg" || file.type == "image/png") {
      const reader = new FileReader();
  
      reader.readAsDataURL(file);
    
      reader.onload = () => {
    
        // get the blob of the image:
        let base64 = reader.result
    
        // create blobURL, such that we could use it in an image element:
        let attachmentb64 = base64;
  
        switch (index) {
          case 1:
            this.attachment1 = attachmentb64;
            break;
          case 2:
            this.attachment2 = attachmentb64;
            break;
          case 3:
            this.attachment3 = attachmentb64;
            break;
          case 4:
            this.attachment4 = attachmentb64;
            break;
          case 5:
            this.attachment5 = attachmentb64;
            break;
        }
      };
    
      reader.onerror = (error) => {
    
        //handle errors
    
      };

      this.isAttachmentInvalid = false;
    } else {
      alert('Invalid attachment file. JPG/JPEG/PNG Allowed');
      this.isAttachmentInvalid = true;
    }

  }

  uploadLesson () {
    if(this.attachment1 || this.attachment2 || this.attachment3 || this.attachment4 || this.attachment5) {
      if(this.isAttachmentInvalid) {
        alert('Invalid attached file. JPG/JPEG/PNG Allowed');
      } else {
        this.modalController.dismiss(
          [this.attachment1,
          this.attachment2,
          this.attachment3,
          this.attachment4,
          this.attachment5
        ]
        )
      }
    } else {
      alert('Attachments cannot be empty. To cancel adding lesson press Back key');
    }
  }
}
