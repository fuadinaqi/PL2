import {Component} from '@angular/core';
import { AuthService } from '@services/auth.service';

@Component({
    selector: 'app-messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.scss']
})
export class MessagesComponent {
    public user;

}
