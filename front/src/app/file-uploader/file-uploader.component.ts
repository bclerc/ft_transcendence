import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user/user.service';

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.css']
})
export class FileUploaderComponent implements OnInit {

  constructor(private userService : UserService) { }

  ngOnInit(): void {
  }

  selectedFile! : File ;
  imagePreview?: string | ArrayBuffer | null;

  onFileUpload(event: any) : void
  {
    this.selectedFile = event.target.files[0]
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
     reader.readAsDataURL(this.selectedFile);

  }

  public async OnUploadFile() {
    const formData = new FormData();
    formData.append("image", this.selectedFile);
    await this.userService.uploadAvatar(formData).subscribe(
      (data : any) => {
        console.log("data =",data);
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
    console.log(this.selectedFile);
    if (this.selectedFile)
      this.userService.uploadAvatar(this.selectedFile).subscribe(
        (data : any) => {
          console.log("data =",data);
        }
      );
    }*/

}
