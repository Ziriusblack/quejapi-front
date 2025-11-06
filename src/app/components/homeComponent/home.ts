import { Component } from '@angular/core';
import { NavigationBar } from "../navigation-bar/navigation-bar";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavigationBar],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {
  imagePath: string = 'assets/img/transcaribe.png';
}
