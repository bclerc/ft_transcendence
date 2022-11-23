import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { CurrentUserService } from 'src/app/services/user/current_user.service';
import { UserI } from '../../../models/user.models';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.css']
})
export class FileUploaderComponent implements OnInit {
  @Input() user!: UserI;

  selectedFile!: File;
  imagePreview?: string | ArrayBuffer | null;
  subscription?: Subscription;

  constructor(
    private userService: UserService,
    private currentUser: CurrentUserService,
  ) { }

  ngOnInit(): void {
    this.imagePreview = this.user.avatar_url;
  }

  ngOnDestroy(): void {
    if (this.subscription != undefined)
      this.subscription?.unsubscribe();
  }


  onFileUpload(event: any): void {
    this.selectedFile = event.target.files[0]
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(this.selectedFile);

  }

  public OnUploadFile(): void {
    const formData = new FormData();
    formData.append("image", this.selectedFile);
    this.subscription = this.userService.uploadAvatar(formData).subscribe(
      (data: any) => {
        this.currentUser.getCurrentUser().subscribe(
          (data: any) => {
            this.user.avatar_url = data.avatar_url;
          }
        );
      }
    );
  }
}
