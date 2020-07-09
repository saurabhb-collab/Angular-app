
import { Observable,Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {apiService} from "./apiService"
import { Component, ViewChild, ElementRef  } from '@angular/core';
import {FormGroup,FormBuilder,Validators} from '@angular/forms';
import {HttpClient} from "@angular/common/http"
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/scan';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  {
  myForm:FormGroup;
  @ViewChild('button', { read: ElementRef }) button: ElementRef;
  mobcheck = new Subject<string>();
  disabled = true;
  msg:any 
 

    createForm=function(){
      this.myForm=this.fb.group({         
        city:[null,[Validators.compose([Validators.required])]],
        panName:[null,[Validators.compose([Validators.required,Validators.pattern("[A-Z]{5}[0-9]{4}[A-Z]{1}"),Validators.maxLength(10)])]],
        fullname:[null,[Validators.compose([Validators.required,Validators.min(2), Validators.maxLength(140)])]],
        email:[null,Validators.compose([Validators.required,Validators.email,Validators.maxLength(255)])],
        mobile:[null,[Validators.compose([Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")])]],
        otp:[{value:null, disabled:true},([Validators.required,Validators.maxLength(4),Validators.pattern("[0-9]{4}")])]
    })
  }
   constructor(private fb:FormBuilder,private http:HttpClient,private sr:apiService){
     this.createForm();
        this.mobcheck.pipe(
          debounceTime(1000),
            distinctUntilChanged())
             .subscribe(value => {
               console.log(value);
              });
            }
            getOTP = (allData) => {
                                    if(this.myForm.valid){
                                        this.mobcheck.next(allData);
                                         this.sr.GenerateOtp(allData).subscribe(e=>{
                                          if(e.status == "Success"){
                                            this.msg = "OTP Successfully Sent"
                                               this.myForm.get('otp').enable();
                                                setTimeout(()=>{ this.disabled = false;}, 30000);
                                           }
                                           if(e.status !== "Success"){
                                            this.msg = "Please try again after some time"
                                           }
                                        })
                                      }
                                    }
  
            Resend = (data) => {
                                if(this.myForm.valid){
                                   this.sr.GenerateOtp(data).subscribe(e=>{
                                     if(e.status == "Success"){
                                       this.msg = "OTP Successfully Sent"
                                         let clickStream = Observable.fromEvent( this.button.nativeElement,'click');
                                          clickStream.scan((count: number) => count + 1, 0).subscribe(count =>{if(count == 3){this.disabled = true;
                                           this.msg = "Please try again after an hour"
                                          }
                                        })
                                      };
                                   })
                                }
                              }
                                
            verifyOtp = (verifydata) =>{
                              if(this.myForm.valid){
                                   this.mobcheck.next(verifydata);
                                     var  verifyOtpData =  {"mobile":verifydata.mobile,"otp":verifydata.otp}
                                      this.sr.verifyOtpData(verifyOtpData).subscribe(e=>{
                                 if(e.status == "Success"){
                                     this.msg = "Thanks for Verification"+' '+ verifydata.fullname}
                                    if(e.status !== "Success"){
                                      this.msg  = "Please try Again"
                                   }
                                })
                              }
                            }
                          }
                      
 

  
