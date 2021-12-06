import { Component, Inject, OnInit } from '@angular/core';
import { LeaderService } from '../services/leader.service';
import {Leader} from '../shared/leader';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { expand, flyInOut } from '../animations/app.animation';


@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  host:{
    '[@flyInOut]':'true',
    'style': 'display: block;'
  },
  animations:[
    flyInOut(),
    expand()
  ]
})
export class AboutComponent implements OnInit {

  leaders!:Leader[];
  leaderErrMessage!:string;

  constructor(private leaderService: LeaderService,
    private route: ActivatedRoute,
    private location: Location,
    @Inject('BaseURL') public BaseURL:any) { }

  ngOnInit(): void {
    this.leaderService.getLeaders().subscribe(leaders=>this.leaders = leaders,
      errmess =>this.leaderErrMessage=<any>errmess);
  }

}
