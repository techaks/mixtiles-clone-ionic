import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FrameType } from 'src/app/app.constant';

@Component({
  selector: 'app-review-body',
  templateUrl: './review-body.component.html',
  styleUrls: ['./review-body.component.scss'],
})
export class ReviewBodyComponent implements OnInit {
  @Input() frameType: FrameType = 'bold';
  @Output() onChange = new EventEmitter<string>();

  constructor() {}

  ngOnInit() {}
}