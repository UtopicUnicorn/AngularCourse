import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SendFormEntity } from '../shared/from-ent';
import { FormSenderService } from '../services/form-sender.service'
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-recduck-frontend',
  templateUrl: './recduck-frontend.component.html',
  styleUrls: ['./recduck-frontend.component.scss']
})
export class RecduckFrontendComponent implements OnInit {
   sendForm!: FormGroup;
   form_ent!: SendFormEntity;
   errMess!: string;
   vacancies!: SendFormEntity[];
   displayedColumns!: string[];
   @ViewChild('fform2') TestFormFormDirective : any;


  constructor(private formSenderservice: FormSenderService,
    private fb: FormBuilder,
    public datepipe: DatePipe,
     )
{
this.createForm();
}

  ngOnInit(): void {
    this.formSenderservice.getVacancies().subscribe(vacancies=>this.vacancies = vacancies);
    this.displayedColumns = ['title', 'schedule', 'address', 'status', 'createdAt', 'updatedAt'];
  }
  createForm(){
    this.sendForm = this.fb.group({
      title: new FormControl('', [Validators.required, Validators.minLength(2)]),
      schedule: new FormControl('',[Validators.required, Validators.minLength(2)]),
      address: new FormControl('',[Validators.required, Validators.email]),
    })
    this.sendForm.valueChanges.subscribe(data=>this.onValueChanged(data));
    this.onValueChanged();
  }

  onSubmit(){
    this.form_ent = this.sendForm.value;
    const form_reply={
      title:this.form_ent.title,
      schedule:this.form_ent.schedule,
      address:this.form_ent.address,
      status: 'open'.toString(),
      createdAt: this.datepipe.transform(Date.now(),'yyyy-MM-dd'),
      updatedAt: this.datepipe.transform(Date.now(),'yyyy-MM-dd')
    }
    
    this.vacancies.push(form_reply);

    this.formSenderservice.postForm(form_reply).subscribe(form_ent =>{
      this.form_ent = form_ent;
    }, errmess =>{this.errMess = <any>errmess;});
    
    console.log(form_reply);

    this.sendForm.reset({
      title: '',
      schedule: '',
      email: ''
    })
    this.TestFormFormDirective.resetForm();
  }

  formErrors = {
    'title': '',
    'schedule': '',
    'address': ''
  };

  validationMessages = {
    'title': {
      'required':      'Title is required.',
      'minlength':     'Title must be at least 2 characters long.'
    },
    'schedule': {
      'required':      'Schedule is required.',
      'minlength':     'Schedule must be at least 2 characters long.',
    },
    'address': {
      'required':      'Email is required.',
      'email':         'Email not in valid format.'
    },
  };

  onValueChanged(data?: any){
    //validators place
    if (!this.sendForm) { return; }
    const form = this.sendForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        //@ts-expect-error
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          //@ts-expect-error
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              //@ts-expect-error
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

}
