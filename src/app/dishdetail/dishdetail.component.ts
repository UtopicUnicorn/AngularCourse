import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup,Validators } from '@angular/forms';
import {Comment} from '../shared/comment';
import { expand, flyInOut, visibility } from '../animations/app.animation';
@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  host:{
    '[@flyInOut]':'true',
    'style': 'display: block;'
  },
  animations: [
    visibility(),
    flyInOut(),
    expand()
  ]
})
export class DishdetailComponent implements OnInit {
  commentForm!: FormGroup;
  comment!:Comment;
  dish!: Dish | null;
  dishIds!: string[];
  prev!: string;
  next!: string;
  errMess!: string;
  dishCopy!:Dish | null;
  visibility = 'shown';
  
  @ViewChild('fform1') commentFormDirective : any;

  constructor(private dishService: DishService,
    private route: ActivatedRoute,
    private location: Location,
    @Inject('BaseURL') public BaseURL:any,
    private fb:FormBuilder) {
      this.createForm();
     }

  ngOnInit(): void { 
    this.dishService.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
    this.route.params.pipe(switchMap((params: Params) => { this.visibility = 'hidden'; return this.dishService.getDish(params['id']); }))
    .subscribe(dish => { this.dish = dish; this.dishCopy = dish; this.setPrevNext(dish.id); this.visibility = 'shown'; },
      errmess => this.errMess = <any>errmess);
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack() : void{
    this.location.back();
  }

  formErrors = {
    'author': '',
    'comment': '',
  };

  validationMessages = {
    'author': {
      'required':      'Name is required.',
      'minlength':     'Name must be at least 2 characters long.'
    },
    'comment': {
      'required':      'Comment is required.',
      'minlength':     'Comment must be at least 2 characters long.',
    },
  };

  createForm(){
    this.commentForm = this.fb.group({
      author: new FormControl('', [Validators.required, Validators.minLength(2)] ),
      comment: new FormControl('', [Validators.required, Validators.minLength(2)] ),
      rating: 5,
    });
    
    this.commentForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }
  onSubmit() {
    this.comment = this.commentForm.value;
    console.log(this.comment);
    var obj={
      author:this.comment.author,
      comment:this.comment.comment,
      rating: this.comment.rating,
      date: Date.now().toString()
    }
    this.dishCopy!.comments.push(obj);
    //@ts-expect-error
    this.dishService.putDish(this.dishCopy)
    .subscribe(dish => {
      this.dish = dish; this.dishCopy = dish;
    },
  errmess => { this.dish = null; this.dishCopy = null; this.errMess = <any>errmess; });
    this.commentFormDirective.resetForm();
    this.commentForm.reset({
      author: '',
      comment: '',
      rating: 5,
    });
  }

  onValueChanged(data?: any) {
    if (!this.commentForm) { return; }
    const form = this.commentForm;

    if(this.formErrors.author!='')
    this.formErrors.author = '';
    if(this.formErrors.comment!='')
    this.formErrors.comment = '';
    const authLength = form.value.author.length;
    const commLength = form.value.comment.length;
    switch(true)
    {
      case (authLength ===0):
        {
          this.formErrors.author = this.validationMessages.author.required;
          break;
        }
      case (authLength<2 && authLength>0):
        {
          this.formErrors.author = this.validationMessages.author.minlength;
          break;
        }
    }
    switch(true)
    {
      case (commLength ===0):
        {
          this.formErrors.comment = this.validationMessages.comment.required;
          break;
        }
      case (commLength<2 && commLength>0):
        {
          this.formErrors.comment = this.validationMessages.comment.minlength;
          break;
        }
    }
  }

}
