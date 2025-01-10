import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UserAdminService } from '../../../service/user-admin.service';
import { environment } from '../../../environment/environment';

@Component({
  selector: 'app-user-image',
  templateUrl: './user-image.component.html',
  styleUrls: ['./user-image.component.scss']
})
export class UserImageComponent implements OnInit, OnChanges {
  @Input() width!: number;
  @Input() height!: number;
  @Input() avatarId!: string;
  @Input() alt?: string;

  resource: SafeResourceUrl;

  private __url?: string;

  constructor(
    private domSanitizer: DomSanitizer,
    private userService: UserAdminService,
  ) {
    this.resource = this.domSanitizer.bypassSecurityTrustResourceUrl(environment.DEFAULT_USER_IMAGE);
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    // if (changes.avatarId && changes.avatarId.currentValue) {
    //   this.loadImage();
    // }
  }

  loadImage(): void {
    this.userService.getAvatar(this.avatarId)
    .subscribe(response => {
      if (!response) {
        // FAILED GET AVATAR
        return;
      }
      this.__url = URL.createObjectURL(response);
      this.resource = this.domSanitizer.bypassSecurityTrustResourceUrl(this.__url);
    });
  }

  revokeurl(): void {
    URL.revokeObjectURL(this.__url!);
  }

  onError(): void {
    URL.revokeObjectURL(this.__url!);
    this.__url = '../../../../assets/images/default_profile.png';
    this.resource = this.domSanitizer.bypassSecurityTrustResourceUrl(this.__url);
  }
}
