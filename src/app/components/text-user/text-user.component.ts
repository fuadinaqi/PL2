import { Component } from '@angular/core'
import { UserService } from '@services/user.service'

@Component({
  selector: 'app-text-user',
  templateUrl: './text-user.component.html',
})
export class TextUserComponent {
  constructor(public user: UserService) {}
}
