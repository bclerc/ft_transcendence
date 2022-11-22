import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserI } from '../../../models/user.models';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.css']
})
export class FileUploaderComponent implements OnInit {
  @Input() user! : UserI;

  selectedFile! : File ;
  imagePreview?: string | ArrayBuffer | null ;
  subscription? : Subscription;

  constructor(private userService : UserService) { }

  ngOnInit(): void {
    this.imagePreview = this.user.avatar_url;
  }

  ngOnDestroy(): void{
    if (this.subscription != undefined)
    this.subscription?.unsubscribe();
  }


  onFileUpload(event: any) : void
  {
    this.selectedFile = event.target.files[0]
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
     reader.readAsDataURL(this.selectedFile);

  }

  public OnUploadFile(): void {
    // console.log("coucou");
    const formData = new FormData();
    formData.append("image", this.selectedFile);
    this.subscription = this.userService.uploadAvatar(formData).subscribe(
      (data : any) => {
      }
    );
    /*return await request(
      `${API_URL}/document`,
      {
        method: "POST",
        body: formData,
      },
    );*/
  }

  /*OnUploadFile(): void {
    if (this.selectedFile)
      this.userService.uploadAvatar(this.selectedFile).subscribe(
        (data : any) => {
        }
      );
    }*/

}
